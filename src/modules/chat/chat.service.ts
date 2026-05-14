import { Injectable } from '@nestjs/common';
import { LLMService } from 'src/llm/llm.service';
import { ContextBuilder } from './context-builder.service';
import { Message } from 'src/llm/interfaces/message.interface';
import { SYSTEM_PROMPT } from 'src/llm/prompts/system.prompt';

@Injectable()
export class ChatService {
  private history: Message[] = [];
  private MAX_HISTORY = 6;

  constructor(
    private readonly llmService: LLMService,
    private readonly contextBuilder: ContextBuilder,
  ) {}

  async streamResponse(message: string): Promise<AsyncIterable<string>> {
    this.history.push({ role: 'user', content: message });

    const enrichedPrompt = await this.contextBuilder.build(message);

    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...this.history.slice(-5, -1),
      { role: 'user', content: enrichedPrompt },
    ];

    const stream = this.llmService.streamMessages(messages);

    let fullResponse = '';

    const streamWithCapture = async function* (
      this: ChatService,
    ): AsyncIterable<string> {
      for await (const chunk of stream) {
        fullResponse += chunk;
        yield chunk;
      }

      this.history.push({ role: 'assistant', content: fullResponse });
      this.history = this.history.slice(-this.MAX_HISTORY);
    }.bind(this);

    return streamWithCapture();
  }
}
