import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { LLMProvider } from '../interfaces/llm-provider.interface';
import { Message } from '../interfaces/message.interface';

@Injectable()
export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model = 'gpt-4o-mini';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    this.client = new OpenAI({
      apiKey,
    });
  }

  async *stream(messages: Message[]): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;

      if (content) {
        yield content;
      }
    }
  }

  async generate(messages: Message[]): Promise<string> {
    const response = this.client.chat.completions.create({
      model: this.model,
      messages,
    });

    return (await response).choices[0].message?.content || '';
  }
}
