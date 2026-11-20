import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
test("rotas: consentimento, propriedade, cotas, persistência e falha externa", async () => {
  process.env.DATABASE_URL = "postgresql://test:test@localhost:1/test";
  const { db } = await import("../src/lib/db");
  const { alia } = await import("../src/routes/alia");
  const { errorHandler } = await import("../src/lib/errors");
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { userId: "user-a", role: "STARTUP", email: "private" };
    next();
  });
  app.use(alia);
  app.use(errorHandler);
  const original = {
    preference: db.aiPreference.findUnique,
    profile: db.startup.findUnique,
    transaction: db.$transaction,
    count: db.aiAnalysis.count,
    list: db.aiAnalysis.findMany,
    update: db.aiAnalysis.update,
    updateMany: db.aiAnalysis.updateMany,
  };
  const oldKey = process.env.ANTHROPIC_API_KEY,
    oldFetch = global.fetch;
  let pref = {
      enabled: false,
      externalProviderConsent: false,
      profileAnalysisEnabled: false,
    },
    used = 0,
    created = 0,
    last: any,
    updated: any;
  db.aiPreference.findUnique = (async () => pref) as any;
  db.startup.findUnique = (async (args: any) => {
    assert.deepEqual(args.where, { ownerId: "user-a" });
    return { name: "Empresa A", description: "Solução SaaS" };
  }) as any;
  const count = async (args: any) => {
    last = args;
    return used;
  };
  db.aiAnalysis.count = count as any;
  db.aiAnalysis.findMany = (async (args: any) => {
    assert.equal(args.where.userId, "user-a");
    return [];
  }) as any;
  db.aiAnalysis.update = (async (args: any) => {
    updated = args;
    return { id: "a", ...args.data };
  }) as any;
  db.aiAnalysis.updateMany = (async (args: any) => {
    last = args;
    return { count: 1 };
  }) as any;
  db.$transaction = (async (fn: any) =>
    fn({
      $executeRaw: async () => 0,
      aiAnalysis: {
        count,
        create: async (args: any) => {
          created++;
          assert.equal(args.data.userId, "user-a");
          return { id: "a", ...args.data };
        },
      },
    })) as any;
  const input = {
    message: "Como validar o problema com entrevistas?",
    topic: "diagnostico",
    mode: "local",
  };
  try {
    await request(app)
      .post("/alia/analyze")
      .send({ ...input, userId: "outro" })
      .expect(400);
    await request(app)
      .post("/alia/analyze")
      .send({ ...input, useProfile: true })
      .expect(403);
    await request(app)
      .post("/alia/analyze")
      .send({ ...input, mode: "claude" })
      .expect(403);
    assert.equal(created, 0);
    pref = {
      enabled: true,
      externalProviderConsent: true,
      profileAnalysisEnabled: true,
    };
    delete process.env.ANTHROPIC_API_KEY;
    await request(app)
      .post("/alia/analyze")
      .send({ ...input, mode: "claude" })
      .expect(503);
    const success = await request(app)
      .post("/alia/analyze")
      .send({ ...input, useProfile: true })
      .expect(201);
    assert.equal(success.body.result.usedProfile, true);
    assert.equal(updated.data.status, "SUCCEEDED");
    used = 100;
    await request(app).post("/alia/analyze").send(input).expect(429);
    used = 5;
    process.env.ANTHROPIC_API_KEY = "mock";
    await request(app)
      .post("/alia/analyze")
      .send({ ...input, mode: "claude" })
      .expect(429);
    used = 0;
    global.fetch = (async () =>
      new Response("{}", { status: 503 })) as typeof fetch;
    await request(app)
      .post("/alia/analyze")
      .send({ ...input, mode: "claude" })
      .expect(502);
    assert.equal(updated.data.status, "FAILED");
    assert.equal(updated.data.question, "");
    await request(app).get("/alia/me").expect(200);
    await request(app).delete("/alia/history").expect(204);
    assert.equal(last.where.userId, "user-a");
    assert.equal(last.data.hidden, true);
    assert.equal(last.data.question, "");
  } finally {
    db.aiPreference.findUnique = original.preference;
    db.startup.findUnique = original.profile;
    db.$transaction = original.transaction;
    db.aiAnalysis.count = original.count;
    db.aiAnalysis.findMany = original.list;
    db.aiAnalysis.update = original.update;
    db.aiAnalysis.updateMany = original.updateMany;
    global.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = oldKey;
    await db.$disconnect();
  }
});
