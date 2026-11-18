# Mapa de integração Nexhub

Este documento registra como o frontend `Fron-pi` se conecta ao backend incorporado em `nexhub-api/`. O código veio do arquivo `nexhub-api-codex-integracao-nexhub (1).zip`; o relatório original está em `nexhub-api/docs/integracao-2026-10-20.md`, atualizado em 20/10/2026.

## Caminho da requisição

```text
Páginas React (src/pages)
  -> src/lib/api.js (URL, JSON, Bearer token, erros e sessão)
  -> Express (prefixo /api)
  -> rotas de autenticação, perfis, interações ou administração
  -> validação e regras de domínio
  -> Prisma
  -> PostgreSQL no schema privado nexhub (Supabase)
```

O navegador acessa a API Express. O frontend não deve conectar diretamente ao PostgreSQL nem receber `DATABASE_URL`, certificados ou `JWT_SECRET`.

## Configuração e sessão

- `src/lib/api.js` usa `VITE_API_URL`; sem variável, chama `http://localhost:3333/api`.
- O backend usa `http://localhost:3333/api` no desenvolvimento. O CORS permite `https://nexhub-alpha.vercel.app` e também as origens em `FRONTEND_ORIGIN` (por padrão, `http://localhost:5173`).
- `api(path, options)` acrescenta JSON e `Authorization: Bearer ...`, serializa `options.body` e converte os erros `{ error, fields }` em mensagens para a tela.
- `saveSession` guarda `nexhub.token` no `sessionStorage`; com “manter conectado”, usa `localStorage`. Respostas 401 limpam a sessão e redirecionam para `/login`, exceto nas rotas de autenticação que podem responder sem sessão.
- O token é emitido no cadastro/login. `GET /auth/me` é a fonte dos dados atuais do usuário e perfil (`startup` ou `investor`).

## Telas e endpoints ligados

| Frontend | Chamadas principais | Responsabilidade do backend |
|---|---|---|
| `pages/SignupStartup/SignupStartup.jsx` | `POST /auth/register` | Cria usuário e perfil de startup pendente. |
| `pages/SignupInvestor/SignupInvestor.jsx` | `POST /auth/register` | Cria perfil profissional como `INVESTOR`, `MENTOR` ou `BOTH`, pendente. |
| `pages/Login/Login.jsx` | `POST /auth/login` | Valida credenciais e retorna `access_token` e `user`. |
| `pages/ForgotPassword/ForgotPassword.jsx` | `POST /auth/forgot-password` | Solicita recuperação por e-mail; envio depende de SMTP configurado no backend. |
| `pages/ResetPassword/ResetPassword.jsx` | `POST /auth/reset-password` | Consome token de uso único e troca a senha. |
| `pages/Feed/Feed.jsx` | `GET /auth/me`, `GET /startups`, `GET /investors`, `GET /recommendations`, `PUT/DELETE /favorites/:id`, `POST /auth/logout` | Lista perfis aprovados, busca/filtros, recomendações, favoritos e revogação da sessão. |
| `pages/Workspace/Workspace.jsx` | `/auth/me`, `/profile`, `/connections`, `/meetings`, `/notifications`, `/admin/*`, detalhes `/startups/:id` e `/investors/:id` | Perfil próprio, convites, mensagens, agenda, avisos e moderação. |

As chamadas de `Workspace` incluem:

- `GET /connections?page=...`, `PATCH /connections/:id` com `accept`, `decline`, `cancel` ou `close`.
- `GET/POST /connections/:id/messages`; o envio inclui `text` e `clientId` para impedir duplicação.
- `POST /connections/:id/meetings` e `PATCH /meetings/:id` com `confirm`, `cancel` ou `complete`.
- `GET /meetings`, `GET /notifications` e `PATCH /notifications/:id`.
- Para administrador: `GET /admin/profiles`, `GET /admin/metrics` e `PATCH /admin/profiles/:kind/:id`.

## Contrato relevante

- O backend monta `/api/auth` para autenticação, `/api` para perfis e interações e `/api/admin` para administração. `/health` fica fora de `/api`.
- Campos do cadastro são em português (`nome`, `telefone`, `senha`, `confirmarSenha`, `termos`, `setores` etc.); a resposta de cadastro/login contém `access_token`.
- Listas retornam `{ items, page, limit }` (algumas também incluem `total`). A interface consome `items`.
- Favoritos são somente para perfis profissionais e usam `PUT` para salvar e `DELETE` para remover.
- A edição de perfil envia `PATCH /profile`. No perfil profissional usa `bio`; no de startup usa `description`. Alterações voltam para análise (`PENDING`).
- Convites só podem ser respondidos pelo destinatário; conversas são restritas aos participantes. Mensagens e reuniões exigem conexão aceita.
- O catálogo oficial existe em `GET /api/catalog`, mas o frontend atual não o consulta: listas de setores, estágios e faixas também estão declaradas nas telas de cadastro. Alterar opções exige manter os dois lados em sincronia.

## Limites conhecidos da entrega do backend

- Recomendações exigem perfil próprio aprovado; apenas perfis aprovados e ativos aparecem na descoberta.
- Chat atualiza por nova consulta manual, sem WebSocket.
- Recuperação por e-mail depende de SMTP; recuperação por telefone, login social, upload de arquivos, feedback e cobrança não estão implementados nesta etapa.
- A edição do perfil tem escopo limitado; não cobre todas as preferências do cadastro.
- A especificação completa e pendências estão em `nexhub-api/docs/especificacao-final/Nexhub_Especificacao_Final_v1.md`. Os documentos anexados descrevem o projeto e serviram como referência para esta integração.

## Arquivos úteis para futuras mudanças

- Frontend: `src/lib/api.js`, `src/pages/Feed/Feed.jsx`, `src/pages/Workspace/Workspace.jsx` e as páginas de autenticação/cadastro citadas acima.
- Backend: `nexhub-api/src/app.ts`, `nexhub-api/src/routes/auth.ts`, `nexhub-api/src/routes/profiles.ts`, `nexhub-api/src/routes/interactions.ts`, `nexhub-api/src/routes/admin.ts`, `nexhub-api/src/domain/validation.ts`, `nexhub-api/src/domain/matchmaking.ts` e `nexhub-api/prisma/schema.prisma`.
- Guia de integração do backend: `nexhub-api/docs/integracao-2026-10-20.md`.
