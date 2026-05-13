import { Injectable } from '@nestjs/common';
import { LLMService } from 'src/llm/llm.service';
import { ContextBuilder } from './context-builder.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly llmService: LLMService,
    private readonly contextBuilder: ContextBuilder,
  ) {}

  async streamResponse(message: string): Promise<AsyncIterable<string>> {
    const enrichedPrompt = await this.contextBuilder.build(message);

    return this.llmService.stream(enrichedPrompt);
  }
}
