import { ToolDecision } from './tool-decision.type';

export function parseDecision(raw: string | Object): ToolDecision {
  try {
    if (typeof raw === 'object') {
      return normalize(raw);
    }

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return fallback();
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return normalize(parsed);
  } catch (err) {
    console.error('Decision parsing failed', err);
    return fallback();
  }

  function normalize(parsed: any): ToolDecision {
    return {
      tool: parsed.tool ?? null,
      args: parsed.args ?? {},
    };
  }

  function fallback(): ToolDecision {
    return {
      tool: null,
      args: {},
    };
  }
}
