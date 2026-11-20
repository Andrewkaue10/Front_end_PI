import { query } from './db';
import { DAILY_LIMIT, Plan } from './plans';

const TODAY = `(now() AT TIME ZONE 'America/Recife')::date`;

/**
 * Consome 1 mensagem do dia de forma atômica (sem corrida entre requisições).
 * Retorna false se o limite já foi atingido.
 */
export async function consumeMessage(userId: string, plan: Plan): Promise<boolean> {
  const rows = await query<{ messages_count: number }>(
    `INSERT INTO usage_daily (user_id, day, messages_count)
     VALUES ($1, ${TODAY}, 1)
     ON CONFLICT (user_id, day)
     DO UPDATE SET messages_count = usage_daily.messages_count + 1
     WHERE usage_daily.messages_count < $2
     RETURNING messages_count`,
    [userId, DAILY_LIMIT[plan]],
  );
  return rows.length > 0;
}

/** Devolve a mensagem quando a IA falha, para não cobrar do usuário. */
export async function refundMessage(userId: string): Promise<void> {
  await query(
    `UPDATE usage_daily SET messages_count = GREATEST(messages_count - 1, 0)
     WHERE user_id = $1 AND day = ${TODAY}`,
    [userId],
  );
}

export async function getUsedToday(userId: string): Promise<number> {
  const rows = await query<{ messages_count: number }>(
    `SELECT messages_count FROM usage_daily WHERE user_id = $1 AND day = ${TODAY}`,
    [userId],
  );
  return rows[0]?.messages_count ?? 0;
}
