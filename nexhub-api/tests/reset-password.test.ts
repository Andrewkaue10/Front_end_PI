import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
test('reset: invalid, expired, consumed, concurrent and successful tokens', async () => {
  process.env.DATABASE_URL='postgresql://test:test@localhost:1/test';
  process.env.JWT_SECRET='test-only-secret-with-at-least-32-characters';
  const {db}=await import('../src/lib/db');
  const {authRoutes}=await import('../src/routes/auth');
  const {errorHandler}=await import('../src/lib/errors');
  const app=express(); app.use(express.json()); app.use('/auth',authRoutes); app.use(errorHandler);
  const token='a'.repeat(64), hash=createHash('sha256').update(token).digest('hex');
  let used=false, expired=false, collision=false, invalidated=false, saved:any;
  const original=db.$transaction;
  db.$transaction=(async (fn:any)=>fn({
    resetToken:{
      findUnique:async ({where}:any)=>where.tokenHash===hash ? {id:'id',userId:'user',usedAt:used?new Date():null,expiresAt:new Date(Date.now()+(expired?-1000:60000))}:null,
      updateMany:async ({where}:any)=>{if(where.id){if(collision||used)return {count:0};used=true;}else invalidated=true; return {count:1};}
    }, user:{update:async (args:any)=>{saved=args;return {};}}
  })) as any;
  const send=(value=token,senha='NovaSenha123')=>request(app).post('/auth/reset-password').send({token:value,senha});
  try {
    await send('invalid').expect(400);
    await send(token,'123').expect(400);
    await send('b'.repeat(64)).expect(400);
    expired=true;await send().expect(400);expired=false;
    collision=true;await send().expect(400);collision=false;
    assert.equal(saved,undefined);
    await send().expect(200);
    assert.equal(await bcrypt.compare('NovaSenha123',saved.data.passwordHash),true);
    assert.equal(saved.where.id,'user');
    assert.deepEqual(saved.data.tokenVersion,{increment:1});
    assert.equal(invalidated,true);
    await send(token,'OutraSenha123').expect(400);
    assert.equal(await bcrypt.compare('NovaSenha123',saved.data.passwordHash),true);
  } finally {db.$transaction=original;await db.$disconnect();}
});
