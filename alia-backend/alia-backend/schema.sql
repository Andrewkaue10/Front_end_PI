-- A.L.I.A Startup Coach · PostgreSQL
-- Pré-requisito: já existir a tabela "users" (id uuid) do NEXhub.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE plan_type AS ENUM ('free', 'plus', 'pro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE msg_role AS ENUM ('user', 'assistant');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS startups (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name           text NOT NULL,
  sector         text,
  stage          text,            -- ideia, MVP, tração, escala
  description    text,
  business_model text,
  solution       text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_startups_owner ON startups(owner_id);

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id            uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  plan               plan_type NOT NULL DEFAULT 'free',
  status             text NOT NULL DEFAULT 'active',   -- active, canceled, past_due
  current_period_end timestamptz,
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  startup_id uuid REFERENCES startups(id) ON DELETE SET NULL,
  title      text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id              bigserial PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            msg_role NOT NULL,
  topic           text,
  content         text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id, id);

CREATE TABLE IF NOT EXISTS usage_daily (
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day            date NOT NULL,
  messages_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
