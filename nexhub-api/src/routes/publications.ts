import { Router } from "express";
import { z } from "zod";
import { db } from "../lib/db";
import { HttpError } from "../lib/errors";
import { paging, uuid } from "../domain/validation";

export const publications = Router();

const metricInput = z.object({
  name: z.string().trim().min(1).max(120),
  value: z.string().trim().min(1).max(120),
  unit: z.string().trim().max(40).default(""),
  period: z.string().trim().max(80).default(""),
});
const tagsInput = z
  .array(
    z
      .string()
      .trim()
      .min(1)
      .max(40)
      .transform((tag) => tag.replace(/^#/, ""))
      .pipe(z.string().min(1).max(40)),
  )
  .max(20)
  .default([])
  .transform((tags) => [...new Set(tags)]);

async function startupFor(userId: string) {
  const startup = await db.startup.findUnique({
    where: { ownerId: userId },
    include: { owner: { select: { active: true, isDemo: true } } },
  });
  if (!startup || !startup.owner.active || startup.owner.isDemo)
    throw new HttpError(403, "Ação disponível apenas para startups ativas.");
  if (startup.status === "REJECTED")
    throw new HttpError(409, "Seu perfil foi rejeitado e não pode publicar.");
  return startup;
}

async function visiblePost(id: string) {
  const post = await db.post.findFirst({
    where: {
      id,
      status: "PUBLISHED",
      author: {
        status: "APPROVED",
        owner: { active: true, isDemo: false },
      },
    },
    select: { id: true },
  });
  if (!post) throw new HttpError(404, "Publicação indisponível.");
  return post;
}

const postInclude = (userId: string) => ({
  author: {
    select: {
      id: true,
      name: true,
      ownerId: true,
      owner: { select: { active: true, isDemo: true } },
    },
  },
  tags: { select: { tag: true }, orderBy: { tag: "asc" as const } },
  metric: { include: { metric: true } },
  likes: { where: { userId }, select: { userId: true } },
  reposts: { where: { userId }, select: { userId: true } },
  _count: { select: { likes: true, comments: true, reposts: true } },
});

function postResponse(post: any, userId: string) {
  return {
    id: post.id,
    authorId: post.author.id,
    authorName: post.author.name,
    text: post.text,
    status: post.status,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    tags: post.tags.map((item: { tag: string }) => item.tag),
    metric: post.metric?.metric ?? null,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    repostsCount: post._count.reposts,
    liked: post.likes.length > 0,
    reposted: post.reposts.length > 0,
    owner: post.author.ownerId === userId,
    isDemo: post.author.owner.isDemo,
  };
}

publications.get("/posts", async (req, res) => {
  const { page, limit } = paging.parse(req.query);
  const q = z
    .string()
    .trim()
    .max(120)
    .parse(req.query.q || "");
  const tag = z
    .string()
    .trim()
    .max(40)
    .parse(req.query.tag || "");
  const view = z
    .enum(["feed", "mine", "drafts"])
    .default("feed")
    .parse(req.query.view);
  const authorId = uuid.optional().parse(req.query.authorId);
  const userId = req.user!.userId;
  const startup = view === "feed" ? null : await startupFor(userId);
  const where: any = {
    ...(view === "drafts"
      ? { authorId: startup!.id, status: "DRAFT" }
      : view === "mine"
        ? { authorId: startup!.id, status: "PUBLISHED" }
        : {
            status: "PUBLISHED",
            author: {
              status: "APPROVED",
              owner: { active: true, isDemo: false },
            },
          }),
    ...(q
      ? {
          OR: [
            { text: { contains: q, mode: "insensitive" } },
            {
              tags: {
                some: {
                  tag: { contains: q.replace(/^#/, ""), mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
    ...(tag ? { tags: { some: { tag } } } : {}),
    ...(authorId && view === "feed" ? { authorId } : {}),
  };
  const [rows, total] = await db.$transaction([
    db.post.findMany({
      where,
      include: postInclude(userId),
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.post.count({ where }),
  ]);
  res.json({
    items: rows.map((post) => postResponse(post, userId)),
    total,
    page,
    limit,
  });
});

publications.post("/posts", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const value = z
    .object({
      text: z.string().trim().min(1).max(5000),
      tags: tagsInput,
      metricId: uuid.optional(),
      status: z.enum(["PUBLISHED", "DRAFT"]).default("PUBLISHED"),
    })
    .parse(req.body);
  if (value.status === "PUBLISHED" && startup.status !== "APPROVED")
    throw new HttpError(
      409,
      "Seu perfil precisa estar aprovado para publicar.",
    );
  if (value.metricId) {
    const metric = await db.startupMetric.findFirst({
      where: { id: value.metricId, startupId: startup.id },
      select: { id: true },
    });
    if (!metric) throw new HttpError(400, "A métrica selecionada é inválida.");
  }
  const post = await db.post.create({
    data: {
      authorId: startup.id,
      text: value.text,
      status: value.status,
      tags: { create: value.tags.map((tag) => ({ tag })) },
      ...(value.metricId
        ? { metric: { create: { metricId: value.metricId } } }
        : {}),
    },
    include: postInclude(req.user!.userId),
  });
  res.status(201).json(postResponse(post, req.user!.userId));
});

publications.patch("/posts/:id", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const value = z
    .object({
      text: z.string().trim().min(1).max(5000).optional(),
      tags: tagsInput.optional(),
      metricId: uuid.nullable().optional(),
      status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
    })
    .parse(req.body);
  if (!Object.keys(value).length)
    throw new HttpError(400, "Informe ao menos um campo.");
  if (value.status === "PUBLISHED" && startup.status !== "APPROVED")
    throw new HttpError(
      409,
      "Seu perfil precisa estar aprovado para publicar.",
    );
  if (value.metricId) {
    const metric = await db.startupMetric.findFirst({
      where: { id: value.metricId, startupId: startup.id },
      select: { id: true },
    });
    if (!metric) throw new HttpError(400, "A métrica selecionada é inválida.");
  }
  const existing = await db.post.findFirst({
    where: { id: uuid.parse(req.params.id), authorId: startup.id },
  });
  if (!existing) throw new HttpError(404, "Publicação indisponível.");
  await db.$transaction([
    db.post.update({
      where: { id: existing.id },
      data: {
        ...(value.text ? { text: value.text } : {}),
        ...(value.status ? { status: value.status } : {}),
      },
    }),
    ...(value.tags
      ? [
          db.postTag.deleteMany({ where: { postId: existing.id } }),
          db.postTag.createMany({
            data: value.tags.map((tag) => ({ postId: existing.id, tag })),
            skipDuplicates: true,
          }),
        ]
      : []),
    ...(value.metricId !== undefined
      ? value.metricId
        ? [
            db.postMetric.upsert({
              where: { postId: existing.id },
              create: { postId: existing.id, metricId: value.metricId },
              update: { metricId: value.metricId },
            }),
          ]
        : [db.postMetric.deleteMany({ where: { postId: existing.id } })]
      : []),
  ]);
  const post = await db.post.findUniqueOrThrow({
    where: { id: existing.id },
    include: postInclude(req.user!.userId),
  });
  res.json(postResponse(post, req.user!.userId));
});

publications.delete("/posts/:id", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const deleted = await db.post.deleteMany({
    where: { id: uuid.parse(req.params.id), authorId: startup.id },
  });
  if (!deleted.count) throw new HttpError(404, "Publicação indisponível.");
  res.status(204).end();
});

publications.get("/posts/:id/comments", async (req, res) => {
  const post = await visiblePost(uuid.parse(req.params.id));
  const { page, limit } = paging.parse(req.query);
  const [items, total] = await db.$transaction([
    db.comment.findMany({
      where: { postId: post.id },
      include: { user: { select: { id: true, name: true } } },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.comment.count({ where: { postId: post.id } }),
  ]);
  res.json({ items, total, page, limit });
});

publications.post("/posts/:id/comments", async (req, res) => {
  const post = await visiblePost(uuid.parse(req.params.id));
  const { text } = z
    .object({ text: z.string().trim().min(1).max(2000) })
    .parse(req.body);
  const comment = await db.comment.create({
    data: { postId: post.id, userId: req.user!.userId, text },
    include: { user: { select: { id: true, name: true } } },
  });
  res.status(201).json(comment);
});

publications.delete("/posts/:id/comments/:commentId", async (req, res) => {
  const id = uuid.parse(req.params.id);
  const commentId = uuid.parse(req.params.commentId);
  const deleted = await db.comment.deleteMany({
    where: { id: commentId, postId: id, userId: req.user!.userId },
  });
  if (!deleted.count) throw new HttpError(404, "Comentário indisponível.");
  res.status(204).end();
});

publications.post("/posts/:id/like", async (req, res) => {
  const post = await visiblePost(uuid.parse(req.params.id));
  await db.postLike.upsert({
    where: { postId_userId: { postId: post.id, userId: req.user!.userId } },
    create: { postId: post.id, userId: req.user!.userId },
    update: {},
  });
  res.status(204).end();
});

publications.delete("/posts/:id/like", async (req, res) => {
  const post = await visiblePost(uuid.parse(req.params.id));
  await db.postLike.deleteMany({
    where: { postId: post.id, userId: req.user!.userId },
  });
  res.status(204).end();
});

publications.post("/posts/:id/repost", async (req, res) => {
  const post = await visiblePost(uuid.parse(req.params.id));
  await db.postRepost.upsert({
    where: { postId_userId: { postId: post.id, userId: req.user!.userId } },
    create: { postId: post.id, userId: req.user!.userId },
    update: {},
  });
  res.status(204).end();
});

publications.delete("/posts/:id/repost", async (req, res) => {
  const post = await visiblePost(uuid.parse(req.params.id));
  await db.postRepost.deleteMany({
    where: { postId: post.id, userId: req.user!.userId },
  });
  res.status(204).end();
});

publications.get("/startup-metrics", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  res.json({
    items: await db.startupMetric.findMany({
      where: { startupId: startup.id },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    }),
  });
});

publications.post("/startup-metrics", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const value = metricInput.parse(req.body);
  res.status(201).json(
    await db.startupMetric.create({
      data: { ...value, startupId: startup.id },
    }),
  );
});

publications.patch("/startup-metrics/:id", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const value = metricInput.partial().parse(req.body);
  if (!Object.keys(value).length)
    throw new HttpError(400, "Informe ao menos um campo.");
  const changed = await db.startupMetric.updateMany({
    where: { id: uuid.parse(req.params.id), startupId: startup.id },
    data: value,
  });
  if (!changed.count) throw new HttpError(404, "Métrica indisponível.");
  res.json(
    await db.startupMetric.findUniqueOrThrow({
      where: { id: uuid.parse(req.params.id) },
    }),
  );
});

publications.delete("/startup-metrics/:id", async (req, res) => {
  const startup = await startupFor(req.user!.userId);
  const deleted = await db.startupMetric.deleteMany({
    where: { id: uuid.parse(req.params.id), startupId: startup.id },
  });
  if (!deleted.count) throw new HttpError(404, "Métrica indisponível.");
  res.status(204).end();
});

publications.post("/startups/:id/dismiss", async (req, res) => {
  const investor = await db.investor.findUnique({
    where: { ownerId: req.user!.userId },
    include: { owner: { select: { active: true, isDemo: true } } },
  });
  if (!investor || !investor.owner.active || investor.owner.isDemo)
    throw new HttpError(
      403,
      "Ação disponível apenas para investidores ativos.",
    );
  if (investor.status !== "APPROVED")
    throw new HttpError(409, "Seu perfil precisa estar aprovado.");
  const startupId = uuid.parse(req.params.id);
  if (
    !(await db.startup.findFirst({
      where: {
        id: startupId,
        status: "APPROVED",
        owner: { active: true, isDemo: false },
      },
      select: { id: true },
    }))
  )
    throw new HttpError(404, "Perfil indisponível.");
  await db.matchDismissal.upsert({
    where: {
      investorId_startupId: { investorId: investor.id, startupId },
    },
    create: { investorId: investor.id, startupId },
    update: {},
  });
  res.status(204).end();
});

publications.delete("/startups/:id/dismiss", async (req, res) => {
  const investor = await db.investor.findUnique({
    where: { ownerId: req.user!.userId },
    select: { id: true },
  });
  if (!investor)
    throw new HttpError(403, "Ação disponível apenas a investidores.");
  await db.matchDismissal.deleteMany({
    where: {
      investorId: investor.id,
      startupId: uuid.parse(req.params.id),
    },
  });
  res.status(204).end();
});

publications.get("/match-dismissals", async (req, res) => {
  const investor = await db.investor.findUnique({
    where: { ownerId: req.user!.userId },
  });
  if (!investor)
    throw new HttpError(403, "Ação disponível apenas a investidores.");
  const { page, limit } = paging.parse(req.query);
  const rows = await db.matchDismissal.findMany({
    where: {
      investorId: investor.id,
      startup: {
        status: "APPROVED",
        owner: { active: true, isDemo: false },
      },
    },
    include: {
      startup: {
        include: { owner: { select: { isDemo: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  res.json({
    items: rows.map(({ startup }) => postDismissedStartup(startup)),
    page,
    limit,
  });
});

function postDismissedStartup(startup: any) {
  return {
    id: startup.id,
    name: startup.name,
    initials: startup.name
      .split(" ")
      .slice(0, 2)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase(),
    category: startup.sectors[0],
    sectors: startup.sectors,
    description: startup.description,
    stage: startup.stage,
    fundingRange: startup.fundingRange,
    isDemo: startup.owner?.isDemo || false,
  };
}

publications.post("/match-dismissals", async (req, res) => {
  const { startupId } = z.object({ startupId: uuid }).parse(req.body);
  const investor = await db.investor.findUnique({
    where: { ownerId: req.user!.userId },
    include: { owner: { select: { active: true, isDemo: true } } },
  });
  if (!investor || !investor.owner.active || investor.owner.isDemo)
    throw new HttpError(403, "Ação disponível apenas a investidores ativos.");
  if (investor.status !== "APPROVED")
    throw new HttpError(409, "Seu perfil precisa estar aprovado.");
  if (
    !(await db.startup.findFirst({
      where: {
        id: startupId,
        status: "APPROVED",
        owner: { active: true, isDemo: false },
      },
      select: { id: true },
    }))
  )
    throw new HttpError(404, "Perfil indisponível.");
  await db.matchDismissal.upsert({
    where: { investorId_startupId: { investorId: investor.id, startupId } },
    create: { investorId: investor.id, startupId },
    update: {},
  });
  res.status(204).end();
});

publications.delete("/match-dismissals/:id", async (req, res) => {
  const investor = await db.investor.findUnique({
    where: { ownerId: req.user!.userId },
  });
  if (!investor)
    throw new HttpError(403, "Ação disponível apenas a investidores.");
  await db.matchDismissal.deleteMany({
    where: { investorId: investor.id, startupId: uuid.parse(req.params.id) },
  });
  res.status(204).end();
});
