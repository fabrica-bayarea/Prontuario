-- Migration: adiciona ACESSO_NEGADO e LOGIN_BLOQUEADO ao CHECK de logs_acesso.tipo
--
-- Necessária para o hardening do login: o rbacMiddleware passou a registrar
-- ACESSO_NEGADO a cada 403, e o bloqueio de login por IP passou a registrar
-- LOGIN_BLOQUEADO. Sem esta migration, o CHECK constraint original rejeita
-- esses INSERTs em qualquer banco criado antes desta mudança.
--
-- O `init.sql` só é executado automaticamente pelo Postgres em bancos novos
-- (volume de dados vazio), então bancos já inicializados precisam rodar este
-- script manualmente:
--   psql -U <usuario> -d <banco> -f src/config/migrations/001_add_acesso_negado_login_bloqueado.sql

ALTER TABLE logs_acesso DROP CONSTRAINT IF EXISTS logs_acesso_tipo_check;

ALTER TABLE logs_acesso ADD CONSTRAINT logs_acesso_tipo_check CHECK (tipo IN (
    'LOGIN_SUCESSO',
    'LOGIN_FALHA',
    'LOGOUT',
    'TOKEN_EXPIRADO',
    'SENHA_RECUPERADA',
    'SENHA_REDEFINIDA',
    'PRIMEIRO_ACESSO',
    'CONTA_BLOQUEADA',
    'CONTA_DESBLOQUEADA',
    'ACESSO_NEGADO',
    'LOGIN_BLOQUEADO'
));
