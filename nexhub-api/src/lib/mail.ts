import nodemailer from "nodemailer";
import { HttpError } from "./errors";

type Env = Record<string, string | undefined>;
export function resetMailConfig(env: Env = process.env) {
  const raw = env.APP_URL || env.FRONTEND_ORIGIN?.split(",")[0] || (env.NODE_ENV !== "production" ? "http://localhost:5173" : "");
  let origin: URL;
  try { origin = new URL(raw); } catch { throw new HttpError(503, "Recuperação de senha temporariamente indisponível."); }
  if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password || (env.NODE_ENV === 'production' && origin.protocol !== 'https:')) {
    throw new HttpError(503, "Recuperação de senha temporariamente indisponível.");
  }
  const from = env.EMAIL_FROM || env.SMTP_FROM;
  if (!from || (!env.RESEND_API_KEY && !env.SMTP_HOST)) {
    throw new HttpError(503, "Recuperação de senha temporariamente indisponível.");
  }
  return { origin: origin.origin, from, key: env.RESEND_API_KEY, env };
}

export async function sendPasswordReset(to: string, token: string, config = resetMailConfig(), request: typeof fetch = fetch) {
  const link = new URL('/redefinir-senha', config.origin);
  link.searchParams.set('token', token);
  const message = {
    from: config.from, to,
    subject: 'Nexhub — redefinir senha',
    text: `Recebemos uma solicitação para redefinir sua senha. Abra o link em até 30 minutos:\n\n${link}\n\nSe não foi você, ignore este e-mail. Sua senha permanece inalterada.`,
  };
  if (config.key) {
    const response = await request('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...message, to: [to] }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      // Never include the response body: it may contain addresses or credentials.
      console.error('Envio de recuperação recusado pelo Resend; HTTP', response.status);
      throw new Error('EMAIL_DELIVERY_FAILED');
    }
    return;
  }
  const env = config.env;
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_PORT === '465',
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    ...(env.SMTP_USER ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } } : {}),
  });
  try { await transport.sendMail(message); } finally { transport.close(); }
}
