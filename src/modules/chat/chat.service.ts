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
import { formatContext } from './context/format-context';
import { CopilotContext } from './context/context.types';

@Injectable()
export class ChatService {
  private history: Message[] = [];
  private MAX_HISTORY = 6;

  constructor(
    private readonly llmService: LLMService,
    private readonly toolRegistry: ToolRegistry,
  ) {}

  private buildSystemPrompt(
    basePrompt: string,
    context?: CopilotContext,
  ): string {
    return `${basePrompt}\n${formatContext(context)}`;
  }

  async streamResponse(
    message: string,
    context?: CopilotContext,
    mode?: string,
  ): Promise<AsyncIterable<string>> {
    this.history.push({ role: 'user', content: message });

    const basePrompt =
      mode === 'tool'
        ? SYSTEM_PROMPT_INTERPRET_TOOL_RESULT
        : SYSTEM_PROMPT_GENERIC;

    const systemPrompt = this.buildSystemPrompt(basePrompt, context);

    const messages: Message[] = [
      {
        role: 'system',
        content: systemPrompt,
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

  async decideTool(userMessage: string, context?: CopilotContext) {
    const tools = this.toolRegistry.getAllTools();

    const prompt = buildToolDecisionPrompt(
      userMessage,
      tools.map((t) => ({
        name: t.name,
        description: t.description,
      })),
      context,
    );

    const response = await this.llmService.generate([
      {
        role: 'system',
        content: this.buildSystemPrompt(SYSTEM_PROMPT_TOOL, context),
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
      return { tool: null, args: {} };
    }
  }

  async handleMessage(message: string, context?: CopilotContext) {
    const decision = await this.decideTool(message, context);
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

      return this.streamResponse(finalMessage, context, 'tool');
    }

    // Fallback to stream
    return this.streamResponse(message, context);
  }
}
