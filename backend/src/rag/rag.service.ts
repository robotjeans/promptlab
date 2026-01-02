import { Injectable, Logger } from '@nestjs/common';
import { ChromaService } from './chroma.service';
import { DocumentParserService } from './document-parser.service';
import { TextChunkerService } from './text-chunker.service';
import { OpenAIService } from './openai.service';
import { QueryResult, DocumentMetadata, SourceInfo } from './rag.types';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private chromaService: ChromaService,
    private documentParser: DocumentParserService,
    private textChunker: TextChunkerService,
    private openAIService: OpenAIService,
  ) {}

  async processAndQuery(
    userId: string,
    fileName: string,
    fileBuffer: Buffer,
    question: string,
  ): Promise<QueryResult> {
    try {
      // 1. Extract text from document
      const text = await this.documentParser.extractText(fileName, fileBuffer);

      // 2. Split text into chunks
      const chunks = this.textChunker.chunkText(text);
      this.logger.log(`Extracted ${chunks.length} chunks from ${fileName}`);

      // 3. Get or create ChromaDB collection
      const collectionName = this.chromaService.sanitizeCollectionName(userId);
      const collection =
        await this.chromaService.getOrCreateCollection(collectionName);

      // 4. Prepare metadata for each chunk
      const chunkMetadatas: DocumentMetadata[] = chunks.map((_, idx) => ({
        fileName,
        userId,
        uploadedAt: new Date().toISOString(),
        chunkIndex: idx,
        totalChunks: chunks.length,
      }));

      // 5. Store chunks in ChromaDB
      await this.chromaService.addDocuments(
        collection,
        chunks,
        chunkMetadatas,
        userId,
      );

      // 6. Query for relevant chunks
      const results = await this.chromaService.queryDocuments(
        collection,
        question,
        Math.min(3, chunks.length),
      );

      // 7. Extract contexts and metadata from results (filter out nulls)
      const contextsRaw = results.documents?.[0] || [];
      const contexts = contextsRaw.filter((ctx): ctx is string => ctx !== null);
      const metadatas = (results.metadatas?.[0] ||
        []) as Array<Partial<DocumentMetadata> | null>;
      const combinedContext = contexts.join('\n\n');

      // 8. Generate answer using OpenAI
      const answer = await this.openAIService.generateAnswer(
        question,
        combinedContext,
      );

      // 9. Format and return results
      return {
        answer,
        sources: this.formatSources(contexts, metadatas),
      };
    } catch (error) {
      this.logger.error('Error in processAndQuery', error);
      throw new Error(`RAG processing failed: ${(error as Error).message}`);
    }
  }

  async cleanupOldDocuments(
    userId: string,
    olderThanDays: number = 30,
  ): Promise<number> {
    return this.chromaService.deleteOldDocuments(userId, olderThanDays);
  }

  private formatSources(
    contexts: string[],
    metadatas: Array<Partial<DocumentMetadata> | null>,
  ): SourceInfo[] {
    return metadatas
      .map((meta, idx): SourceInfo | null => {
        if (!meta) return null;
        return {
          text: this.textChunker.truncateText(contexts[idx] || ''),
          fileName: String(meta.fileName || 'Unknown'),
          uploadedAt: String(meta.uploadedAt || ''),
          chunkIndex: Number(meta.chunkIndex ?? 0),
        };
      })
      .filter((source): source is SourceInfo => source !== null);
  }
}
