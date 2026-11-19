# Implementacoes da area STARTUP e do investidor

Documento consolidado das telas implementadas em 19/11/2026.

## Objetivo

A interface passou a separar as experiencias por papel sem criar dados ficticios:

- `STARTUP`: `/startup` e rotas `/startup/*`.
- perfis profissionais (`INVESTOR`, `MENTOR`, `BOTH`): `/feed` e rotas `/investidor/*`.
- experiencias compartilhadas: `/mensagens`, `/notificacoes` e `/configuracoes`.

O frontend continua usando `Fron-pi/src/lib/api.js`. O navegador nao acessa PostgreSQL
diretamente.

## Estrutura compartilhada

Foi criado o shell compartilhado:

- `Fron-pi/src/components/AreaShell/AreaShell.jsx`
- `Fron-pi/src/components/AreaShell/AreaShell.css`

Ele identifica o perfil por `/auth/me`, aplica tema coral para startup e tema azul
para perfis profissionais, valida a sessao e oferece navegacao comum.

A documentacao visual nao substitui os dados. As telas exibem estados de carregamento,
erro, vazio e sucesso apenas com respostas reais da API.

## Telas de startup

### Investidores

Rota:

- `/startup/investidores`
- `/startup/investidores/:id`

Arquivo principal:

- `Fron-pi/src/pages/StartupInvestors/StartupInvestors.jsx`

Comportamento:

- lista perfis profissionais aprovados por `GET /investors`;
- consulta recomendacoes por `GET /recommendations`;
- usa busca, papel de investidor e paginacao servidas pelo backend;
- bloqueia investimento quando a startup nao possui a necessidade `INVESTMENT`;
- impede convites duplicados com base nas conexoes retornadas;
- cria conexoes reais com finalidade `INVESTMENT`;
- abre detalhe real por `GET /investors/:id`.

### Mentores

Rota:

- `/startup/mentores`
- `/startup/mentores/:id`

Arquivo principal:

- `Fron-pi/src/pages/StartupMentors/StartupMentors.jsx`

Comportamento:

- combina perfis `MENTOR` e `BOTH` aprovados;
- aceita busca e especialidade como filtros do backend;
- exige necessidade diferente de `INVESTMENT` na startup;
- cria conexoes reais com finalidade `MENTORSHIP`;
- lista conexoes de mentoria e reunioes reais;
- nao apresenta avaliacao, preco, agenda ficticia ou videoconferencia.

### Editais e programas

Rota:

- `/startup/editais`

Arquivo principal:

- `Fron-pi/src/pages/StartupPrograms/StartupPrograms.jsx`

Foi implementado o modelo end-to-end:

- modelos Prisma `Program`, `ProgramSave`, `ProgramApplication` e `ProgramAlert`;
- migracao `nexhub-api/prisma/migrations/202611190001_programs/migration.sql`;
- validacao Zod no backend;
- catalogo, filtros, estados de prazo, salvar, inscrever e alertar;
- cadastro e alteracao administrativa de programas.

Endpoints:

| Metodo | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/programs` | Lista paginada e filtravel |
| `GET` | `/api/programs/:id` | Detalhe real |
| `GET` | `/api/my/programs` | Salvamentos, inscricoes e alertas da startup |
| `PUT` | `/api/programs/:id/save` | Salvar oportunidade |
| `DELETE` | `/api/programs/:id/save` | Remover dos salvos |
| `POST` | `/api/programs/:id/applications` | Registrar inscricao |
| `PUT` | `/api/programs/:id/alert` | Ativar alerta |
| `DELETE` | `/api/programs/:id/alert` | Desativar alerta |
| `POST` | `/api/admin/programs` | Criar programa como administrador |
| `PATCH` | `/api/admin/programs/:id` | Alterar programa como administrador |

Com banco vazio, a tela mostra um estado vazio verdadeiro.

## Experiencias compartilhadas

### Mensagens

Rota:

- `/mensagens`

Arquivo:

- `Fron-pi/src/pages/Shared/SharedMessages.jsx`

Usa exclusivamente:

- `GET /connections`;
- `GET /connections/:id/messages`;
- `POST /connections/:id/messages`;
- `GET /meetings`;
- `POST /connections/:id/meetings`.

Permite envio somente em conexao aceita e proposta de reuniao somente em conexao
aceita. Os estados exibem status reais da API. Nao existem no cliente simulacoes de
presenca, preview da ultima mensagem, mensagens nao lidas, anexos, video ou realtime.

### Notificacoes

Rota:

- `/notificacoes`

Arquivo:

- `Fron-pi/src/pages/Shared/SharedNotifications.jsx`

Usa `GET /notifications` e `PATCH /notifications/:id`. Tipos conhecidos recebem
rotulos seguros; tipo desconhecido usa texto neutro. Datas e estado de leitura sao
exibidos conforme os registros persistidos.

Nao existe marcacao global de todas como lidas nesta versao.

### Configuracoes

Rota:

- `/configuracoes`

Arquivo:

- `Fron-pi/src/pages/Shared/SharedSettings.jsx`

Carrega dados de `/auth/me` e envia somente campos permitidos por `PATCH /profile`.

Startup:

- `description`;
- `city`;
- `state`;
- `needs`;
- `website`;
- `pitchUrl`;
- `materialsPublic`.

Perfil profissional:

- `bio`;
- `city`;
- `state`;
- `stages`.

A interface avisa que salvar altera o status do perfil publico para `PENDING`.
Nome, e-mail, telefone, senha autenticada, dispositivo e preferencias nao disponiveis
na API nao sao representados como controles persistentes.

A recuperacao de senha continua disponivel pela rota existente de esqueci senha,
dependendo de SMTP configurado.

## Telas exclusivas do investidor

### Favoritos

Rota:

- `/investidor/favoritos`

Arquivo:

- `Fron-pi/src/pages/Investor/InvestorFavorites.jsx`

Usa:

- `GET /startups?favorites=true&page=&limit=&q=`;
- `PUT /favorites/:id`;
- `DELETE /favorites/:id`.

Somente startups aprovadas, ativas e nao-demo podem aparecer ou ser favoritadas.

### Portfolio

Rota:

- `/investidor/portfolio`

Arquivo:

- `Fron-pi/src/pages/Investor/InvestorPortfolio.jsx`

Permanece em estado vazio/indisponivel. O schema nao possui investimentos, aportes,
participacao societaria, documentos ou metricas financeiras. Favoritos e conexoes nao
sao apresentados como investimentos.

### Minhas qualificacoes

Rota:

- `/investidor/qualificacoes`

Arquivo:

- `Fron-pi/src/pages/Investor/InvestorQualifications.jsx`

Exibe somente campos reais do perfil:

- papel;
- tipo;
- interesses;
- estagios;
- faixa de ticket;
- especialidades;
- disponibilidade;
- bio;
- localizacao.

Campos nao aceitos por `PATCH /profile` nao sao editados nesta tela.

## Navegacao preservada

Links antigos foram encaminhados para telas reais sempre que possivel:

- `/painel` continua existindo para compatibilidade;
- mensagens apontam para `/mensagens`;
- notificacoes apontam para `/notificacoes`;
- configuracoes apontam para `/configuracoes`;
- perfil da startup aponta para `/configuracoes`;
- investidor usa `/investidor/favoritos`, `/investidor/portfolio` e
  `/investidor/qualificacoes`.

StartupShell e AreaShell mantem navegacao responsiva e os temas visualmente separados.

## Verificacoes

Comandos executados:

```powershell
cd Fron-pi
npm.cmd run build
npm.cmd run lint

cd ../nexhub-api
npm.cmd run build
npx.cmd prisma validate
npx.cmd prisma generate
npm.cmd test
```

Os builds frontend/backend passaram, o schema Prisma foi validado e os oito testes
unitarios existentes passaram. A lint retornou apenas avisos existentes ou de
efeitos React em componentes; nao houve erro de compilacao.
