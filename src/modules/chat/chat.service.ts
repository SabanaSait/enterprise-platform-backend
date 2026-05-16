import { Injectable } from '@nestjs/common';
import { LLMService } from 'src/llm/llm.service';
import { Message } from 'src/llm/interfaces/message.interface';
import {
  SYSTEM_PROMPT_GENERIC,
  SYSTEM_PROMPT_TOOL,
  SYSTEM_PROMPT_INTERPRET_TOOL_RESULT,
} from 'src/llm/prompts/system.prompt';
import { ToolRegistry } from 'src/llm/tools/tool.registry';
import { buildToolDecisionPrompt } from './prompts/tool-decision.prompt';
import { ToolDecision } from './prompts/tool-decision.type';
import { parseDecision } from './prompts/tool-decision.parser';

@Injectable()
export class ChatService {
  private history: Message[] = [];
  private MAX_HISTORY = 6;

  constructor(
    private readonly llmService: LLMService,
    private readonly toolRegistry: ToolRegistry,
  ) {}

  async streamResponse(
    message: string,
    mode: string,
  ): Promise<AsyncIterable<string>> {
    this.history.push({ role: 'user', content: message });

    const messages: Message[] = [
      {
        role: 'system',
        content:
          mode === 'tool'
            ? SYSTEM_PROMPT_INTERPRET_TOOL_RESULT
            : SYSTEM_PROMPT_GENERIC,
      },
      ...this.history.slice(-5, -1),
      { role: 'user', content: message },
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

  async decideTool(userMessage: string) {
    const tools = this.toolRegistry.getAllTools();

    const prompt = buildToolDecisionPrompt(
      userMessage,
      tools.map((t) => ({
        name: t.name,
        description: t.description,
      })),
    );

    const response = await this.llmService.generate([
      {
        role: 'system',
        content: SYSTEM_PROMPT_TOOL,
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    try {
      const parsed = parseDecision(response);

      return parsed as ToolDecision;
    } catch (error) {
      console.error('Failed to parse LLM decision:', response);
      return { tool: null, arguments: {} };
    }
  }

  async handleMessage(message: string) {
    const rawDecision = await this.decideTool(message);
    const decision = parseDecision(rawDecision);

    // Decide tool
    if (decision.tool) {
      const tool = this.toolRegistry.getTool(decision.tool);

      if (!tool) {
        return `Unknown tool: ${decision.tool}`;
      }

      const toolResult = await tool.execute(decision.args);
      const finalMessage = `
        User question: ${message}
        Tool result: ${JSON.stringify(toolResult)}
      `;

      return this.streamResponse(finalMessage, 'tool');
    }

    // Fallback to stream
    return this.streamResponse(message);
  }
}
