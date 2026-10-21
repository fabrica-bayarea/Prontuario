-- Migration: índice em prontuario.aluno_id
--
-- Necessário pra issue #134 (escopo e paginação nas listagens): o perfil ATE
-- filtra por `WHERE aluno_id = $1 OR aluno_id IS NULL` em toda chamada de
-- GET /api/prontuarios — sem índice, essa listagem faz sequential scan sob
-- carga, justamente o gargalo que a issue quer eliminar.
--
-- O `init.sql` só é executado automaticamente pelo Postgres em bancos novos
-- (volume de dados vazio), então bancos já inicializados precisam rodar este
-- script manualmente:
--   psql -U <usuario> -d <banco> -f src/config/migrations/002_add_index_prontuario_aluno_id.sql
--
-- Idempotente: seguro rodar de novo (IF NOT EXISTS).

CREATE INDEX IF NOT EXISTS idx_prontuario_aluno_id ON prontuario (aluno_id);
