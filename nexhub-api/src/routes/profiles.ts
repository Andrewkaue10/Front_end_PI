import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { professional } from "../lib/security";
import { HttpError } from "../lib/errors";
import { calculateMatch } from "../domain/matchmaking";
import { paging, profileEdit, uuid } from "../domain/validation";
import { fundingRanges, ticketRanges } from "../domain/catalog";

export const profiles = Router();
const money = (v: unknown) =>
  v == null
    ? "Não informado"
    : Number(v).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      });
export function startupCard(
  s: any,
  match: any = null,
  favorite = false,
  connection: any = null,
) {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    initials: s.name
      .split(" ")
      .slice(0, 2)
      .map((x: string) => x[0])
      .join(""),
    color: s.color,
    category: s.sectors[0],
    sectors: s.sectors,
    tags: s.tags,
    description: s.description,
    stage: s.stage,
    ask: money(s.ask),
    fundingRange: s.fundingRange,
    growth: s.growth || "Não informado",
    valuation: money(s.valuation),
    match: match?.score ?? null,
    matchDetails: match,
    favorited: favorite,
    connection: connection
      ? {
          id: connection.id,
          status: connection.status,
          requestedBy: connection.requestedBy,
        }
      : null,
    needs: s.needs,
    city: s.city,
    state: s.state,
    website: s.website,
    status: s.status,
    isDemo: s.owner?.isDemo || false,
  };
}
const investorCard = (i: any, match: any = null) => ({
  id: i.id,
  name: i.name,
  role: i.owner.role,
  company: i.company,
  type: i.type,
  interests: i.interests,
  stages: i.stages,
  ticketRange: i.ticketRange,
  specialties: i.specialties,
  availability: i.availability,
  bio: i.bio,
  city: i.city,
  state: i.state,
  status: i.status,
  match: match?.score ?? null,
  matchDetails: match,
  isDemo: i.owner.isDemo,
});

profiles.get("/startups", async (req, res) => {
  const { page, limit } = paging.parse(req.query);
  const q = z
    .string()
    .max(120)
    .parse(req.query.q || "");
  const category = z
    .string()
    .max(40)
    .parse(req.query.category || "Todos");
  const sector = z
    .string()
    .trim()
    .max(40)
    .parse(
      req.query.sector ||
        (["Todos", "Estágio MVP+"].includes(category) ? "" : category),
    );
  const stage = z
    .string()
    .trim()
    .max(40)
    .parse(req.query.stage || "");
  const ticket = z
    .enum(["", ...Object.keys(ticketRanges)])
    .parse(req.query.ticket || req.query.ticketRange || "");
  const ticketMin =
    req.query.ticketMin === undefined
      ? ticket
        ? ticketRanges[ticket][0]
        : undefined
      : z.coerce.number().finite().min(0).parse(req.query.ticketMin);
  const ticketMax =
    req.query.ticketMax === undefined
      ? ticket
        ? ticketRanges[ticket][1]
        : undefined
      : z.coerce.number().finite().min(0).parse(req.query.ticketMax);
  const and: any[] = [];
  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (ticket || ticketMin !== undefined || ticketMax !== undefined) {
    if (ticketMax != null) and.push({ fundingMin: { lte: ticketMax } });
    if (ticketMin !== undefined)
      and.push({
        OR: [{ fundingMax: null }, { fundingMax: { gte: ticketMin } }],
      });
  }
  const investor = await db.investor.findUnique({
    where: { ownerId: req.user!.userId },
    include: { owner: true },
  });
  const where: any = {
    status: "APPROVED",
    owner: { active: true, isDemo: false },
    ...(category === "Estágio MVP+"
      ? { stage: { in: ["MVP", "Tração", "Escala"] } }
      : {}),
    ...(sector ? { sectors: { has: sector } } : {}),
    ...(stage ? { stage } : {}),
    ...(and.length ? { AND: and } : {}),
    ...(investor ? { dismissals: { none: { investorId: investor.id } } } : {}),
  };
  if (req.query.favorites === "true")
    where.favorites = { some: { userId: req.user!.userId } };
  const [rows, total] = await db.$transaction([
    db.startup.findMany({
      where,
      include: {
        owner: { select: { isDemo: true } },
        favorites: { where: { userId: req.user!.userId } },
        connections: investor ? { where: { investorId: investor.id } } : false,
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.startup.count({ where }),
  ]);
  res.json({
    items: rows.map((s: any) =>
      startupCard(
        s,
        investor
          ? calculateMatch(s, { ...investor, role: investor.owner.role })
          : null,
        s.favorites.length > 0,
        s.connections?.[0],
      ),
    ),
    total,
    page,
    limit,
  });
});
profiles.get("/investors", async (req, res) => {
  const { page, limit } = paging.parse(req.query);
  const q = z
    .string()
    .trim()
    .max(120)
    .parse(req.query.q || "");
  const role = z
    .enum(["TODOS", "INVESTOR", "MENTOR", "BOTH"])
    .parse(req.query.role || "TODOS");
  const specialty = z
    .string()
    .trim()
    .max(40)
    .parse(req.query.specialty || "");
  const interest = z
    .string()
    .trim()
    .max(40)
    .parse(req.query.interest || "");
  const stage = z
    .string()
    .trim()
    .max(40)
    .parse(req.query.stage || "");
  const where: any = {
    status: "APPROVED",
    owner: {
      active: true,
      isDemo: false,
      ...(role === "TODOS" ? {} : { role }),
    },
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
            { type: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(specialty ? { specialties: { has: specialty } } : {}),
    ...(interest ? { interests: { has: interest } } : {}),
    ...(stage ? { stages: { has: stage } } : {}),
  };
  const [rows, total] = await db.$transaction([
    db.investor.findMany({
      where,
      include: { owner: { select: { role: true, isDemo: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    }),
    db.investor.count({ where }),
  ]);
  res.json({ items: rows.map((i) => investorCard(i)), total, page, limit });
});
profiles.get("/recommendations", async (req, res) => {
  const { page, limit } = paging.parse(req.query);
  const q = z
    .string()
    .trim()
    .max(120)
    .parse(req.query.q || "");
  const category = z
    .string()
    .trim()
    .max(40)
    .parse(req.query.category || "");
  const sector = z
    .string()
    .trim()
    .max(40)
    .parse(
      req.query.sector ||
        (["Todos", "Estágio MVP+"].includes(category) ? "" : category),
    );
  const stage = z
    .string()
    .trim()
    .max(40)
    .parse(req.query.stage || "");
  const ticket = z
    .enum(["", ...Object.keys(ticketRanges)])
    .parse(req.query.ticket || req.query.ticketRange || "");
  const own = await db.user.findUniqueOrThrow({
    where: { id: req.user!.userId },
    include: { startup: true, investor: true },
  });
  let items: any[] = [];
  if (own.startup) {
    if (own.startup.status !== "APPROVED")
      throw new HttpError(
        409,
        "Seu perfil precisa ser aprovado para receber recomendações.",
      );
    const rows = await db.investor.findMany({
      where: {
        status: "APPROVED",
        owner: { active: true, isDemo: false },
        ...(sector ? { interests: { has: sector } } : {}),
        ...(stage ? { stages: { has: stage } } : {}),
        ...(ticket ? { ticketRange: ticket } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { company: { contains: q, mode: "insensitive" } },
                { bio: { contains: q, mode: "insensitive" } },
                { type: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        dismissals: { none: { startupId: own.startup.id } },
        connections: {
          none: {
            startupId: own.startup.id,
            status: { in: ["PENDING", "ACCEPTED"] },
          },
        },
      },
      include: { owner: { select: { role: true, isDemo: true } } },
    });
    items = rows.map((i) =>
      investorCard(
        i,
        calculateMatch(own.startup!, { ...i, role: i.owner.role }),
      ),
    );
  } else if (own.investor) {
    if (own.investor.status !== "APPROVED")
      throw new HttpError(
        409,
        "Seu perfil precisa ser aprovado para receber recomendações.",
      );
    const rows = await db.startup.findMany({
      where: {
        status: "APPROVED",
        owner: { active: true, isDemo: false },
        ...(sector ? { sectors: { has: sector } } : {}),
        ...(stage ? { stage } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(ticket
          ? {
              AND: [
                ...(ticketRanges[ticket][1] != null
                  ? [
                      {
                        fundingMin: {
                          lte: ticketRanges[ticket][1],
                        },
                      },
                    ]
                  : []),
                {
                  OR: [
                    { fundingMax: null },
                    { fundingMax: { gte: ticketRanges[ticket][0] } },
                  ],
                },
              ],
            }
          : {}),
        dismissals: { none: { investorId: own.investor.id } },
        connections: {
          none: {
            investorId: own.investor.id,
            status: { in: ["PENDING", "ACCEPTED"] },
          },
        },
      },
      include: {
        owner: { select: { isDemo: true } },
        favorites: { where: { userId: own.id } },
      },
    });
    items = rows.map((s) =>
      startupCard(
        s,
        calculateMatch(s, { ...own.investor!, role: own.role }),
        s.favorites.length > 0,
      ),
    );
  }
  items = items
    .filter((i) => i.match >= 40)
    .sort((a, b) => b.match - a.match || a.id.localeCompare(b.id));
  res.json({
    items: items.slice((page - 1) * limit, page * limit),
    total: items.length,
    page,
    limit,
    method: "rules-v1",
  });
});
profiles.get("/startups/:id", async (req, res) => {
  const id = uuid.parse(req.params.id);
  const s = await db.startup.findUnique({
    where: { id },
    include: {
      owner: { select: { active: true, isDemo: true } },
      connections: {
        where: { investor: { ownerId: req.user!.userId }, status: "ACCEPTED" },
      },
    },
  });
  if (
    !s ||
    !s.owner.active ||
    s.owner.isDemo ||
    (s.ownerId !== req.user!.userId &&
      req.user!.role !== "ADMIN" &&
      s.status !== "APPROVED")
  )
    throw new HttpError(404, "Perfil indisponível.");
  const allowed =
    s.ownerId === req.user!.userId ||
    req.user!.role === "ADMIN" ||
    s.materialsPublic ||
    s.connections.length > 0;
  res.json({
    ...startupCard(s),
    materials: {
      restricted: !allowed,
      pitchUrl: allowed ? s.pitchUrl : null,
      canvas: allowed ? s.canvas : null,
    },
  });
});
profiles.get("/investors/:id", async (req, res) => {
  const i = await db.investor.findUnique({
    where: { id: uuid.parse(req.params.id) },
    include: { owner: { select: { role: true, active: true, isDemo: true } } },
  });
  if (
    !i ||
    !i.owner.active ||
    i.owner.isDemo ||
    (i.ownerId !== req.user!.userId &&
      req.user!.role !== "ADMIN" &&
      i.status !== "APPROVED")
  )
    throw new HttpError(404, "Perfil indisponível.");
  res.json(investorCard(i));
});
profiles.patch("/profile", async (req, res) => {
  const v = profileEdit.parse(req.body);
  if (req.user!.role === "STARTUP") {
    const data = {
      name: v.name,
      description: v.description,
      city: v.city,
      state: v.state,
      needs: v.needs,
      website: v.website,
      pitchUrl: v.pitchUrl,
      canvas: v.canvas,
      materialsPublic: v.materialsPublic,
      sectors: v.sectors,
      stage: v.stage,
      fundingRange: v.fundingRange,
      ...(v.fundingRange
        ? {
            fundingMin: fundingRanges[v.fundingRange][0],
            fundingMax: fundingRanges[v.fundingRange][1],
          }
        : {}),
      ask: v.ask,
      growth: v.growth,
      valuation: v.valuation,
    };
    await db.startup.update({
      where: { ownerId: req.user!.userId },
      data: { ...data, status: "PENDING" },
    });
  } else if (["INVESTOR", "MENTOR", "BOTH"].includes(req.user!.role)) {
    const data = {
      name: v.name,
      bio: v.bio,
      city: v.city,
      state: v.state,
      stages: v.stages,
      company: v.company,
      type: v.type,
      interests: v.interests,
      ticketRange: v.ticketRange,
      ...(v.ticketRange !== undefined
        ? {
            ticketMin: v.ticketRange ? ticketRanges[v.ticketRange][0] : null,
            ticketMax: v.ticketRange ? ticketRanges[v.ticketRange][1] : null,
          }
        : {}),
      specialties: v.specialties,
      availability: v.availability,
    };
    await db.investor.update({
      where: { ownerId: req.user!.userId },
      data: { ...data, status: "PENDING" },
    });
  } else throw new HttpError(403, "Perfil não editável.");
  res.json({ message: "Alterações salvas e enviadas para análise." });
});
profiles.put("/favorites/:id", professional, async (req, res) => {
  const id = uuid.parse(req.params.id);
  if (
    !(await db.startup.findFirst({
      where: { id, status: "APPROVED", owner: { active: true, isDemo: false } },
    }))
  )
    throw new HttpError(404, "Perfil indisponível.");
  await db.favorite.upsert({
    where: { userId_startupId: { userId: req.user!.userId, startupId: id } },
    create: { userId: req.user!.userId, startupId: id },
    update: {},
  });
  res.status(204).end();
});
profiles.delete("/favorites/:id", professional, async (req, res) => {
  await db.favorite.deleteMany({
    where: { userId: req.user!.userId, startupId: uuid.parse(req.params.id) },
  });
  res.status(204).end();
});
