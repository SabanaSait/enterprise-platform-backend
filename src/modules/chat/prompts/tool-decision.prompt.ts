export function buildToolDecisionPrompt(
  userMessage: string,
  tools: { name: string; description: string }[],
): string {
  const toolList = tools.map((t) => `- ${t.name}: ${t.description}`).join('\n');

  return `
You are an AI that decides which tool to use.

Available tools:
${toolList}

User query:
"${userMessage}"

Return ONLY valid JSON in this format:
{
  "tool": "tool_name",
  "arguments": {}
}

Rules:
- Do NOT explain anything
- Do NOT add text outside JSON
- If no tool is relevant, return:
{
  "tool": null,
  "arguments": {}
}
`;
}
