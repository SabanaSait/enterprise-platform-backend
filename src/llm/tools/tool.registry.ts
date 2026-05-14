import { Tool } from './types/tool.interface';

export class ToolRegistry {
  private tools = new Map<string, Tool<unknown, unknown>>();

  constructor(tools: Tool[]) {
    tools.forEach((tool) => {
      this.tools.set(tool.name, tool);
    });
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): Tool[] {
    return [...this.tools.values()];
  }
}
