import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
test("notification details enforce ownership and connection membership", async () => {
  process.env.DATABASE_URL = "postgresql://test:test@localhost:1/test";
  process.env.JWT_SECRET = "test-only-secret-with-at-least-32-characters";
  const { db } = await import("../src/lib/db");
  const { interactions } = await import("../src/routes/interactions");
  const { errorHandler } = await import("../src/lib/errors");
  const app = express();
  app.use((req, _res, next) => {
    req.user = { userId: "owner", role: "INVESTOR" } as any;
    next();
  });
  app.use(interactions);
  app.use(errorHandler);
  const id = "11111111-1111-4111-8111-111111111111";
  let owned = false,
    available = true,
    requestedBy = "other",
    type = "CONNECTION_REQUEST";
  const originals = [
    db.notification.findFirst,
    db.connection.findFirst,
    db.meeting.findFirst,
  ];
  db.notification.findFirst = (async ({ where }: any) => {
    assert.deepEqual(where, { id, userId: "owner" });
    return owned ? { id, userId: "owner", type, resourceId: "resource" } : null;
  }) as any;
  db.connection.findFirst = (async ({ where }: any) => {
    assert.equal(owned, true);
    assert.deepEqual(where, {
      id: "resource",
      OR: [
        { startup: { ownerId: "owner" } },
        { investor: { ownerId: "owner" } },
      ],
    });
    return available
      ? {
          id: "resource",
          status: "PENDING",
          requestedBy,
          startup: { id: "startup", name: "Startup", ownerId: "other" },
          investor: { id: "investor", name: "Investor", ownerId: "owner" },
        }
      : null;
  }) as any;
  db.meeting.findFirst = (async ({ where }: any) => {
    assert.deepEqual(where, {
      id: "resource",
      connection: {
        OR: [
          { startup: { ownerId: "owner" } },
          { investor: { ownerId: "owner" } },
        ],
      },
    });
    return null;
  }) as any;
  try {
    await request(app)
      .get("/notifications/" + id)
      .expect(404);
    owned = true;
    let result = await request(app)
      .get("/notifications/" + id)
      .expect(200);
    assert.deepEqual(result.body.partner, { id: "startup", name: "Startup" });
    assert.equal(result.body.connection.canRespond, true);
    requestedBy = "owner";
    result = await request(app)
      .get("/notifications/" + id)
      .expect(200);
    assert.equal(result.body.connection.canRespond, false);
    available = false;
    result = await request(app)
      .get("/notifications/" + id)
      .expect(200);
    assert.equal(result.body.connection, null);
    assert.equal(result.body.partner, null);
    type = "MEETING_CONFIRMED";
    result = await request(app)
      .get("/notifications/" + id)
      .expect(200);
    assert.equal(result.body.meeting, null);
  } finally {
    db.notification.findFirst = originals[0] as any;
    db.connection.findFirst = originals[1] as any;
    db.meeting.findFirst = originals[2] as any;
    await db.$disconnect();
  }
});
