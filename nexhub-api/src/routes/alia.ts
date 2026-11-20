import { Router } from "express";
import { Prisma } from "@prisma/client";
import { db } from "../lib/db";
import { HttpError } from "../lib/errors";
import {
  VERSION,
  topics,
  inputSchema,
  prepareProfile,
  localAnalysis,
  generateClaude,
  dayStart,
} from "../ai/core";
export const alia = Router();
const limit = 5;
function globalLimit() {
  const n = Number(process.env.ALIA_GLOBAL_DAILY_LIMIT || 50);
  return Number.isInteger(n) && n >= 1 && n <= 500 ? n : 50;
}
alia.get("/alia/me", async (req, res) => {
  const userId = req.user!.userId;
  const [preference, used, history] = await Promise.all([
    db.aiPreference.findUnique({ where: { userId } }),
    db.aiAnalysis.count({
      where: {
        userId,
        mode: "claude",
        createdAt: { gte: dayStart() },
        status: { not: "FAILED" },
      },
    }),
    db.aiAnalysis.findMany({
      where: { userId, hidden: false, status: "SUCCEEDED" },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 20,
    }),
  ]);
  res.json({
    topics,
    claudeConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
    remainingToday: Math.max(0, limit - used),
    preference: preference || {
      enabled: false,
      profileAnalysisEnabled: false,
      externalProviderConsent: false,
    },
    history,
  });
});
alia.delete("/alia/history", async (req, res) => {
  await db.aiAnalysis.updateMany({
    where: { userId: req.user!.userId },
    data: { hidden: true, question: "", result: Prisma.DbNull },
  });
  res.status(204).end();
});
alia.post("/alia/analyze", async (req, res) => {
  const input = inputSchema.parse(req.body),
    userId = req.user!.userId;
  const preference = await db.aiPreference.findUnique({ where: { userId } });
  if (input.mode === "claude" && !preference?.externalProviderConsent)
    throw new HttpError(
      403,
      "Autorize o envio para a Anthropic antes de usar o Claude.",
    );
  if (input.useProfile && !preference?.profileAnalysisEnabled)
    throw new HttpError(
      403,
      "Autorize a análise do perfil antes de incluí-lo.",
    );
  if (input.mode === "claude" && !process.env.ANTHROPIC_API_KEY)
    throw new HttpError(503, "Claude ainda não configurado. Use o modo local.");
  const profile = input.useProfile
    ? prepareProfile(
        await db.startup.findUnique({ where: { ownerId: userId } }),
      )
    : null;
  const start = Date.now();
  const analysis = await db.$transaction(async (tx) => {
    // Serializa apenas a reserva curta; a chamada externa fica fora da transação.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(71920421)`;
    const where = { userId, createdAt: { gte: dayStart() } };
    if (input.mode === "claude") {
      const [used, total] = await Promise.all([
        tx.aiAnalysis.count({
          where: { ...where, mode: "claude", status: { not: "FAILED" } },
        }),
        tx.aiAnalysis.count({
          where: { mode: "claude", createdAt: { gte: dayStart() } },
        }),
      ]);
      if (used >= limit)
        throw new HttpError(
          429,
          "Você atingiu as cinco análises Claude de hoje. O modo local continua disponível.",
        );
      if (total >= globalLimit())
        throw new HttpError(
          429,
          "O limite diário de uso externo foi atingido. Use o modo local.",
        );
    } else if (
      (await tx.aiAnalysis.count({ where: { ...where, mode: "local" } })) >= 100
    )
      throw new HttpError(
        429,
        "Limite de 100 análises locais por dia atingido.",
      );
    return tx.aiAnalysis.create({
      data: {
        userId,
        topic: input.topic,
        mode: input.mode,
        question: input.message,
        promptVersion: VERSION,
      },
    });
  });
  try {
    const result =
      input.mode === "local"
        ? localAnalysis(input.message, input.topic, profile)
        : await generateClaude(input.message, input.topic, profile);
    const saved = await db.aiAnalysis.update({
      where: { id: analysis.id, hidden: false },
      data: {
        status: "SUCCEEDED",
        result: { ...result, usedProfile: Boolean(profile) },
        model: result.model,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        durationMs: Date.now() - start,
      },
    });
    res.status(201).json(saved);
  } catch (error) {
    await db.aiAnalysis.update({
      where: { id: analysis.id },
      data: { status: "FAILED", question: "", durationMs: Date.now() - start },
    });
    console.error(
      "ALIA_FAILED",
      error instanceof Error ? error.name : "unknown",
    );
    throw new HttpError(
      502,
      "Não foi possível concluir a análise. A cota pessoal foi devolvida; tente o modo local.",
    );
  }
});
