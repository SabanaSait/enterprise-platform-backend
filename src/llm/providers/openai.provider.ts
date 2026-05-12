import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { LLMProvider } from '../interfaces/llm-provider.interface';

@Injectable()
export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    this.client = new OpenAI({
      apiKey,
    });
  }

  async *stream(message: string): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        yield content;
      }
    }
  }
}
