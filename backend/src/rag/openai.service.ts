import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is missing in environment variables');
    }
    this.apiKey = apiKey;
  }

  async generateAnswer(question: string, context: string): Promise<string> {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
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
}
