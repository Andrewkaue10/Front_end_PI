import { query } from './db';
import { Plan } from './plans';

interface SubRow {
  plan: Plan;
  status: string;
  current_period_end: Date | null;
}

/** Plano efetivo: se estiver cancelado/vencido, volta para o Gratuito. */
export async function getUserPlan(userId: string): Promise<Plan> {
  const rows = await query<SubRow>(
    `SELECT plan, status, current_period_end FROM subscriptions WHERE user_id = $1`,
    [userId],
  );
  const sub = rows[0];
  if (!sub || sub.status !== 'active') return 'free';
  if (sub.current_period_end && sub.current_period_end.getTime() < Date.now()) return 'free';
  return sub.plan;
}

export async function setUserPlan(userId: string, plan: Plan): Promise<void> {
  await query(
    `INSERT INTO subscriptions (user_id, plan, status, current_period_end)
     VALUES ($1, $2, 'active', now() + interval '30 days')
     ON CONFLICT (user_id)
     DO UPDATE SET plan = EXCLUDED.plan, status = 'active',
                   current_period_end = EXCLUDED.current_period_end, updated_at = now()`,
    [userId, plan],
  );
}
