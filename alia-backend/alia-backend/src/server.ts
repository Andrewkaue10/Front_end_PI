import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config';
import { pool } from './db';
import { errorMiddleware } from './errors';
import { aliaRouter } from './routes/alia';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '50kb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/alia', aliaRouter);
app.use(errorMiddleware);

const server = app.listen(env.PORT, () => {
  console.log(`A.L.I.A backend rodando na porta ${env.PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => pool.end().then(() => process.exit(0)));
});
