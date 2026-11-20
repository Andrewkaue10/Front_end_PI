# A.L.I.A — execução, publicação e operação

## Mesmo repositório e mesmo Render

Sim. A A.L.I.A foi integrada em `nexhub-api`, por isso não é necessário criar outro repositório, banco ou serviço Render. O frontend continua em `Fron-pi` na Vercel. O código recebido em `alia-backend` e `files` fica como referência, fora do processo de build. O suporte a diretórios em monorepos é documentado pelo [Render](https://render.com/docs/monorepo-support).

No modo local, o algoritmo executa no Render. No modo Claude, o backend chama a Anthropic; os pesos do Claude ficam com o provedor. “Local” não significa que o site funcione sem internet: ainda precisa alcançar a API e o PostgreSQL.

## Deploy

No serviço **nexhub-api**, confirme:

- Repositório: `Andrewkaue10/Front_end_PI`.
- Branch: `prod`.
- Root Directory: `nexhub-api`.
- Build Command: `npm ci --include=dev && npm run db:generate && npm run build`.
- Start Command: `npm start` (o script executa `prisma migrate deploy` e inicia o servidor).

As novas migrations criam `nexhub.AiAnalysis`, acrescentam consentimento externo em AiPreference e sourceUrl em Program. São aditivas; não recriam usuários ou startups. Não rode seed no banco de produção. Use as credenciais de banco já configuradas e mantenha TLS.

Na Vercel, mantenha Root Directory `Fron-pi`, build `npm run build`, output `dist` e `VITE_API_URL=https://nexhub-api.onrender.com/api`. A rota `/alia` usa o fallback SPA já configurado no repositório.

Aguarde **Deploy succeeded** no Render e a publicação da mesma revisão na Vercel. Um frontend novo com backend antigo retorna “Rota não encontrada”; sem migration, o backend pode falhar no acesso à nova tabela. Confira os logs, sem copiar segredos para o chat.

## Modo local: nenhuma chave nova

Depois de aplicar a migration e publicar os dois lados, entre no [Nexhub](https://nexhub-alpha.vercel.app/alia), selecione Local, escolha um tema e faça a análise. Acesso requer login. O histórico é privado e não aparece em perfis públicos.

## Claude: opcional, habilitar quando houver chave

1. Crie uma conta na plataforma da Anthropic e configure faturamento/créditos e limite de gastos. A assinatura do chat e a API têm cobrança separada: [explicação oficial](https://support.claude.com/en/articles/9876003-why-is-claude-api-usage-billed-separately-from-my-paid-claude-plan).
2. Gere uma API key na plataforma. Não a envie pelo chat, não a coloque no Git e não use prefixo `VITE_`.
3. No **Render → nexhub-api → Environment**, adicione:

| Variável | Valor |
|---|---|
| ANTHROPIC_API_KEY | A chave secreta gerada na sua conta |
| ANTHROPIC_MODEL | `claude-sonnet-5-5` ou outro identificador de Messages API disponível na conta e validado pela equipe |
| ALIA_GLOBAL_DAILY_LIMIT | `10` para começar com um teto baixo; padrão do código é 50 |

4. Salve e aguarde novo deploy. Na tela A.L.I.A, Claude ficará selecionável quando houver chave configurada. Isso não comprova que a chave tenha saldo ou acesso ao modelo: faça uma consulta curta para verificar.
5. Autorize explicitamente o envio à Anthropic. A permissão de perfil é separada; só inclua informações não confidenciais.
6. Execute a avaliação generativa opcional descrita na documentação e preencha a revisão humana antes de apresentar resultados do Claude.

Não houve chamada paga nem compra de créditos nesta implementação. Não existe troca automática de provedor ou repetição automática de chamada em caso de erro. A cota global conta tentativas, e a pessoal devolve falhas. São limites de chamadas, não garantia de custo monetário fixo; configure também o orçamento no provedor.

## Desenvolvimento

Use um banco de desenvolvimento e as variáveis existentes em `nexhub-api/.env.example`. O README principal contém a configuração de banco/JWT. Depois:

```powershell
npm ci --prefix nexhub-api
npm run db:generate --prefix nexhub-api
npm run db:migrate --prefix nexhub-api
npm run dev --prefix nexhub-api
```

Em outro terminal:

```powershell
npm ci --prefix Fron-pi
npm run dev --prefix Fron-pi
```

Para verificar sem chamar Anthropic nem usar dados reais:

```powershell
npm run test:alia --prefix nexhub-api
npm run evaluate:alia --prefix nexhub-api
npm run build --prefix nexhub-api
npm run build --prefix Fron-pi
```

## Teste após publicação

- Entre com uma conta de teste, abra `/alia` e use um exemplo local.
- Confirme ações e fontes visíveis; recarregue e abra o histórico.
- Em outra conta, confirme que o histórico anterior não aparece.
- Apague o histórico e confirme que as perguntas/respostas sumiram.
- Com conta startup, autorize perfil e repita; sem autorização, a opção fica desabilitada e a API recusa envio forçado.
- Sem chave, Claude deve ficar indisponível e Local deve continuar funcionando.

Os testes automatizados de rotas usam banco simulado. Esse roteiro é a verificação integrada com banco/deploy real, que deve ser concluída em uma conta autenticada após publicação.

## Links

- [Site / A.L.I.A](https://nexhub-alpha.vercel.app/alia)
- [Saúde da API](https://nexhub-api.onrender.com/health)
- [Repositório prod](https://github.com/Andrewkaue10/Front_end_PI/tree/prod)
- [Dashboard Render](https://dashboard.render.com/)
- [Dashboard Vercel](https://vercel.com/dashboard)
- [Modelos e identificadores Anthropic](https://platform.claude.com/docs/en/models/overview)
