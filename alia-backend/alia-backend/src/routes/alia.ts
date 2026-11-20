import { Router } from 'express';
import { z } from 'zod';
import { generateReply, ChatTurn } from '../ai';
import { AuthedRequest, requireAuth } from '../auth';
import { env } from '../config';
import { pool, query } from '../db';
import { asyncHandler, HttpError } from '../errors';
import {
  canUseTopic,
  classifyTopic,
  DAILY_LIMIT,
  PLAN_NAME,
  Plan,
  TOPIC_MIN_PLAN,
  Topic,
} from '../plans';
import { StartupContext } from '../prompts';
import { getUserPlan, setUserPlan } from '../subscription';
import { consumeMessage, getUsedToday, refundMessage } from '../usage';

export const aliaRouter = Router();
aliaRouter.use(requireAuth);

const TOPICS = ['diagnostico', 'pitch', 'modelo', 'solucao', 'mercado', 'plano30'] as const;

const chatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  conversationId: z.string().uuid().optional(),
  startupId: z.string().uuid().optional(),
  topic: z.enum(TOPICS).optional(), // enviado pelos botões de sugestão
});

/** Plano atual e uso do dia (alimenta o contador "X de 5 mensagens"). */
aliaRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).userId;
    const plan = await getUserPlan(userId);
    const used = await getUsedToday(userId);
    const limited = plan === 'free';
    res.json({
      plan,
      planName: PLAN_NAME[plan],
      unlimited: !limited,
      dailyLimit: limited ? DAILY_LIMIT[plan] : null,
      remainingToday: limited ? Math.max(DAILY_LIMIT[plan] - used, 0) : null,
      topics: TOPICS.map((t) => ({
        topic: t,
        requiredPlan: TOPIC_MIN_PLAN[t],
        locked: !canUseTopic(plan, t),
      })),
    });
  }),
);

aliaRouter.get(
  '/conversations',
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).userId;
    const rows = await query(
      `SELECT id, title, startup_id, created_at FROM conversations
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId],
    );
    res.json(rows);
  }),
);

aliaRouter.get(
  '/conversations/:id/messages',
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).userId;
    const id = z.string().uuid().parse(req.params.id);
    const rows = await query(
      `SELECT m.id, m.role, m.topic, m.content, m.created_at
       FROM messages m JOIN conversations c ON c.id = m.conversation_id
       WHERE m.conversation_id = $1 AND c.user_id = $2
       ORDER BY m.id ASC`,
      [id, userId],
    );
    res.json(rows);
  }),
);

aliaRouter.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const userId = (req as AuthedRequest).userId;
    const body = chatSchema.parse(req.body);

    const plan = await getUserPlan(userId);
    const topic: Topic = body.topic ?? classifyTopic(body.message);

    // 1) Recurso bloqueado pelo plano (não gasta mensagem)
    if (!canUseTopic(plan, topic)) {
      const required = TOPIC_MIN_PLAN[topic];
      throw new HttpError(
        402,
        'PLAN_REQUIRED',
        `Este recurso está disponível a partir do plano ${PLAN_NAME[required]}.`,
        { topic, requiredPlan: required, currentPlan: plan },
      );
    }

    // 2) Limite diário (atômico)
    const allowed = await consumeMessage(userId, plan);
    if (!allowed) {
      throw new HttpError(429, 'DAILY_LIMIT', 'Você usou suas mensagens gratuitas de hoje.', {
        currentPlan: plan,
        suggestedPlan: 'plus',
      });
    }

    try {
      // 3) Contexto: startup + conversa
      const startup = await loadStartup(userId, body.startupId);
      const conversationId = await ensureConversation(userId, body, startup);
      const history = await loadHistory(conversationId);

      // 4) IA
      const reply = await generateReply({
        topic,
        plan,
        startup: startup ? toContext(startup) : null,
        history,
        message: body.message,
      });

      // 5) Salva as duas mensagens juntas
      await pool.query(
        `INSERT INTO messages (conversation_id, role, topic, content)
         VALUES ($1, 'user', $2, $3), ($1, 'assistant', $2, $4)`,
        [conversationId, topic, body.message, reply],
      );

      const used = await getUsedToday(userId);
      res.json({
        conversationId,
        topic,
        reply,
        remainingToday: plan === 'free' ? Math.max(DAILY_LIMIT[plan] - used, 0) : null,
      });
    } catch (err) {
      await refundMessage(userId).catch(() => undefined);
      if (err instanceof HttpError) throw err;
      console.error('Falha ao gerar resposta da A.L.I.A:', err);
      throw new HttpError(502, 'AI_UNAVAILABLE', 'A A.L.I.A está indisponível agora. Tente de novo.');
    }
  }),
);

/** Somente para testes locais: troca o plano (simula o checkout). */
aliaRouter.post(
  '/dev/plan',
  asyncHandler(async (req, res) => {
    if (env.ALLOW_DEV_PLAN_SWITCH !== 'true') throw new HttpError(404, 'NOT_FOUND', 'Não encontrado.');
    const userId = (req as AuthedRequest).userId;
    const { plan } = z.object({ plan: z.enum(['free', 'plus', 'pro']) }).parse(req.body);
    await setUserPlan(userId, plan as Plan);
    res.json({ ok: true, plan });
  }),
);

/* ---------- helpers ---------- */

interface StartupRow extends StartupContext {
  id: string;
}

async function loadStartup(userId: string, startupId?: string): Promise<StartupRow | null> {
  const rows = startupId
    ? await query<StartupRow>(
        `SELECT id, name, sector, stage, description, business_model, solution
         FROM startups WHERE id = $1 AND owner_id = $2`,
        [startupId, userId],
      )
    : await query<StartupRow>(
        `SELECT id, name, sector, stage, description, business_model, solution
         FROM startups WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [userId],
      );
  if (startupId && rows.length === 0) throw new HttpError(404, 'STARTUP_NOT_FOUND', 'Startup não encontrada.');
  return rows[0] ?? null;
}

function toContext(s: StartupRow): StartupContext {
  const { id: _id, ...ctx } = s;
  return ctx;
}

async function ensureConversation(
  userId: string,
  body: z.infer<typeof chatSchema>,
  startup: StartupRow | null,
): Promise<string> {
  if (body.conversationId) {
    const rows = await query<{ id: string }>(
      `SELECT id FROM conversations WHERE id = $1 AND user_id = $2`,
      [body.conversationId, userId],
    );
    if (rows.length === 0) throw new HttpError(404, 'CONVERSATION_NOT_FOUND', 'Conversa não encontrada.');
    return rows[0].id;
  }
  const created = await query<{ id: string }>(
    `INSERT INTO conversations (user_id, startup_id, title) VALUES ($1, $2, $3) RETURNING id`,
    [userId, startup?.id ?? null, body.message.slice(0, 80)],
  );
  return created[0].id;
}

/** Últimas 10 mensagens, em ordem cronológica, começando por "user". */
async function loadHistory(conversationId: string): Promise<ChatTurn[]> {
  const rows = await query<ChatTurn>(
    `SELECT role, content FROM (
       SELECT id, role, content FROM messages
       WHERE conversation_id = $1 ORDER BY id DESC LIMIT 10
     ) t ORDER BY id ASC`,
    [conversationId],
  );
  while (rows.length && rows[0].role !== 'user') rows.shift();
  return rows;
}
