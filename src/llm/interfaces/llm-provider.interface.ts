import { Message } from './message.interface';

export interface LLMProvider {
  stream(message: Message[]): AsyncIterable<string>;
}
