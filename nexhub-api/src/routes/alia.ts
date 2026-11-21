import { Router } from "express";
import { Prisma } from "@prisma/client";
import { db } from "../lib/db";
import { HttpError } from "../lib/errors";
import {
  VERSION,
  topics,
  inputSchema,
  prepareProfile,
  generateGemini,
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
        mode: "gemini",
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
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    remainingToday: Math.max(0, limit - used),
    preference: preference || {
      enabled: false,
      profileAnalysisEnabled: false,
      geminiConsent: false,
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
  if (!preference?.geminiConsent)
    throw new HttpError(
      403,
      "Autorize o envio para a Google antes de usar o Gemini.",
    );
  if (input.useProfile && !preference?.profileAnalysisEnabled)
    throw new HttpError(
      403,
      "Autorize a análise do perfil antes de incluí-lo.",
    );
  if (!process.env.GEMINI_API_KEY)
    throw new HttpError(503, "Gemini ainda não configurado.");
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
    const [used, total] = await Promise.all([
      tx.aiAnalysis.count({
        where: { ...where, mode: "gemini", status: { not: "FAILED" } },
      }),
      tx.aiAnalysis.count({
        where: { mode: "gemini", createdAt: { gte: dayStart() } },
      }),
    ]);
    if (used >= limit)
      throw new HttpError(
        429,
        "Você atingiu as cinco análises Gemini de hoje. Tente novamente amanhã.",
      );
    if (total >= globalLimit())
      throw new HttpError(
        429,
        "O limite diário de uso externo foi atingido. Tente novamente amanhã.",
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
    const result = await generateGemini(input.message, input.topic, profile);
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
      "Não foi possível concluir a análise. A cota pessoal foi devolvida; tente novamente mais tarde.",
    );
  }
});
