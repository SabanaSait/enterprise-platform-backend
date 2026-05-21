import { CopilotContext } from './context.types';

export function formatContext(context?: CopilotContext): string {
  if (!context) return '';

  let result = '\nContext:\n';

  if (context.page) {
    result += `- Current page: ${context.page}\n`;
  }

  if (context.filters) {
    result += `- Filters: ${JSON.stringify(context.filters)}\n`;
  }

  if (context.selection) {
    result += `- Selection: ${JSON.stringify(context.selection)}\n`;
  }

  return result;
}
