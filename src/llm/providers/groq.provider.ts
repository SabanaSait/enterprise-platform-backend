import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { LLMProvider } from '../interfaces/llm-provider.interface';
import { SYSTEM_PROMPT } from '../prompts/system.prompt';

@Injectable()
export class GroqProvider implements LLMProvider {
  constructor(private readonly configService: ConfigService) {}

  async *stream(message: string): AsyncIterable<string> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        stream: true,
      }),
    });

    if (!res.body) {
      throw new Error('No response body from Groq');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);

      // Groq streams as SSE → parse lines
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.replace('data: ', '').trim();

          if (data === '[DONE]') return;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;

            if (content) {
              yield content;
            }
          } catch (err) {
            // ignore malformed chunks
          }
        }
      }
    }
  }
}
