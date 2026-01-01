import { Injectable, Logger } from '@nestjs/common';
import {
  ChromaClient,
  Collection,
  Metadata,
  EmbeddingFunction,
} from 'chromadb';
import { ConfigService } from '@nestjs/config';
import { PDFParse } from 'pdf-parse';

class CustomOpenAIEmbedding implements EmbeddingFunction {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'text-embedding-3-small') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(texts: string[]): Promise<number[][]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        input: texts,
        model: this.model,
      }),
    });

    const data = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
    };
    return data.data.map((item) => item.embedding);
  }
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export interface DocumentMetadata extends Metadata {
  fileName: string;
  userId: string;
  uploadedAt: string;
  chunkIndex: number;
  totalChunks: number;
}

export interface SourceInfo {
  text: string;
  fileName: string;
  uploadedAt: string;
  chunkIndex: number;
}

export interface QueryResult {
  answer: string;
  sources: SourceInfo[];
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private readonly chroma: ChromaClient;
  private readonly openaiApiKey: string;
  private readonly embeddingFunction: EmbeddingFunction;
  private readonly CHUNK_SIZE = 1000;
  private readonly CHUNK_OVERLAP = 200;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is missing in environment variables');
    }
    this.openaiApiKey = apiKey;

    // Initialize custom OpenAI embedding function for ChromaDB 3.2.0
    this.embeddingFunction = new CustomOpenAIEmbedding(
      apiKey,
      'text-embedding-3-small',
    );

    // Check if CHROMA_URL is provided for external ChromaDB server
    const chromaUrl = this.configService.get<string>('CHROMA_URL');

    if (chromaUrl) {
      this.logger.log(`Connecting to ChromaDB at ${chromaUrl}`);
      this.chroma = new ChromaClient({ path: chromaUrl });
    } else {
      // Use in-memory client when no URL is provided
      this.logger.warn(
        'No CHROMA_URL provided - using in-memory ChromaDB (data will not persist between restarts)',
      );
      this.chroma = new ChromaClient();
    }
  }

  async processAndQuery(
    userId: string,
    fileName: string,
    fileBuffer: Buffer,
    question: string,
  ): Promise<QueryResult> {
    try {
      // Extract and chunk text
      const text = await this.extractText(fileName, fileBuffer);
      const chunks = this.chunkText(text);

      this.logger.log(`Extracted ${chunks.length} chunks from ${fileName}`);

      // Get or create collection with OpenAI embeddings
      const collectionName = `user_${userId}`;
      const collection = await this.getOrCreateCollection(collectionName);

      // Store chunks with unique IDs
      const timestamp = Date.now();
      const docIds = chunks.map(
        (_, idx) => `${userId}_${timestamp}_chunk_${idx}`,
      );

      const chunkMetadatas: DocumentMetadata[] = chunks.map((_, idx) => ({
        fileName,
        userId,
        uploadedAt: new Date().toISOString(),
        chunkIndex: idx,
        totalChunks: chunks.length,
      }));

      await collection.add({
        ids: docIds,
        documents: chunks,
        metadatas: chunkMetadatas,
      });

      // Query with multiple results for better context
      const results = await collection.query({
        queryTexts: [question],
        nResults: Math.min(3, chunks.length),
      });

      // Combine context from multiple chunks
      const contexts = results.documents?.[0] || [];
      const metadatas = (results.metadatas?.[0] ||
        []) as Array<Partial<DocumentMetadata> | null>;
      const combinedContext = contexts.join('\n\n');

      // Generate answer
      const answer = await this.generateAnswer(question, combinedContext);

      return {
        answer,
        sources: metadatas
          .map((meta, idx): SourceInfo | null => {
            if (!meta) return null;
            return {
              text: this.truncateContext(contexts[idx] || ''),
              fileName: String(meta.fileName || 'Unknown'),
              uploadedAt: String(meta.uploadedAt || ''),
              chunkIndex: Number(meta.chunkIndex ?? 0),
            };
          })
          .filter((source): source is SourceInfo => source !== null),
      };
    } catch (error) {
      this.logger.error('Error in processAndQuery', error);
      throw new Error(`RAG processing failed: ${(error as Error).message}`);
    }
  }

  private async getOrCreateCollection(name: string): Promise<Collection> {
    try {
      return await this.chroma.getOrCreateCollection({
        name,
        embeddingFunction: this.embeddingFunction,
        metadata: { 'hnsw:space': 'cosine' },
      });
    } catch (error) {
      this.logger.error(`Failed to get/create collection ${name}`, error);
      throw error;
    }
  }

  private chunkText(text: string): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + this.CHUNK_SIZE, text.length);
      const chunk = text.substring(startIndex, endIndex);
      chunks.push(chunk.trim());

      // Move forward by (CHUNK_SIZE - CHUNK_OVERLAP)
      startIndex += this.CHUNK_SIZE - this.CHUNK_OVERLAP;
    }

    return chunks.filter((chunk) => chunk.length > 0);
  }

  private async extractText(fileName: string, buffer: Buffer): Promise<string> {
    if (fileName.endsWith('.txt')) {
      return buffer.toString('utf-8');
    }

    if (fileName.endsWith('.pdf')) {
      let parser: PDFParse | null = null;
      try {
        // Convert Buffer to Uint8Array for compatibility
        const uint8Array = new Uint8Array(buffer);
        parser = new PDFParse({ data: uint8Array });
        const result = await parser.getText();

        if (!result.text || result.text.trim().length === 0) {
          throw new Error(
            'PDF appears to be empty or contains no extractable text',
          );
        }

        // Count pages from text or use metadata if available
        const pageCount = result.text.split('\f').length || 1;
        this.logger.log(`Extracted ${pageCount} pages from PDF`);
        return result.text;
      } catch (error) {
        this.logger.error('PDF parsing failed', error);
        throw new Error(`Failed to parse PDF: ${(error as Error).message}`);
      } finally {
        // Always cleanup parser resources
        if (parser) {
          await parser.destroy();
        }
      }
    }

    throw new Error('Unsupported file type. Use .pdf or .txt');
  }

  private async generateAnswer(
    question: string,
    context: string,
  ): Promise<string> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'Answer using only the provided context. If the answer is not in the context, say "I don\'t know based on the given document."',
              },
              {
                role: 'user',
                content: `Context: ${context}\n\nQuestion: ${question}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        },
      );

      const rawData: OpenAIResponse = (await response.json()) as OpenAIResponse;

      if (!response.ok) {
        const msg = rawData?.error?.message || 'Unknown OpenAI error';
        this.logger.error(`OpenAI error (${response.status}): ${msg}`);
        return `Error: ${msg}`;
      }

      if (!rawData.choices?.[0]?.message?.content) {
        this.logger.error('Unexpected OpenAI response', rawData);
        return 'Error: Invalid response from AI';
      }

      return rawData.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error('OpenAI fetch error', error);
      return 'Error: Failed to reach AI service';
    }
  }

  private truncateContext(text: string, maxChars = 300): string {
    return text.length > maxChars ? text.substring(0, maxChars) + '...' : text;
  }

  // Cleanup method for old documents (call periodically or via cron)
  async cleanupOldDocuments(userId: string, olderThanDays: number = 30) {
    try {
      const collectionName = `user_${userId}`;
      const collection = await this.chroma.getCollection({
        name: collectionName,
        embeddingFunction: this.embeddingFunction,
      });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const allDocs = await collection.get();
      const idsToDelete = allDocs.ids.filter((_, idx) => {
        const uploadedAt = allDocs.metadatas?.[idx]?.uploadedAt;
        if (uploadedAt && typeof uploadedAt === 'string') {
          return new Date(uploadedAt) < cutoffDate;
        }
        return false;
      });

      if (idsToDelete.length > 0) {
        await collection.delete({ ids: idsToDelete });
        this.logger.log(
          `Deleted ${idsToDelete.length} old documents for user ${userId}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to cleanup documents for user ${userId}`,
        error,
      );
    }
  }
}
