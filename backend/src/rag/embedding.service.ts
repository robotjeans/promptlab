import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingFunction } from 'chromadb';
import { ConfigService } from '@nestjs/config';

class CustomOpenAIEmbedding implements EmbeddingFunction {
  private readonly apiKey: string;
  private readonly model: string;

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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
    };
    return data.data.map((item) => item.embedding);
  }
}

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly embeddingFunction: EmbeddingFunction;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is missing in environment variables');
    }

    this.embeddingFunction = new CustomOpenAIEmbedding(
      apiKey,
      'text-embedding-3-small',
    );
    this.logger.log('Embedding service initialized with OpenAI');
  }

  getEmbeddingFunction(): EmbeddingFunction {
    return this.embeddingFunction;
  }
}
