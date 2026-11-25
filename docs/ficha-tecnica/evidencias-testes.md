# Evidencias da ficha tecnica - 25/11/2026

Codigo inspecionado: 3f3ac7fd2bf0fdf514db435ea3c2abae92175431 (prod).

Executados em nexhub-api:
- npm run test:alia: 7 testes, 7 aprovados, 0 falhas.
- npm test: 9 testes, 9 aprovados, 0 falhas.

Regras exercitadas em tests/alia-routes.test.ts:
- Sem geminiConsent: POST /alia/analyze retorna 403, created=0.
- Com used=5: POST /alia/analyze retorna 429.
- Consentimento, perfil proprio e provedor simulado valido: 201 e SUCCEEDED.
- Provedor simulado HTTP 503: retorna 502 e registra FAILED.

API externa e banco substituidos por mocks; nao houve chamada ao Gemini real nem mutacao no banco de producao durante esses testes. Saidas de erro 503/429 sao cenarios deliberados, nao falhas da suite.
Os testes unitarios exercitam matchmaking deterministico, validacao de cadastro, senha, URL e perfil.
Nao comprovam usabilidade, escalabilidade, qualidade semantica da LLM ou todos os fluxos em producao.

Diagrama: arquitetura.mmd. Fluxo transacional sob demanda; sem IoT, sem streaming de eventos ou treinamento proprio.
