> **Referência histórica do material recebido.** A implementação integrada está em `nexhub-api` e `Fron-pi`. Consulte `docs/ia/`. Não execute os SQLs abaixo no banco atual nem publique este servidor separado.

# Editais com botão "Abrir edital" (React + Vite, back em TypeScript, PostgreSQL)

## 1. Banco
    psql $DATABASE_URL -f migrations/003_editais_feature.sql

## 2. Back-end (copie para o seu projeto)
- backend/src/editais/queries.ts  → SQL da listagem (filtra prazo vencido, estado e busca; ordena por aderência)
- backend/src/editais/routes.ts   → GET /api/editais e POST /api/editais/:id/clique
- backend/src/db.ts               → só se você ainda não tiver um Pool do pg
- No server.ts:  app.register(editaisRoutes);   (Fastify)
  Se usar Express/NestJS, reaproveite queries.ts e adapte só as rotas.

## 3. Importar os editais
    npm i dotenv && npx tsx backend/scripts/importar-editais.ts backend/data/editais-reais.json
Pode rodar de novo: o campo "slug" evita duplicar.

## 4. Front-end (copie frontend/src/features/editais)
    <EditaisList uf={startup.estado} areas={startup.areas} />
Troque as classes "edital-*" pelo estilo do seu design.

## 5. vite.config.ts (evita CORS em desenvolvimento)
    server: { proxy: { "/api": "http://localhost:3000" } }

## Como o botão funciona
O botão é um <a href={url} target="_blank" rel="noopener noreferrer">: abre direto o edital em outra aba.
O onClick só envia um POST em segundo plano para registrar o clique (tabela edital_cliques).
