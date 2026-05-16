import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { LLMProvider } from '../interfaces/llm-provider.interface';
import { Message } from '../interfaces/message.interface';

@Injectable()
export class GroqProvider implements LLMProvider {
  private apiKeyToken = 'GROQ_API_KEY';
  private model = 'llama-3.1-8b-instant';

  constructor(private readonly configService: ConfigService) {}

  async *stream(messages: Message[]): AsyncIterable<string> {
    const apiKey = this.configService.get<string>(this.apiKeyToken);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
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

  async generate(messages: Message[]): Promise<string> {
    const apiKey = this.configService.get<string>(this.apiKeyToken);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Groq API error: ${errorText}`);
    }

    const json = await res.json();

    return json.choices?.[0]?.message?.content ?? '';
  }
}
