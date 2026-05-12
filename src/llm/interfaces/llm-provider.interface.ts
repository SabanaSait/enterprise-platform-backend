export interface LLMProvider {
  stream(message: string): AsyncIterable<string>;
}
