import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { HttpError } from "../lib/errors";
import { paging, uuid } from "../domain/validation";

export const programs = Router();

const programSchema = z.object({
  sourceUrl: z
    .string()
    .url()
    .max(2000)
    .refine(
      (value) => new URL(value).protocol === "https:",
      "Use um endereço HTTPS.",
    )
    .nullable()
    .optional(),
  title: z.string().trim().min(2).max(160),
  organization: z.string().trim().min(2).max(160),
  modality: z.string().trim().min(2).max(80),
  region: z.string().trim().max(120).default(""),
  category: z.string().trim().max(80).default(""),
  stage: z.string().trim().max(80).default(""),
  benefit: z.string().trim().max(160).default(""),
  duration: z.string().trim().max(80).default(""),
  description: z.string().trim().max(4000).default(""),
  requirements: z.array(z.string().trim().min(1).max(300)).max(30).default([]),
  applicationsOpenAt: z.iso.datetime({ offset: true }),
  applicationsCloseAt: z.iso.datetime({ offset: true }),
  timezone: z.string().trim().min(1).max(80).default("America/Fortaleza"),
  active: z.boolean().default(true),
});

function programStatus(program: any) {
  const now = Date.now();
  if (!program.active) return "ENCERRADO";
  if (now < new Date(program.applicationsOpenAt).getTime()) return "EM_BREVE";
  if (now > new Date(program.applicationsCloseAt).getTime()) return "ENCERRADO";
  return "ABERTO";
}

programs.get("/programs", async (req, res) => {
  const { page, limit } = paging.parse(req.query);
  const q = z
    .string()
    .trim()
    .max(120)
    .parse(req.query.q || "");
  const category = z
    .string()
    .trim()
    .max(80)
    .parse(req.query.category || "");
  const stage = z
    .string()
    .trim()
    .max(80)
    .parse(req.query.stage || "");
  const region = z
    .string()
    .trim()
    .max(120)
    .parse(req.query.region || "");
  const sort = z
    .enum(["deadline", "newest"])
    .parse(req.query.sort || "deadline");
  const state = z
    .enum(["TODOS", "ABERTO", "EM_BREVE", "ENCERRADO"])
    .parse(req.query.status || "TODOS");
  const now = new Date();
  const where: any = {
    active: true,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { organization: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(stage ? { stage } : {}),
    ...(region ? { region } : {}),
    ...(state === "ABERTO"
      ? { applicationsOpenAt: { lte: now }, applicationsCloseAt: { gte: now } }
      : {}),
    ...(state === "EM_BREVE" ? { applicationsOpenAt: { gt: now } } : {}),
    ...(state === "ENCERRADO" ? { applicationsCloseAt: { lt: now } } : {}),
  };
  const [rows, total] = await db.$transaction([
    db.program.findMany({
      where,
      orderBy:
        sort === "newest"
          ? [{ createdAt: "desc" }, { id: "asc" }]
          : [{ applicationsCloseAt: "asc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.program.count({ where }),
  ]);
  res.json({
    items: rows.map((program) => ({
      ...program,
      status: programStatus(program),
    })),
    total,
    page,
    limit,
  });
});

programs.get("/programs/:id", async (req, res) => {
  const program = await db.program.findFirst({
    where: { id: uuid.parse(req.params.id), active: true },
  });
  if (!program) throw new HttpError(404, "Edital ou programa indisponível.");
  res.json({ ...program, status: programStatus(program) });
});

async function startupFor(userId: string) {
  const startup = await db.startup.findUnique({ where: { ownerId: userId } });
  if (!startup)
    throw new HttpError(403, "Ação disponível apenas para startups.");
  return startup;
}

programs.put("/programs/:id/save", async (req, res) => {
  await startupFor(req.user!.userId);
  const id = uuid.parse(req.params.id);
  if (!(await db.program.findFirst({ where: { id, active: true } })))
    throw new HttpError(404, "Edital ou programa indisponível.");
  await db.programSave.upsert({
    where: { userId_programId: { userId: req.user!.userId, programId: id } },
    create: { userId: req.user!.userId, programId: id },
    update: {},
  });
  res.status(204).end();
});

programs.delete("/programs/:id/save", async (req, res) => {
  await startupFor(req.user!.userId);
  await db.programSave.deleteMany({
    where: { userId: req.user!.userId, programId: uuid.parse(req.params.id) },
  });
  res.status(204).end();
});

programs.post("/programs/:id/applications", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const id = uuid.parse(req.params.id);
  const program = await db.program.findFirst({ where: { id, active: true } });
  if (!program) throw new HttpError(404, "Edital ou programa indisponível.");
  if (programStatus(program) !== "ABERTO")
    throw new HttpError(409, "As inscrições não estão abertas.");
  const application = await db.programApplication.upsert({
    where: { startupId_programId: { startupId: startup.id, programId: id } },
    create: { userId: req.user!.userId, startupId: startup.id, programId: id },
    update: {},
  });
  res.status(201).json(application);
});

programs.put("/programs/:id/alert", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const id = uuid.parse(req.params.id);
  if (!(await db.program.findFirst({ where: { id, active: true } })))
    throw new HttpError(404, "Edital ou programa indisponível.");
  await db.programAlert.upsert({
    where: { startupId_programId: { startupId: startup.id, programId: id } },
    create: {
      userId: req.user!.userId,
      startupId: startup.id,
      programId: id,
      enabled: true,
    },
    update: { enabled: true },
  });
  res.status(204).end();
});

programs.delete("/programs/:id/alert", async (req, res) => {
  await startupFor(req.user!.userId);
  await db.programAlert.deleteMany({
    where: {
      startupId: (await startupFor(req.user!.userId)).id,
      programId: uuid.parse(req.params.id),
    },
  });
  res.status(204).end();
});

programs.get("/my/programs", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const [saves, applications, alerts] = await Promise.all([
    db.programSave.findMany({
      where: { userId: req.user!.userId },
      include: { program: true },
    }),
    db.programApplication.findMany({
      where: { startupId: startup.id },
      include: { program: true },
    }),
    db.programAlert.findMany({
      where: { startupId: startup.id, enabled: true },
      include: { program: true },
    }),
  ]);
  res.json({
    saved: saves.map((item) => item.programId),
    applications: applications.map((item) => ({
      id: item.programId,
      status: item.status,
    })),
    alerts: alerts.map((item) => item.programId),
  });
});
