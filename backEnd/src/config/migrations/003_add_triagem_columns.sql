-- Migration: colunas de triagem calculada pelo servidor (EP-02, issue #150)
--
-- prioridade_triagem / pontuacao_triagem / criterios_triagem / triagem_calculada_em
-- ficam FORA da allowlist de gravação de prontuarioRepository.ts — só o servidor
-- grava (em criarProntuario, antes do INSERT). Nem ATE nem ADM escrevem por PUT.
--
-- O `init.sql` só é executado automaticamente pelo Postgres em bancos novos
-- (volume de dados vazio), então bancos já inicializados precisam rodar este
-- script manualmente:
--   psql -U <usuario> -d <banco> -f src/config/migrations/003_add_triagem_columns.sql
--
-- Idempotente: seguro rodar de novo (IF NOT EXISTS).

ALTER TABLE prontuario ADD COLUMN IF NOT EXISTS prioridade_triagem   VARCHAR(10);
ALTER TABLE prontuario ADD COLUMN IF NOT EXISTS pontuacao_triagem    INTEGER;
ALTER TABLE prontuario ADD COLUMN IF NOT EXISTS criterios_triagem    JSONB;
ALTER TABLE prontuario ADD COLUMN IF NOT EXISTS triagem_calculada_em TIMESTAMPTZ;
