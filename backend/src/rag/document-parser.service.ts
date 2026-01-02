import { Injectable, Logger } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class DocumentParserService {
  private readonly logger = new Logger(DocumentParserService.name);

  async extractText(fileName: string, buffer: Buffer): Promise<string> {
    if (fileName.endsWith('.txt')) {
      return this.extractTextFile(buffer);
    }

    if (fileName.endsWith('.pdf')) {
      return this.extractPdfFile(buffer);
    }

    throw new Error('Unsupported file type. Only .pdf and .txt are supported');
  }

  private extractTextFile(buffer: Buffer): string {
    return buffer.toString('utf-8');
  }

  private async extractPdfFile(buffer: Buffer): Promise<string> {
    let parser: PDFParse | null = null;
    try {
      const uint8Array = new Uint8Array(buffer);
      parser = new PDFParse({ data: uint8Array });
      const result = await parser.getText();

      if (!result.text || result.text.trim().length === 0) {
        throw new Error(
          'PDF appears to be empty or contains no extractable text',
        );
      }

      const pageCount = result.text.split('\f').length || 1;
      this.logger.log(`Extracted ${pageCount} pages from PDF`);

      return result.text;
    } catch (error) {
      this.logger.error('PDF parsing failed', error);
      throw new Error(`Failed to parse PDF: ${(error as Error).message}`);
    } finally {
      if (parser) {
        await parser.destroy();
      }
    }
  }
}
