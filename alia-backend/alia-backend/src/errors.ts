import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res).catch(next);
  };

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ code: err.code, message: err.message, ...err.extra });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', issues: err.issues });
  }
  console.error(err);
  return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Erro interno. Tente novamente.' });
}
