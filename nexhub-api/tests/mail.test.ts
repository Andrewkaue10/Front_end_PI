import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resetMailConfig, sendPasswordReset } from '../src/lib/mail';
const env = { NODE_ENV: 'production', APP_URL: 'https://nexhub-alpha.vercel.app', RESEND_API_KEY: 'test-key', EMAIL_FROM: 'Nexhub <onboarding@resend.dev>' };
test('configuration requires an email provider and a secure production URL', () => {
  assert.throws(() => resetMailConfig({ NODE_ENV: 'production' }));
  assert.throws(() => resetMailConfig({ ...env, APP_URL: 'http://example.com' }));
  assert.throws(() => resetMailConfig({ ...env, APP_URL: 'https://user:password@example.com' }));
});
test('multiple CORS origins do not corrupt the recovery URL', () => {
  assert.equal(resetMailConfig({ ...env, APP_URL: undefined, FRONTEND_ORIGIN: 'https://nexhub-alpha.vercel.app,http://localhost:5173' }).origin, env.APP_URL);
});
test('Resend sends the reset token only in the email to the account owner', async () => {
  let called = false;
  const request = (async (url, options) => {
    called = true;
    assert.equal(url, 'https://api.resend.com/emails');
    const body = JSON.parse(String(options?.body));
    assert.deepEqual(body.to, ['owner@example.com']);
    assert.ok(body.text.includes('https://nexhub-alpha.vercel.app/redefinir-senha?token=abc123'));
    assert.equal(body.from, env.EMAIL_FROM);
    assert.equal((options?.headers as Record<string,string>).Authorization, 'Bearer test-key');
    return new Response('{"id":"test"}', {status:200});
  }) as typeof fetch;
  await sendPasswordReset('owner@example.com', 'abc123', resetMailConfig(env), request);
  assert.equal(called, true);
});
test('provider failures are rejected without exposing provider response data', async () => {
  const request = (async () => new Response('private-provider-data', {status:403})) as typeof fetch;
  await assert.rejects(sendPasswordReset('owner@example.com', 'abc123', resetMailConfig(env), request), /^Error: EMAIL_DELIVERY_FAILED$/);
});
