# Nexhub

Repositório com o frontend React/Vite e a API Express/TypeScript da Nexhub.

## Estrutura

```text
Fron-pi/       Frontend React
nexhub-api/    API Express, Prisma e migrações PostgreSQL
```

O frontend chama a API HTTP. O backend usa Prisma para acessar o schema privado `nexhub` no Supabase; as tabelas não são acessadas diretamente pelo navegador.

## Executar localmente

### 1. Configurar a API

No PowerShell, abra um terminal na pasta do repositório:

```powershell
cd nexhub-api
npm ci
Copy-Item .env.example .env
```

Edite `nexhub-api/.env` localmente. Preencha `DATABASE_URL`, `DATABASE_CA_PATH` e `JWT_SECRET`; configure SMTP apenas se quiser habilitar a recuperação real por e-mail. Não envie `.env` ao Git.

Com o banco de desenvolvimento configurado, gere o Prisma Client, aplique a migration incluída e inicie a API:

```powershell
npm run db:generate
npm run db:migrate
npm run dev
```

A API fica em `http://localhost:3333/api`; a verificação de saúde fica em `http://localhost:3333/health`.

### 2. Iniciar o frontend

Em outro terminal, na raiz do repositório:

```powershell
cd Fron-pi
npm ci
Copy-Item .env.example .env
npm run dev
```

O frontend usa `VITE_API_URL=http://localhost:3333/api` por padrão. Ajuste `Fron-pi/.env` se a API estiver em outro endereço. A origem do frontend deve estar incluída em `FRONTEND_ORIGIN` no backend para as chamadas via navegador.

## Segurança e dados

- Credenciais de banco, certificado TLS e `JWT_SECRET` ficam somente no backend.
- O backend e o frontend têm arquivos `.env.example` sem credenciais reais. Os arquivos `.env` são locais e ignorados pelo Git.
- Use uma base de desenvolvimento para migrations, seed e testes de integração. O seed cria dados fictícios.
- O guia detalhado da comunicação entre telas e endpoints está em [Fron-pi/docs/INTEGRACAO_BACKEND.md](Fron-pi/docs/INTEGRACAO_BACKEND.md); a documentação da API está em [nexhub-api/README.md](nexhub-api/README.md).

## Autores

Andrew Kauê e João Gabriel.
