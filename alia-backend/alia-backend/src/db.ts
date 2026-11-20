import { Pool, QueryResultRow } from 'pg';
import { env } from './config';

export const pool = new Pool({ connectionString: env.DATABASE_URL, max: 10 });

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await pool.query<T>(text, params);
  return res.rows;
}
