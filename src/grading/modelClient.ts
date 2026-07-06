/**
 * Thin model abstraction so the grading engine is testable offline and
 * benchable by rubric-bench without touching a provider SDK.
 */
export interface ModelClient {
  id: string;
  complete(systemPrompt: string, userPrompt: string): Promise<string>;
}

export interface AnthropicClientOptions {
  model?: string;
  maxTokens?: number;
  apiKey?: string;
}

const DEFAULT_MODEL = 'claude-sonnet-5';

/** Reference client. Lazy-imports the SDK so offline tests never load it. */
export function createAnthropicClient(options: AnthropicClientOptions = {}): ModelClient {
  const model = options.model ?? DEFAULT_MODEL;
  return {
    id: `anthropic:${model}`,
    async complete(systemPrompt: string, userPrompt: string): Promise<string> {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic(options.apiKey ? { apiKey: options.apiKey } : {});
      const response = await client.messages.create({
        model,
        max_tokens: options.maxTokens ?? 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      const block = response.content[0];
      if (!block || block.type !== 'text') {
        throw new Error(`Unexpected response shape from ${model}: no text block`);
      }
      return block.text;
    },
  };
}
