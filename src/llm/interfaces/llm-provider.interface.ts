import { Message } from './message.interface';

export interface LLMProvider {
  stream(message: Message[]): AsyncIterable<string>;
  generate(messages: Message[]): Promise<string>;
}
