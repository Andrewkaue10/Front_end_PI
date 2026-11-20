-- Tabela de editais + registro de cliques no botão "Abrir edital".
-- Se você já criou uma tabela "editais" antes com outras colunas, apague-a ou use ALTER TABLE.
CREATE TABLE IF NOT EXISTS editais (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,                 -- identificador estável (evita duplicar na importação)
  titulo      TEXT NOT NULL,
  orgao       TEXT NOT NULL,
  resumo      TEXT NOT NULL,
  publico     TEXT,
  regiao      TEXT NOT NULL DEFAULT 'Nacional',
  estados     TEXT[] NOT NULL DEFAULT '{}',         -- vazio = nacional / sem restrição
  areas       TEXT[] NOT NULL DEFAULT '{}',
  valor_max   NUMERIC,
  valor_txt   TEXT,
  prazo       DATE,                                 -- NULL = fluxo contínuo
  url         TEXT NOT NULL CHECK (url ~* '^https?://'),
  link_tipo   TEXT NOT NULL DEFAULT 'agregador' CHECK (link_tipo IN ('oficial','agregador')),
  obs         TEXT,
  status      TEXT NOT NULL DEFAULT 'aprovado',     -- aprovado | pendente | rejeitado
  coletado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS editais_prazo_idx  ON editais (prazo);
CREATE INDEX IF NOT EXISTS editais_status_idx ON editais (status);

CREATE TABLE IF NOT EXISTS edital_cliques (
  id        BIGSERIAL PRIMARY KEY,
  edital_id UUID NOT NULL REFERENCES editais(id) ON DELETE CASCADE,
  user_id   UUID,                                   -- troque por FK da sua tabela de usuários, se quiser
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS edital_cliques_edital_idx ON edital_cliques (edital_id);
