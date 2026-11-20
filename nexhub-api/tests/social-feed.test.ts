import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
test("public feed filters by startup without exposing drafts or inactive authors", async () => {
  process.env.DATABASE_URL = "postgresql://test:test@localhost:1/test";
  const { db } = await import("../src/lib/db");
  const { publications } = await import("../src/routes/publications");
  const { errorHandler } = await import("../src/lib/errors");
  const app = express();
  app.use((req, _res, next) => {
    req.user = { userId: "u" } as any;
    next();
  });
  app.use(publications);
  app.use(errorHandler);
  const id = "11111111-1111-4111-8111-111111111111";
  let query: any;
  const originals = [db.post.findMany, db.post.count, db.$transaction];
  db.post.findMany = (async (args: any) => {
    query = args;
    return [];
  }) as any;
  db.post.count = (async () => 0) as any;
  db.$transaction = ((values: any) => Promise.all(values)) as any;
  try {
    await request(app)
      .get("/posts?authorId=" + id)
      .expect(200);
    assert.equal(query.where.authorId, id);
    assert.equal(query.where.status, "PUBLISHED");
    assert.deepEqual(query.where.author, {
      status: "APPROVED",
      owner: { active: true, isDemo: false },
    });
    assert.deepEqual(query.include.reposts.where, { userId: "u" });
    await request(app).get("/posts?authorId=invalid").expect(400);
  } finally {
    db.post.findMany = originals[0] as any;
    db.post.count = originals[1] as any;
    db.$transaction = originals[2] as any;
    await db.$disconnect();
  }
});
