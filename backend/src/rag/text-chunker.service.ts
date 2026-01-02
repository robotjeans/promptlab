import { Injectable } from '@nestjs/common';

@Injectable()
export class TextChunkerService {
  private readonly CHUNK_SIZE = 1000;
  private readonly CHUNK_OVERLAP = 200;

  chunkText(text: string): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + this.CHUNK_SIZE, text.length);
      const chunk = text.substring(startIndex, endIndex);
      chunks.push(chunk.trim());

      // Move forward by (CHUNK_SIZE - CHUNK_OVERLAP) to create overlap
      startIndex += this.CHUNK_SIZE - this.CHUNK_OVERLAP;
    }

    return chunks.filter((chunk) => chunk.length > 0);
  }

  truncateText(text: string, maxChars: number = 300): string {
    return text.length > maxChars ? text.substring(0, maxChars) + '...' : text;
  }
}
