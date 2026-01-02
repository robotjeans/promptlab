import { Injectable, Logger } from '@nestjs/common';
import { ChromaClient, Collection } from 'chromadb';
import { ConfigService } from '@nestjs/config';
import { EmbeddingService } from './embedding.service';
import { DocumentMetadata } from './rag.types';

@Injectable()
export class ChromaService {
  private readonly logger = new Logger(ChromaService.name);
  private readonly chroma: ChromaClient;

  constructor(
    private configService: ConfigService,
    private embeddingService: EmbeddingService,
  ) {
    const chromaUrl =
      this.configService.get<string>('CHROMA_URL') || 'http://chroma:8000';
    this.chroma = new ChromaClient({ path: chromaUrl });
    this.logger.log(`Connected to ChromaDB at ${chromaUrl}`);
  }

  async getOrCreateCollection(name: string): Promise<Collection> {
    try {
      return await this.chroma.getOrCreateCollection({
        name,
        embeddingFunction: this.embeddingService.getEmbeddingFunction(),
        metadata: { 'hnsw:space': 'cosine' },
      });
    } catch (error) {
      this.logger.error(`Failed to get/create collection ${name}`, error);
      throw error;
    }
  }

  async addDocuments(
    collection: Collection,
    chunks: string[],
    metadata: DocumentMetadata[],
    userId: string,
  ): Promise<void> {
    const timestamp = Date.now();
    const docIds = chunks.map(
      (_, idx) => `${userId}_${timestamp}_chunk_${idx}`,
    );

    await collection.add({
      ids: docIds,
      documents: chunks,
      metadatas: metadata,
    });
  }

  async queryDocuments(
    collection: Collection,
    question: string,
    nResults: number,
  ) {
    return await collection.query({
      queryTexts: [question],
      nResults,
    });
  }

  async deleteOldDocuments(
    userId: string,
    olderThanDays: number,
  ): Promise<number> {
    try {
      const collectionName = this.sanitizeCollectionName(userId);
      const collection = await this.chroma.getCollection({
        name: collectionName,
        embeddingFunction: this.embeddingService.getEmbeddingFunction(),
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

      return idsToDelete.length;
    } catch (error) {
      this.logger.error(
        `Failed to cleanup documents for user ${userId}`,
        error,
      );
      throw error;
    }
  }

  sanitizeCollectionName(userId: string): string {
    const sanitized = `user_${userId.replace(/[^a-zA-Z0-9-_]/g, '_')}`;

    if (sanitized.length > 63) {
      throw new Error('User ID too long for ChromaDB collection name');
    }

    return sanitized;
  }
}
