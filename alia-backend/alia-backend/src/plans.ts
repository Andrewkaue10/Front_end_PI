export type Plan = 'free' | 'plus' | 'pro';
export type Topic = 'diagnostico' | 'pitch' | 'modelo' | 'solucao' | 'mercado' | 'plano30';

export const PLAN_RANK: Record<Plan, number> = { free: 0, plus: 1, pro: 2 };

export const PLAN_NAME: Record<Plan, string> = { free: 'Gratuito', plus: 'Plus', pro: 'Pro' };

/** Mensagens por dia. Plus e Pro são ilimitados na prática. */
export const DAILY_LIMIT: Record<Plan, number> = {
  free: 5,
  plus: 2_000_000_000,
  pro: 2_000_000_000,
};

export const TOPIC_MIN_PLAN: Record<Topic, Plan> = {
  diagnostico: 'free',
  pitch: 'free',
  modelo: 'plus',
  solucao: 'plus',
  mercado: 'pro',
  plano30: 'pro',
};

/** A ordem importa: tópicos mais específicos primeiro. */
const RULES: Array<[Topic, RegExp]> = [
  ['plano30', /30 dias|roadmap|plano de a[çc][ãa]o|prioridade|cronograma/i],
  ['mercado', /concorr|mercado|competi|\btam\b|\bsam\b|nicho/i],
  ['modelo', /modelo|neg[óo]cio|receita|monetiz|pre[çc]o|canvas/i],
  ['solucao', /solu[çc][ãa]o|produto|mvp|funcionalidade|ajust|melhoria/i],
  ['pitch', /pitch|deck|apresent|investidor/i],
];

export function classifyTopic(message: string): Topic {
  for (const [topic, re] of RULES) if (re.test(message)) return topic;
  return 'diagnostico';
}

export function canUseTopic(plan: Plan, topic: Topic): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK[TOPIC_MIN_PLAN[topic]];
}

export const MAX_TOKENS: Record<Plan, number> = { free: 700, plus: 1200, pro: 1800 };
