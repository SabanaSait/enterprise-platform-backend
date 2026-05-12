import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIProvider } from './providers/openai.provider';
import { GroqProvider } from './providers/groq.provider';
import { LLMProvider } from './interfaces/llm-provider.interface';

@Injectable()
export class LLMService {
  private provider: LLMProvider;
  constructor(
    private readonly configService: ConfigService,
    private readonly openAIProvider: OpenAIProvider,
    private readonly groqProvider: GroqProvider,
  ) {
    const providerName =
      this.configService.get<string>('LLM_PROVIDER') || 'groq';

    if (providerName === 'openai') {
      this.provider = this.openAIProvider;
    } else if (providerName === 'groq') {
      this.provider = this.groqProvider;
    } else {
      throw new Error(`Unsupported LLM provider: ${providerName}`);
    }
  }

  stream(message: string): AsyncIterable<string> {
    return this.provider.stream(message);
  }
}
