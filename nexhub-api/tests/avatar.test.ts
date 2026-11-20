import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
test("avatar is validated, saved for authenticated owner and removable", async () => {
  process.env.DATABASE_URL = "postgresql://test:test@localhost:1/test";
  process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";
  const { db } = await import("../src/lib/db");
  const { account } = await import("../src/routes/account");
  const { errorHandler } = await import("../src/lib/errors");
  const app = express();
  app.use(express.json({ limit: "400kb" }));
  app.use((req, _res, next) => {
    req.user = { userId: "owner" } as any;
    next();
  });
  app.use(account);
  app.use(errorHandler);
  let saved: any;
  const original = db.user.update;
  db.user.update = (async (args: any) => {
    saved = args;
    return {};
  }) as any;
  try {
    await request(app)
      .put("/account/avatar")
      .send({ avatarData: "data:image/svg+xml;base64,AAAA" })
      .expect(400);
    await request(app)
      .put("/account/avatar")
      .send({ avatarData: "data:image/jpeg;base64,AAAA" })
      .expect(400);
    assert.equal(saved, undefined);
    const photo =
      "data:image/jpeg;base64," +
      Buffer.from([255, 216, 255, 217]).toString("base64");
    await request(app)
      .put("/account/avatar")
      .send({ avatarData: photo, userId: "someone-else" })
      .expect(400);
    await request(app)
      .put("/account/avatar")
      .send({ avatarData: photo })
      .expect(200);
    assert.deepEqual(saved, {
      where: { id: "owner" },
      data: { avatarData: photo },
    });
    await request(app)
      .put("/account/avatar")
      .send({ avatarData: null })
      .expect(200);
    assert.equal(saved.data.avatarData, null);
  } finally {
    db.user.update = original;
    await db.$disconnect();
  }
});
