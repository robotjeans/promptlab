import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { ChromaService } from './chroma.service';
import { DocumentParserService } from './document-parser.service';
import { TextChunkerService } from './text-chunker.service';
import { OpenAIService } from './openai.service';
import { EmbeddingService } from './embedding.service';

@Module({
  controllers: [RagController],
  providers: [
    RagService,
    ChromaService,
    DocumentParserService,
    TextChunkerService,
    OpenAIService,
    EmbeddingService,
  ],
  exports: [RagService],
})
export class RagModule {}
