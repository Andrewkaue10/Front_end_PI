# Auditoria do material recebido do Andrew

Revisão de todos os arquivos nas pastas `alia-backend/alia-backend` e `files`. Os originais foram preservados como referência; o código integrado e executado está em `nexhub-api` e `Fron-pi`. Não execute os SQLs antigos no banco de produção.

## O que estava bem encaminhado

Separação entre prompt, provedor, autenticação, consumo e rotas; validação Zod; consultas SQL parametrizadas; reserva atômica de uso; verificação de dono das conversas; prompts com limites contra invenção de fatos; links de editais com verificação de protocolo; cancelamento de busca com AbortController.

## Pasta A.L.I.A

| Arquivo | Avaliação e encaminhamento |
|---|---|
| README.md | Explica servidor isolado, mas a instalação pressupõe outra estrutura. Acrescentado aviso de referência; operação atual está no guia de hospedagem. |
| package.json / tsconfig.json | Projeto independente Express 4/Zod 3/SDK Anthropic; o Nexhub já usa Express 5/Zod 4. A integração reaproveita dependências existentes e fetch do Node. |
| .env.example / src/config.ts | Chave era obrigatória no arranque, impedindo funcionar sem conta. A integração torna Claude opcional e mantém a chave exclusivamente no backend. Modelo é configurável. |
| schema.sql | Espera `users`, `startups`, `subscriptions` em estrutura diferente. O banco real usa schema `nexhub` e modelos Prisma como User/Startup. Não aplicado. Novas migrations aditivas criam AiAnalysis e consentimento externo. |
| src/auth.ts | JWT genérico não verificava as mesmas restrições do Nexhub (issuer/audience/versão/conta ativa). Substituído pelo middleware já existente. |
| src/db.ts | Pool independente, sem reutilizar adapter/validação TLS existentes. Integração usa o Prisma atual. |
| src/plans.ts | Regex para tema e limites de quase dois bilhões de mensagens em planos pagos. Regex é regra, não modelo treinado; tema agora é escolha explícita. Cotas finitas e modo local gratuito de API, sem simular assinatura paga. |
| src/subscription.ts | Tabela e estados diferem de Subscription real. Rota de troca de plano de desenvolvimento poderia ser habilitada por engano. Não incorporada. Nenhum endpoint permite se promover de plano. |
| src/usage.ts | Reserva diária atômica é uma boa ideia. Integração usa registro persistente e trava curta no PostgreSQL; falha externa devolve cota pessoal e preserva limite global conservador. |
| src/prompts.ts | Bons temas e orientação de não inventar números, mas saída livre e contexto com pouca delimitação. Integração exige formato estruturado, explicita lacunas e delimita dados não confiáveis. |
| src/ai.ts | Chamada real ao Claude, sem avaliação própria e sem validação semântica da saída. Novo adaptador tem timeout, limite de saída, validação JSON/Zod, tokens e identificação do modelo. Ainda requer teste real com chave. |
| src/routes/alia.ts | CRUD de conversa e cota útil, mas dependia de tabelas/colunas inexistentes no projeto; sem consentimento externo explícito. Integração usa identidade do Nexhub, contexto do dono, histórico privado e autorização separada. |
| src/server.ts / src/errors.ts | Servidor e middleware próprios duplicavam o backend. Integração usa app e tratamento de erro existentes, sem derrubar outras funcionalidades quando Claude não está configurado. |

**Decisão de produto:** seis temas foram preservados. A versão integrada usa análises independentes e histórico, em vez de memória de conversa. Isso reduz custo, vazamento entre contextos e complexidade de avaliação; não deve ser apresentado como chat com memória. As orientações locais, TF-IDF, avaliação e tela integrada foram acrescentadas nesta implementação.

## Pasta de editais

| Arquivo | Avaliação e encaminhamento |
|---|---|
| README.md | Instruções para adaptação, não implementação já integrada. Nenhum arquivo de dados reais de editais foi fornecido. |
| 003_editais_feature.sql | Tabelas paralelas `editais` e `edital_cliques`, sem integração ao Program existente. Não aplicado; não apagar tabelas para adaptar. |
| queries.ts | Ranking por sobreposição de áreas, filtros e prazos. É heurística determinística, não IA treinada. Percentual de aderência não equivale a elegibilidade ao edital. |
| routes.ts | Fastify, enquanto o site usa Express; referência de usuário diferente e import de pool incompatível. Não montado. |
| types.ts | Contrato próprio que não coincide com os campos de Program/Startup existentes. Mantido como referência. |
| api.ts | Fetch relativo e cookies não correspondem ao Bearer e VITE_API_URL atuais. Mantido o cliente autenticado do Nexhub. A validação de endereço foi aproveitada. |
| useEditais.ts | Debounce/cancelamento úteis, mas finally de requisição antiga poderia alterar carregamento de uma nova. O módulo existente já protege atualização de estado por ciclo. |
| EditaisList.tsx | Cartões e abertura em nova aba são úteis; classes não tinham CSS incluído. A abertura HTTPS foi integrada em StartupPrograms, no layout já existente. |
| importar-editais.ts | Import de banco relativo não corresponde a esta árvore e arquivo JSON esperado não foi entregue. Não executado. Não há base real que possa ser validada/importada automaticamente. |

Foi adicionado `Program.sourceUrl` opcional, aceito no cadastro/edição administrativa com validação HTTPS. O frontend mostra “Abrir página do edital” somente quando há endereço válido. Não foram criados editais fictícios, scraper, banco paralelo nem rastreamento adicional de cliques. Os filtros e inscrições do módulo existente permanecem.

## Relação com o enunciado

A solução original não trazia avaliação, resultados, base de testes ou apresentação. Agora há documentação nos treze itens solicitados, arquitetura, origem dos dados, comparação lexical, casos reproduzíveis, limitações e roteiro. Evidência de geração real com Claude continua pendente de chave/créditos e revisão humana. O modo local tem código e avaliação executável sem API externa, mas depende de deploy/migrations para uso no site publicado.
