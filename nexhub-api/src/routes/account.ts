import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "../lib/db";
import { HttpError } from "../lib/errors";
import { email, password, paging } from "../domain/validation";

export const account = Router();
account.put("/account/avatar", async (req, res) => {
  const { avatarData } = z
    .object({ avatarData: z.string().max(350000).nullable() })
    .strict()
    .parse(req.body);
  if (avatarData !== null) {
    if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(avatarData))
      throw new HttpError(400, "Envie uma foto JPEG válida.");
    const bytes = Buffer.from(avatarData.split(",")[1], "base64");
    if (
      bytes.length > 250000 ||
      bytes.length < 4 ||
      bytes[0] !== 255 ||
      bytes[1] !== 216 ||
      bytes[bytes.length - 2] !== 255 ||
      bytes[bytes.length - 1] !== 217
    )
      throw new HttpError(400, "Foto inválida ou muito grande.");
  }
  await db.user.update({
    where: { id: req.user!.userId },
    data: { avatarData },
  });
  res.json({ avatarData });
});

account.patch("/account", async (req, res) => {
  const value = z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      phone: z
        .string()
        .trim()
        .transform((value) => value.replace(/\D/g, ""))
        .pipe(z.string().regex(/^\d{10,13}$/))
        .optional(),
      email: email.optional(),
    })
    .strict()
    .parse(req.body);

  if (value.email) {
    const existing = await db.user.findUnique({
      where: { email: value.email },
    });
    if (existing && existing.id !== req.user!.userId)
      throw new HttpError(409, "Este e-mail já está em uso.");
  }

  const user = await db.user.update({
    where: { id: req.user!.userId },
    data: value,
    select: { id: true, name: true, email: true, phone: true, role: true },
  });
  res.json(user);
});

account.post("/account/password", async (req, res) => {
  const value = z
    .object({
      currentPassword: z.string().min(1).max(128),
      newPassword: password,
    })
    .strict()
    .parse(req.body);
  const user = await db.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw new HttpError(404, "Conta indisponível.");
  if (!(await bcrypt.compare(value.currentPassword, user.passwordHash)))
    throw new HttpError(401, "Senha atual incorreta.");

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(value.newPassword, 12),
      tokenVersion: { increment: 1 },
    },
  });
  res.json({ message: "Senha alterada. Entre novamente." });
});

account.get("/preferences/notifications", async (req, res) => {
  const preference = await db.notificationPreference.findUnique({
    where: { userId: req.user!.userId },
  });
  res.json(
    preference || {
      appEnabled: true,
      emailEnabled: false,
      connectionEnabled: true,
      meetingEnabled: true,
      opportunityEnabled: true,
    },
  );
});

account.patch("/preferences/notifications", async (req, res) => {
  const value = z
    .object({
      appEnabled: z.boolean(),
      emailEnabled: z.boolean(),
      connectionEnabled: z.boolean(),
      meetingEnabled: z.boolean(),
      opportunityEnabled: z.boolean(),
    })
    .partial()
    .strict()
    .parse(req.body);
  const preference = await db.notificationPreference.upsert({
    where: { userId: req.user!.userId },
    create: { userId: req.user!.userId, ...value },
    update: value,
  });
  res.json(preference);
});

account.get("/preferences/ai", async (req, res) => {
  const preference = await db.aiPreference.findUnique({
    where: { userId: req.user!.userId },
  });
  res.json(
    preference || {
      enabled: false,
      profileAnalysisEnabled: false,
      externalProviderConsent: false,
      geminiConsent: false,
    },
  );
});

account.patch("/preferences/ai", async (req, res) => {
  const value = z
    .object({
      enabled: z.boolean(),
      profileAnalysisEnabled: z.boolean(),
      externalProviderConsent: z.boolean(),
      geminiConsent: z.boolean(),
    })
    .partial()
    .strict()
    .parse(req.body);
  const preference = await db.aiPreference.upsert({
    where: { userId: req.user!.userId },
    create: { userId: req.user!.userId, ...value },
    update: value,
  });
  res.json(preference);
});

account.post("/account/deletion", async (req, res) => {
  const value = z
    .object({ reason: z.string().trim().max(500).default("") })
    .strict()
    .parse(req.body);
  const scheduledFor = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const request = await db.accountDeletionRequest.upsert({
    where: { userId: req.user!.userId },
    create: {
      userId: req.user!.userId,
      status: "REQUESTED",
      reason: value.reason,
      scheduledFor,
    },
    update: {
      status: "REQUESTED",
      reason: value.reason,
      scheduledFor,
      completedAt: null,
    },
  });
  res.status(201).json(request);
});

account.delete("/account/deletion", async (req, res) => {
  await db.accountDeletionRequest.updateMany({
    where: { userId: req.user!.userId, status: "REQUESTED" },
    data: { status: "CANCELLED" },
  });
  res.status(204).end();
});

account.get("/portfolio", async (req, res) => {
  const investor = await db.investor.findUnique({
    where: { ownerId: req.user!.userId },
  });
  if (!investor)
    throw new HttpError(
      403,
      "Portfólio disponível apenas para perfis profissionais.",
    );
  const { page, limit } = paging.parse(req.query);
  const where = { investorId: investor.id };
  const [items, total] = await db.$transaction([
    db.investment.findMany({
      where,
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            sectors: true,
            stage: true,
            state: true,
          },
        },
        updates: { orderBy: { createdAt: "desc" }, take: 5 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.investment.count({ where }),
  ]);
  res.json({ items, total, page, limit });
});
