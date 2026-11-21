# Atualização: A.L.I.A com Gemini

A pedido da equipe, Gemini substitui Claude como provedor generativo. A biblioteca local é apenas referência editorial, pode repetir orientações e não é usada automaticamente quando o Gemini falha. Gemini é a seleção inicial; sem chave, a geração fica desabilitada.

## Ativar no Render

1. Abra https://aistudio.google.com/api-keys e crie uma chave para um projeto seu.
2. Render → nexhub-api → Environment → Add Environment Variable.
3. Adicione `GEMINI_API_KEY` com a chave e `GEMINI_MODEL` com `gemini-3.5-flash-lite` (ou modelo compatível disponível na sua conta).
4. Mantenha `ALIA_GLOBAL_DAILY_LIMIT=10` para iniciar com teto baixo de chamadas. A assinatura Gemini/Google AI não deve ser presumida como saldo ou acesso ilimitado da API; confira o projeto no AI Studio.
5. Salve e publique. O start deve executar `npm start` para aplicar a migration `202611200003_gemini_consent`.
6. No site, abra A.L.I.A, autorize o envio **ao Google** e faça uma pergunta específica. A permissão antiga para Anthropic não é reaproveitada.

Nunca coloque a chave no frontend, em variável VITE_, no Git ou no chat. As chaves Anthropic deixam de ser usadas pelo código ativo.

## Implementação

A API chama `generateContent`, envia a pergunta, tema, perfil próprio autorizado e orientações opcionais. Solicita JSON com schema e valida novamente com Zod. Respostas bloqueadas, interrompidas, inválidas ou com erro de quota não são apresentadas como análise válida. Há timeout e limites diários. Cada análise ainda é independente, sem memória de conversa. O histórico antigo mantém a identificação de Claude.

O consentimento Google fica persistido em `AiPreference.geminiConsent`, inicialmente falso, e é verificado pelo backend antes de qualquer envio. Continua no mesmo Render e monorepositório.

## Avaliação e apresentação

`npm run test:alia --prefix nexhub-api` testa a integração com provedor simulado. Para avaliar respostas reais, configure a chave no ambiente do backend e execute `npm run evaluate:alia -- --gemini` dentro de nexhub-api. O comando realiza seis chamadas e pode consumir quota/créditos; o relatório fica em evaluation/results/gemini.json, com revisão humana pendente.

Os resultados de 23/24 da documentação anterior medem busca local, **não o Gemini**. Nenhuma chamada real pode ser validada sem a chave. Reaplique a rubrica de relevância, fundamentação, ação mensurável, honestidade e clareza. Na apresentação, mostre pergunta e resposta gerada, modelo identificado, limitações e resultados reais depois da avaliação.

Referências: [chave](https://ai.google.dev/gemini-api/docs/api-key), [cobrança e cota gratuita](https://ai.google.dev/gemini-api/docs/billing), [modelos](https://ai.google.dev/gemini-api/docs/models), [saída estruturada](https://ai.google.dev/gemini-api/docs/structured-output).
