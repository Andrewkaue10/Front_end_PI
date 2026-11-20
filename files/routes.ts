import type { FastifyInstance } from "fastify";
import { pool } from "../db";
import { SQL_CLIQUE, SQL_LISTAR, type EditalRow } from "./queries";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function editaisRoutes(app: FastifyInstance) {
  // GET /api/editais?uf=PE&areas=Agritech,Saúde&q=agro
  app.get<{ Querystring: { uf?: string; areas?: string; q?: string } }>(
    "/api/editais",
    async (req) => {
      const uf = /^[a-z]{2}$/i.test(req.query.uf ?? "") ? req.query.uf!.toUpperCase() : null;
      const areas = (req.query.areas ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      const q = (req.query.q ?? "").trim().replace(/[\\%_]/g, (m) => "\\" + m) || null;
      const { rows } = await pool.query<EditalRow>(SQL_LISTAR, [uf, areas, q]);
      return rows;
    }
  );

  // POST /api/editais/:id/clique  → registra que o usuário abriu o edital (não bloqueia a navegação)
  app.post<{ Params: { id: string } }>("/api/editais/:id/clique", async (req, reply) => {
    if (!UUID.test(req.params.id)) return reply.code(400).send({ erro: "id inválido" });
    const userId = (req as any).user?.id ?? null; // use o campo da sua autenticação
    await pool.query(SQL_CLIQUE, [req.params.id, userId]);
    return reply.code(204).send();
  });
}
// No server.ts:  app.register(editaisRoutes);
