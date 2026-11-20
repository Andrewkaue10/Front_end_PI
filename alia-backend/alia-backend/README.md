> **Referência histórica do material recebido.** A implementação integrada está em `nexhub-api` e `Fron-pi`. Consulte `docs/ia/`. Não execute os SQLs abaixo no banco atual nem publique este servidor separado.

# A.L.I.A Startup Coach · Backend

Node + Express + TypeScript + PostgreSQL + Anthropic API.

## Rodando

```bash
cp .env.example .env        # preencha DATABASE_URL, JWT_SECRET e ANTHROPIC_API_KEY
npm install
npm run db:migrate          # cria as tabelas (exige a tabela users do NEXhub)
npm run dev
```

## Endpoints (todos com `Authorization: Bearer <jwt>`)

| Método | Rota                                    | O que faz                                   |
|--------|-----------------------------------------|---------------------------------------------|
| GET    | /api/alia/me                            | Plano, mensagens restantes e temas travados |
| POST   | /api/alia/chat                          | Envia mensagem e recebe a resposta da IA    |
| GET    | /api/alia/conversations                 | Lista conversas                             |
| GET    | /api/alia/conversations/:id/messages    | Histórico de uma conversa                   |
| POST   | /api/alia/dev/plan                      | Troca de plano (só com ALLOW_DEV_PLAN_SWITCH=true) |

### POST /api/alia/chat

```json
{ "message": "Como melhorar meu modelo de negócio?", "conversationId": "uuid-opcional", "topic": "modelo" }
```

Respostas de erro relevantes para o front:

- `402 PLAN_REQUIRED` → recurso de plano superior (`requiredPlan`: plus ou pro)
- `429 DAILY_LIMIT` → acabaram as 5 mensagens do plano Gratuito

## Regras de plano (src/plans.ts)

- **Gratuito:** 5 mensagens/dia · diagnóstico e pitch
- **Plus:** ilimitado · + modelo de negócio e solução
- **Pro:** ilimitado · + mercado/concorrência e plano de 30 dias
