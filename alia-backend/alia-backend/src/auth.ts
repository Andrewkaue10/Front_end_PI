import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from './config';
import { HttpError } from './errors';

export interface AuthedRequest extends Request {
  userId: string;
}

/**
 * Valida o JWT do NEXhub (header Authorization: Bearer <token>).
 * Se o NEXhub já tem autenticação própria, troque só o conteúdo desta função.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, 'UNAUTHORIZED', 'Faça login para continuar.'));
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub) throw new Error('sem sub');
    (req as AuthedRequest).userId = payload.sub;
    next();
  } catch {
    next(new HttpError(401, 'UNAUTHORIZED', 'Sessão inválida ou expirada.'));
  }
}
