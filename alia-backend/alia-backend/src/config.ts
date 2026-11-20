import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  ANTHROPIC_API_KEY: z.string().min(1),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-5-5'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  ALLOW_DEV_PLAN_SWITCH: z.enum(['true', 'false']).default('false'),
});

export const env = schema.parse(process.env);
