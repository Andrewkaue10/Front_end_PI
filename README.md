# Nexhub

O Nexhub é um protótipo acadêmico que aproxima startups, investidores e mentores para organizar a descoberta de perfis compatíveis, conexões e comunicação. O problema proposto é a dispersão desses contatos e oportunidades; a validação dessa necessidade com usuários e a disposição a pagar ainda não foram comprovadas.

## Demonstração

- [Site do protótipo](https://nexhub-alpha.vercel.app)
- [Saúde da API](https://nexhub-api.onrender.com/health)
- [Ficha técnica do protótipo — PDF de seis páginas](docs/ficha-tecnica/ficha-tecnica.pdf)
- [Diagrama de arquitetura](docs/ficha-tecnica/arquitetura.mmd)
- [Evidências dos testes](docs/ficha-tecnica/evidencias-testes.md)

Em 25/11/2026, site, saúde da API e repositório responderam HTTP 200. Essa verificação pontual não comprova todos os fluxos autenticados. O vídeo de demonstração ainda não foi produzido nesta entrega.

| Funciona no protótipo | Simulado | Não feito ou não comprovado |
| --- | --- | --- |
| Autenticação, perfis, matches por regras, conexões, mensagens e publicações implementados. | Contas, negócios e métricas fictícias do seed. | Validação de mercado, investimento financeiro efetivo e testes de carga. |
| A.L.I.A integrada ao Gemini, com consentimento, histórico e cota. | Provedor e banco simulados nos testes de rotas; caso de negócio Conecta60. | Treinamento próprio, qualidade semântica validada independentemente e garantia de sucesso. |
| Catálogo de editais, filtros, salvar, inscrição interna e preferência de alerta. | Cinco editais acadêmicos, com valores e prazos de exemplo. | Candidatura enviada ao órgão externo, coleta oficial de editais e disparo automático de alertas. |

## Stack e versões

Versões de referência declaradas nos manifests; os arquivos `package-lock.json` fixam as versões resolvidas para instalação com `npm ci`.

| Camada | Tecnologia | Justificativa e alternativa considerada |
| --- | --- | --- |
| Interface | React 19.2.8, React Router 7.18.4, Vite 8.3.0 | Reutilizar componentes e gerenciar várias telas interativas; HTML estático atenderia apenas um catálogo simples. |
| API | Node.js (verificado com 24.19.0), TypeScript 5.9.3, Express 5.2.1 | Centralizar autenticação e regras; servidores separados por módulo aumentariam a manutenção. |
| Banco | PostgreSQL no Supabase, Prisma 7.10.1 | Relacionamentos e transações; planilhas seriam uma alternativa inicial, mas não resolvem acesso concorrente e permissões do produto. |
| Segurança e validação | Zod 4.6.7, jsonwebtoken 9.0.3, bcrypt 6.0.0 | Validar no servidor e armazenar hash de senha; validação apenas no navegador é insuficiente. |
| IA | Gemini API; padrão `gemini-3.5-flash-lite`, configurável | Orientação contextualizada; respostas fixas eram repetitivas. Não houve benchmark entre provedores. |
| E-mail | Resend ou SMTP com Nodemailer 10.1.7 | Recuperação de senha; atendimento manual não oferece a mesma autonomia. |
| Hospedagem | Vercel (frontend), Render (API), Supabase (banco) | Serviços gerenciados reduzem trabalho operacional; servidor próprio exige operação adicional. |

Dependências: [frontend](Fron-pi/package.json) e [backend](nexhub-api/package.json). A versão do servidor PostgreSQL e as versões exatas dos runtimes no deploy não foram auditadas. A API usa o schema privado `nexhub`; o navegador não acessa as tabelas diretamente.

## Executar localmente

### Pré-requisitos

- Git e Node.js 24 com npm, para reproduzir o ambiente verificado.
- Banco PostgreSQL de desenvolvimento no Supabase, URI de conexão e certificado CA do projeto.
- Credenciais obtidas com o responsável pelo ambiente. Não são distribuídas no repositório.
- Chave Gemini apenas para gerar análises reais; Resend ou SMTP apenas para recuperação real de senha.

O objetivo é iniciar frontend e API em cerca de dez minutos após preparar os serviços e credenciais. A instalação completa em máquina limpa ainda não foi validada; criação do banco e obtenção das chaves não estão incluídas nessa estimativa.

### 1. Obter o projeto

```powershell
git clone --branch prod https://github.com/Andrewkaue10/Front_end_PI.git Nexhub
cd Nexhub
```

Se já possui a pasta, preserve alterações locais e consulte `git status` antes de atualizar. Os comandos de instalação devem ser executados nas duas subpastas, não apenas na raiz.

### 2. Preparar a API

```powershell
cd nexhub-api
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Preencha `.env` localmente:

1. `DATABASE_URL`: URI PostgreSQL do banco de desenvolvimento, com senha codificada para URL.
2. `DATABASE_CA_PATH`: caminho do certificado CA existente nesta máquina. Não copie o caminho de outro computador e não desative a validação TLS.
3. `JWT_SECRET`: segredo aleatório com pelo menos 32 caracteres, gerado e mantido localmente.
4. `FRONTEND_ORIGIN=http://localhost:5173` e `APP_URL=http://localhost:5173` para usar somente o ambiente local.

Depois, execute cada comando e prossiga apenas se ele terminar sem erro:

```powershell
npm run db:generate
npm run db:migrate
npm run db:check
npm run db:seed
npm run dev
```

As migrações alteram o banco configurado. O seed é opcional e cria dados demonstrativos: quatro startups, três profissionais, um administrador, cinco editais e interações de exemplo. Ele preserva registros existentes e bloqueia execução com `NODE_ENV=production`; isso não substitui conferir o banco de destino.

As credenciais fictícias ficam em `.env.demo`, ignorado pelo Git. Use o e-mail e a senha desse arquivo para a demonstração; não os publique. Se as contas já existiam, o seed não redefine suas senhas, e apagar `.env.demo` não recupera o acesso anterior.

API: `http://localhost:3333/api`. Verificação: `http://localhost:3333/health`. Se houver erro de certificado ou conexão, revise URI, senha, conectividade e caminho do CA antes de continuar.

### 3. Iniciar o frontend

Em outro terminal, a partir da raiz `Nexhub`:

```powershell
cd Fron-pi
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`. Se a porta mudar, atualize `FRONTEND_ORIGIN` e `APP_URL` na API. `VITE_API_URL` deve apontar para `http://localhost:3333/api`.

### 4. Verificar e demonstrar

Na pasta `nexhub-api`:

```powershell
npm run build
npm test
npm run test:alia
```

Na pasta `Fron-pi`:

```powershell
npm run build
```

Os testes `test:alia` usam mocks de banco e Gemini, sem consumir análises reais. Já `npm run test:integration` usa o banco configurado e cria/remove registros de teste: execute somente em banco de desenvolvimento. A avaliação `npm run evaluate:alia -- --gemini` realiza chamadas reais ao provedor e pode gerar custos; não faz parte da instalação básica.

Roteiro manual: entrar com uma startup demo, consultar e salvar um edital; entrar com um profissional e consultar matches; abrir a A.L.I.A, conferir consentimento e cota e analisar um desafio fictício. Sem chave Gemini, a geração ficará indisponível; os demais módulos podem ser utilizados. Registrar uma inscrição no Nexhub não envia documentos para uma instituição externa.

## Variáveis de ambiente

Exemplos sem segredos: [backend](nexhub-api/.env.example) e [frontend](Fron-pi/.env.example).

| Variável | Uso |
| --- | --- |
| `PORT` | Porta da API; padrão local 3333. |
| `DATABASE_URL` | Conexão privada do banco. Nunca colocar no frontend. |
| `DATABASE_CA_PATH` | Arquivo CA usado para verificar TLS. |
| `JWT_SECRET` | Assinatura dos tokens, com pelo menos 32 caracteres. |
| `FRONTEND_ORIGIN` | Origens autorizadas no CORS, separadas por vírgula. |
| `APP_URL` | Origem usada nos links de recuperação; usar a URL local em desenvolvimento. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Envio de recuperação pelo Resend, com prioridade sobre SMTP. O remetente de teste possui restrições do provedor. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Alternativa SMTP; porta padrão 587. |
| `GEMINI_API_KEY` | Necessária para novas análises da A.L.I.A; somente no backend. |
| `GEMINI_MODEL` | Modelo de geração; padrão no código `gemini-3.5-flash-lite`. |
| `ALIA_GLOBAL_DAILY_LIMIT` | Teto global de análises/tentativas registradas por dia, padrão 50. Não é um teto monetário nem conta cada retry HTTP separadamente. |
| `VITE_API_URL` | Única configuração de conexão da API no frontend; é pública. |

O limite pessoal de cinco análises/dia está no código. Falhas devolvem a cota pessoal, mas não garantem ausência de cobrança pelo provedor. Arquivos `.env`, `.env.demo` e credenciais não devem ser commitados.

## Regras ECA e arquitetura

As automações abaixo são executadas pelo backend Express, não por um agente autônomo ou trigger do banco.

| Regra | Evento | Condição | Ação | Código e teste |
| --- | --- | --- | --- | --- |
| Consentimento | `POST /api/alia/analyze` | `geminiConsent` ausente ou falso | Retornar 403 antes de reservar análise ou chamar Gemini | [alia.ts](nexhub-api/src/routes/alia.ts), [alia-routes.test.ts](nexhub-api/tests/alia-routes.test.ts): verifica 403 e nenhuma criação. |
| Cota pessoal | Nova solicitação de análise autorizada | Cinco análises não falhas no dia | Retornar 429 dentro da transação de reserva | Mesmos arquivos: cenário `used = 5`. |

Em 25/11/2026, foram aprovados sete testes de IA e nove testes unitários. São evidências de comportamento técnico com escopo limitado; não atestam qualidade semântica da LLM ou todos os fluxos em produção. [Relatório](docs/ficha-tecnica/evidencias-testes.md).

O [diagrama versionado](docs/ficha-tecnica/arquitetura.mmd) registra navegador → API → banco, Gemini e e-mail. O processamento é transacional e sob demanda via HTTP, sem IoT ou garantia de tempo real estrito. A analogia ISA-95 é com o nível 4, de gestão e planejamento; o projeto não controla processos industriais nem reivindica conformidade com a norma.

## Limites conhecidos e segurança

- O matchmaking é determinístico (`rules-v1`); sua pontuação não é probabilidade de investimento.
- Novas análises da A.L.I.A usam somente Gemini. TF-IDF em 12 orientações é contexto interno, não um segundo modo generativo. Exemplos de tema não chamam a API; cada análise é independente.
- O resultado histórico de 23/24 perguntas mede recuperação lexical em dados sintéticos de desenvolvimento, não precisão do Gemini. Falta consolidar revisão humana independente das respostas.
- Os cinco editais do seed são fictícios. Links gerais de instituições não comprovam a existência das chamadas; a inscrição é interna e a preferência de alerta ainda não dispara avisos.
- Não há movimentação financeira, garantia de parceria, testes de carga ou validação de retorno econômico.
- O pedido de exclusão pode ser registrado, mas sua execução automática e uma política completa de retenção ainda não estão comprovadas. Apagar o histórico de IA limpa o conteúdo local, mantendo registros de uso.
- Há JWT, checagens de acesso, hash bcrypt, validação Zod e TLS. Isso não equivale a auditoria de segurança ou conformidade integral com LGPD. O aviso de privacidade e os logs de erros externos precisam de revisão.
- API, banco e serviços externos podem falhar ou mudar limites. O cliente HTTP tem timeout de 15 segundos e o Gemini pode levar mais tempo com retries; essa diferença pode interromper a espera no navegador antes de concluir no servidor.
- Faltam Canvas preenchido da primeira entrega, confirmação do nicho com usuários, atribuição formal dos papéis da equipe e ensaio gravado. A reprodução completa em máquina limpa ainda está pendente.

O [aviso de uso e privacidade](Fron-pi/src/pages/Terms.jsx) orienta o uso acadêmico de dados fictícios. O envio ao Google exige consentimento e incluir o perfil exige autorização separada. Não há autorização para enviar dados confidenciais de terceiros.

## Equipe e papéis

Contribuições conhecidas nesta entrega; nomes completos, composição final e papéis do Canvas precisam ser confirmados pela equipe.

| Integrante | Contribuição identificada | Papel formal na entrega |
| --- | --- | --- |
| Andrew Kauê | Desenvolvimento, front-end, material inicial de IA e proposta de editais. | A confirmar. |
| João Gabriel | Desenvolvimento, front-end. | A confirmar. |
| José Fernando | Integração, Desenvolvimento Backend, configuração do ambiente e validação manual;  contato da equpe. | A confirmar. |
| Camilla | Preparação da documentação final, conforme organização informada pela equipe. | A confirmar. |
| Victor Henrique | Desenvolvimento Back-end, atuação direta no ideação e desenvolvimento de slides | A confirmar. |
| Dayanni Rodrigues | Ideação visual, responsável pelo desenvolvimento no Figma | A confirmar. |
| Phelipe Leandro | Documentação geral, relatórios e ideação | A confirmar. |

Não se atribuem automaticamente os papéis Tech Lead, Data & Strategy, Automation, Labor & Impact, Compliance, QA e PI Bridge sem confirmação. O histórico do Git documenta commits; não prova sozinho a distribuição de responsabilidades. Não reescrever o histórico para ocultar erros.

## Declaração de uso de IA

- **Claude:** usado por Andrew no material inicial de IA, segundo relato da equipe.
- **ChatGPT/Codex:** apoio à integração, ajustes de código, testes, documentação e inspeção técnica. Dados de teste e seed são sintéticos.
- **Gemini:** serviço de geração usado pelo produto; a equipe não treinou os pesos do modelo.
- **Referência visual:** foi fornecido um exemplo gerado no Figma para orientar o layout.

Testes manuais de cadastro, foto, recuperação por e-mail e IA. Código, fontes e testes selecionados foram conferidos com auxílio do agente; isso não representa revisão independente de cada linha por todos os integrantes. Antes da banca, a equipe deve revisar o conteúdo, explicar as decisões e validar as evidências. Não foram inventados resultados de avaliação, entrevistas ou dados de mercado para preencher lacunas.

## Organização e materiais complementares

```text
Fron-pi/                 Frontend React e package-lock.json
nexhub-api/              API, Prisma, migrações, testes e .env.example
docs/ficha-tecnica/      PDF, diagrama e evidências
docs/ia/                 Documentação e evolução da A.L.I.A
```

- [Guia de configuração Gemini](docs/ia/GEMINI.md)
- [Integração das telas com a API](Fron-pi/docs/INTEGRACAO_BACKEND.md)
- [Documentação complementar do backend](nexhub-api/README.md)
- [Auditoria do material inicial](docs/ia/AUDITORIA_ANDREW.md)
- [Licença MIT do backend](nexhub-api/LICENSE). A abrangência da licença do restante do monorepositório precisa ser formalizada.

As pastas `alia-backend/` e `files/` são referências históricas: não iniciar seus servidores nem aplicar seus SQLs no banco atual. Documentos antigos de IA podem mencionar Claude ou modo local; a descrição atual deste README e o código devem orientar a execução.

