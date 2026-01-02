import { Metadata } from 'chromadb';

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
