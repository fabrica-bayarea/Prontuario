-- Migration: critérios de triagem configuráveis por clínica (EP-02/EP-08, issue #154)
--
-- clinica_id fica sem FK por enquanto: a tabela `clinicas` é do BE-08 (#152),
-- ainda não implementado. Assim que existir, uma migration futura adiciona
-- `REFERENCES clinicas(id)`. NULL em clinica_id = configuração global.
--
-- O `init.sql` só é executado automaticamente pelo Postgres em bancos novos
-- (volume de dados vazio), então bancos já inicializados precisam rodar este
-- script manualmente:
--   psql -U <usuario> -d <banco> -f src/config/migrations/004_add_criterios_triagem.sql
--
-- Idempotente: seguro rodar de novo (IF NOT EXISTS / ON CONFLICT DO NOTHING).

CREATE TABLE IF NOT EXISTS criterios_triagem (
    id          SERIAL PRIMARY KEY,
    clinica_id  INTEGER,                      -- NULL = configuração global (ver comentário acima)
    versao      INTEGER NOT NULL,
    pesos       JSONB NOT NULL,
    ativa       BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Não pode haver duas linhas com a mesma (clinica_id, versao).
CREATE UNIQUE INDEX IF NOT EXISTS idx_criterios_triagem_clinica_versao
  ON criterios_triagem (COALESCE(clinica_id, -1), versao);

-- No máximo uma linha ATIVA por clínica (e no máximo uma global ativa).
-- COALESCE(clinica_id, -1) trata todas as linhas globais (clinica_id NULL)
-- como um mesmo grupo pro propósito desta constraint.
CREATE UNIQUE INDEX IF NOT EXISTS idx_criterios_triagem_ativa_unica
  ON criterios_triagem (COALESCE(clinica_id, -1))
  WHERE ativa = true;

CREATE INDEX IF NOT EXISTS idx_criterios_triagem_clinica_id ON criterios_triagem (clinica_id);

-- Apenas INSERT e SELECT: mudar peso é INSERT de versão nova, nunca UPDATE
-- (regra "muda só registros novos" — versões antigas são só consultadas por
-- registros que já as usaram, via prontuario.criterios_triagem_id).
GRANT INSERT, SELECT ON TABLE criterios_triagem TO prontuario_app;
GRANT USAGE, SELECT ON SEQUENCE criterios_triagem_id_seq TO prontuario_app;

COMMENT ON TABLE criterios_triagem IS 'Versões dos pesos de triagem, globais ou por clínica (EP-02/EP-08). Mudar peso = INSERT de versão nova; nunca recalcula o passado.';

-- Seed: versão 1 global, com os pesos que BE-09 (#150) codificou como constantes.
INSERT INTO criterios_triagem (clinica_id, versao, pesos, ativa)
VALUES (
  NULL,
  1,
  '{
    "rendaBaixa": 3,
    "rendaMedia": 2,
    "vulnerabilidadeSocial": 2,
    "moradiaVulneravel": 1,
    "riscoSaude": 2,
    "limiarAlta": 4,
    "limiarMedia": 2
  }'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- O prontuário guarda qual versão de critérios classificou-o. FK (não versao
-- solta) porque versao sozinho é ambíguo entre clínicas diferentes.
ALTER TABLE prontuario ADD COLUMN IF NOT EXISTS criterios_triagem_id INTEGER REFERENCES criterios_triagem(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_prontuario_criterios_triagem_id ON prontuario (criterios_triagem_id);
