import Anthropic from '@anthropic-ai/sdk';
import { env } from './config';
import { MAX_TOKENS, Plan, Topic } from './plans';
import { buildSystemPrompt, StartupContext } from './prompts';

const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateReply(params: {
  topic: Topic;
  plan: Plan;
  startup: StartupContext | null;
  history: ChatTurn[];
  message: string;
}): Promise<string> {
  const { topic, plan, startup, history, message } = params;

  const res = await client.messages.create({
    model: env.ANTHROPIC_MODEL,
    max_tokens: MAX_TOKENS[plan],
    system: buildSystemPrompt(topic, plan, startup),
    messages: [...history, { role: 'user', content: message }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  if (!text) throw new Error('Resposta vazia da IA');
  return text;
}
