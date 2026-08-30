CREATE TABLE IF NOT EXISTS usuarios (
    id                SERIAL PRIMARY KEY,
    matricula         VARCHAR(50)  NOT NULL UNIQUE,
    email             VARCHAR(255) NOT NULL UNIQUE,
    senha_hash        VARCHAR(255) NOT NULL,
    nome              VARCHAR(255) NOT NULL,
    perfil            VARCHAR(10)  NOT NULL CHECK (perfil IN ('ADM','COO','PRO','ATE','COM')),
    ativo             BOOLEAN      DEFAULT true,
    primeiro_acesso   BOOLEAN      DEFAULT true,
    tentativas_login  INTEGER      DEFAULT 0,
    bloqueado_ate     TIMESTAMPTZ  DEFAULT NULL,
    created_at        TIMESTAMPTZ  DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_matricula ON usuarios (matricula);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);

-- Seed: usuário admin (senha) — hash gerado com bcryptjs cost 12
INSERT INTO usuarios (matricula, email, senha_hash, nome, perfil, primeiro_acesso)
VALUES (
  'admin',
  'admin@iesb.edu.br',
  '$2b$12$sHe0eBc5wDaxn3OqlWkH1.9jWv3zmC8Mq6jM7lhjn/08OTs6OkaFy',
  'Administrador',
  'ADM',
  true
)
ON CONFLICT (matricula) DO NOTHING;

COMMENT ON TABLE usuarios IS 'Tabela de usuários para autenticação e controle de acesso';

-- ============================================================
-- Tabela de Recuperação de Senha
-- ============================================================
CREATE TABLE IF NOT EXISTS tokens_recuperacao (
    id          SERIAL PRIMARY KEY,
    usuario_id  INTEGER      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token       VARCHAR(64)  NOT NULL UNIQUE,
    expira_em   TIMESTAMPTZ  NOT NULL,
    usado       BOOLEAN      DEFAULT false,
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tokens_recuperacao_token ON tokens_recuperacao (token);
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacao_usuario_id ON tokens_recuperacao (usuario_id);

GRANT ALL PRIVILEGES ON TABLE tokens_recuperacao TO prontuario_app;
GRANT USAGE, SELECT ON SEQUENCE tokens_recuperacao_id_seq TO prontuario_app;

-- ============================================================
-- Tabela de Logs de Acesso
-- ============================================================
CREATE TABLE IF NOT EXISTS logs_acesso (
    id          SERIAL PRIMARY KEY,
    usuario_id  INTEGER      REFERENCES usuarios(id) ON DELETE SET NULL,
    tipo        VARCHAR(30)  NOT NULL CHECK (tipo IN (
                    'LOGIN_SUCESSO',
                    'LOGIN_FALHA',
                    'LOGOUT',
                    'TOKEN_EXPIRADO',
                    'SENHA_RECUPERADA',
                    'SENHA_REDEFINIDA',
                    'PRIMEIRO_ACESSO',
                    'CONTA_BLOQUEADA',
                    'CONTA_DESBLOQUEADA'
                )),
    ip          VARCHAR(45),
    user_agent  TEXT,
    detalhes    JSONB        DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_acesso_usuario_id ON logs_acesso (usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_acesso_tipo ON logs_acesso (tipo);
CREATE INDEX IF NOT EXISTS idx_logs_acesso_created_at ON logs_acesso (created_at DESC);

-- Apenas INSERT e SELECT (tabela imutável — LGPD)
GRANT INSERT, SELECT ON TABLE logs_acesso TO prontuario_app;
GRANT USAGE, SELECT ON SEQUENCE logs_acesso_id_seq TO prontuario_app;
-- ============================================================
-- Tabela principal: prontuario
-- ============================================================
CREATE TABLE IF NOT EXISTS prontuario (
    -- Chave primária
    id              SERIAL PRIMARY KEY,

    -- ========================================================
    -- ETAPA 1 — Dados do Solicitante
    -- ========================================================
    nome                        VARCHAR(255) NOT NULL,
    email                       VARCHAR(255) NOT NULL,
    cpf                         VARCHAR(14) NOT NULL UNIQUE,   -- formato: 000.000.000-00
    data_nascimento             VARCHAR(10) NOT NULL,          -- formato: YYYY-MM-DD (string do input date)
    idade                       INTEGER NOT NULL DEFAULT 0,
    cep                         VARCHAR(9) NOT NULL,           -- formato: 00000-000
    logradouro                  VARCHAR(255),
    bairro                      VARCHAR(255),
    estado                      VARCHAR(2) NOT NULL,
    cidade                      VARCHAR(255) NOT NULL,
    complemento                 VARCHAR(255) DEFAULT 'Sem complemento',
    estado_civil                VARCHAR(50) NOT NULL,          -- solteiro, casado, divorciado(a), etc.
    genero                      VARCHAR(50) NOT NULL,          -- feminino, masculino, não-binário, etc.
    cor_raca                    VARCHAR(50) NOT NULL,          -- preta, amarela, parda, etc.
    telefone                    VARCHAR(20) NOT NULL,          -- formato: (00) 00000-0000
    clinica_atendimento         VARCHAR(100) NOT NULL,         -- Clínica Escola Ceilândia / Asa Sul
    area_atendimento            VARCHAR(100),                  -- Psicologia, Nutrição, etc.
    class_atendimento           VARCHAR(255) NOT NULL,         -- classificação de urgência
    faculdade_particular        VARCHAR(10),                   -- sim / não
    bolsa_faculdade             VARCHAR(100),                  -- ProUni, FIES, etc.
    atendimento_para_quem       VARCHAR(50) NOT NULL,          -- Você / Outra pessoa
    acompanhamento_outro_lugar  VARCHAR(255) NOT NULL,         -- Não / Sim, no CAPS / etc.
    atendimento_para_outra_pessoa VARCHAR(255),                -- campo legado

    -- ========================================================
    -- ETAPA 2 — Dependentes (armazenados como JSONB)
    -- ========================================================
    -- Array de objetos: [{ "nome": "...", "relacao": "..." }]
    dependentes                 JSONB DEFAULT '[]'::jsonb,

    -- ========================================================
    -- ETAPA 3 — Situação Socioeconômica
    -- ========================================================
    pessoas_por_casa            INTEGER NOT NULL DEFAULT 1,
    sua_casa_e                  VARCHAR(50) NOT NULL,          -- Quitada, Financiada, Cedida, Alugada, Outro
    outro_tipo_casa             VARCHAR(255),                  -- se sua_casa_e = 'Outro'
    valor_aluguel               VARCHAR(50),                   -- formato moeda: R$ X.XXX,XX
    renda_familiar              VARCHAR(50) NOT NULL,          -- Nenhuma, MeioUm, DeUmAteTres, etc.
    origem_renda                VARCHAR(50) NOT NULL,          -- SeguroDesemprego, Empregaticio, etc.
    outro_origem_renda          VARCHAR(255),                  -- se origem_renda = 'Outro'
    cad_unico                   VARCHAR(50),                   -- número CADÚnico

    -- Benefícios sociais
    beneficio_social            VARCHAR(10),                   -- Sim / Nao
    outro_beneficio             VARCHAR(255),                  -- nome de outro benefício
    outro_beneficio_valor       VARCHAR(50),                   -- valor do outro benefício
    quais_beneficios            TEXT[] DEFAULT '{}',            -- array: bolsaFamilia, pratoCheio, etc.
    valores_beneficios          JSONB DEFAULT '{}'::jsonb,     -- { "bolsaFamilia": "R$ 600,00", ... }

    -- Educação na residência
    sua_casa_estuda             VARCHAR(10) NOT NULL,          -- Sim / Nao
    valor_mensalidade           VARCHAR(50),                   -- formato moeda

    -- Pessoas na residência
    residem_sua_casa            TEXT[] NOT NULL DEFAULT '{}',   -- array: gestante, idoso, pcd, naoTem

    -- Doenças crônicas
    residencia_doenca_cronica   TEXT[] NOT NULL DEFAULT '{}',   -- array: nenhumaDoenca, cancer, etc.

    -- Deficiências
    residencia_deficiencia          VARCHAR(10) NOT NULL,      -- Sim / Nao
    quais_deficiencia               TEXT[] DEFAULT '{}',        -- array: def_fisica, def_visual, etc.
    outra_deficiencia_especifique   VARCHAR(255),              -- se def_outra selecionado

    -- Acompanhamento médico
    acompanhamento_medico       VARCHAR(20),                   -- Nao / Sim / Outro
    outro_acompanhamento        VARCHAR(255),                  -- se acompanhamento_medico = 'Outro'
    tipo_acompanhamento         VARCHAR(20),                   -- Publico / Particular
    especialidade_medica        VARCHAR(100),                  -- Cardiologia, Psicologia, etc.
    outra_especialidade         VARCHAR(255),                  -- se especialidade = 'Outra'

    -- Gastos com saúde
    gastos_saude                TEXT[] DEFAULT '{}',            -- array: consultas, medicacao, etc.
    valores_gastos_saude        JSONB DEFAULT '{}'::jsonb,     -- { "consultas": "R$ 200,00", ... }

    -- Gastos com alimentação
    gastos_alimentacao          TEXT[] DEFAULT '{}',            -- array: alimentacaoDinheiro, etc.
    valores_gastos_alimentacao  JSONB DEFAULT '{}'::jsonb,     -- { "alimentacaoDinheiro": "R$ 500,00" }

    -- Financiamento
    possui_financiamento        VARCHAR(10),                   -- Sim / Não
    tipos_financiamento         TEXT[] DEFAULT '{}',            -- array de tipos

    -- Despesas fixas (formato moeda string)
    gasto_agua                  VARCHAR(50),
    gasto_energia               VARCHAR(50),
    gasto_internet              VARCHAR(50),
    gasto_condominio            VARCHAR(50),

    -- ========================================================
    -- ETAPA 4 — Serviços IESB e Encaminhamento
    -- ========================================================
    como_soube_iesb             TEXT[] DEFAULT '{}',            -- array de fontes
    fonte_rede_socio            VARCHAR(255),                  -- rede sócio-assistencial
    outro_fonte_rede_socio      VARCHAR(255),                  -- se fonte = 'Outro'
    servico_iesb                TEXT[] DEFAULT '{}',            -- array: servico_direito, servico_psicologia, etc.
    antes_iesb                  TEXT[] DEFAULT '{}',            -- array: antes_nao, antes_caps, etc.
    encaminhamento_medico       VARCHAR(10) NOT NULL,          -- Sim / Não
    status                      VARCHAR(50) DEFAULT 'Aguardando Validação', -- Status da triagem

    -- ========================================================
    -- Validação do Professor
    -- ========================================================
    aluno_id                    INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    feedback_professor          TEXT,

    -- ========================================================
    -- Campos legados (existem no controller mas não no frontend atual)
    -- ========================================================
    nome_outra_pessoa           VARCHAR(255),

    -- ========================================================
    -- Timestamps
    -- ========================================================
    created_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Índices para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_prontuario_cpf ON prontuario (cpf);
CREATE INDEX IF NOT EXISTS idx_prontuario_nome ON prontuario (nome);
CREATE INDEX IF NOT EXISTS idx_prontuario_created_at ON prontuario (created_at DESC);

-- ============================================================
-- Conceder permissões ao usuário da aplicação
-- ============================================================
GRANT ALL PRIVILEGES ON TABLE prontuario TO prontuario_app;
GRANT USAGE, SELECT ON SEQUENCE prontuario_id_seq TO prontuario_app;

-- ============================================================
-- Comentários na tabela (documentação)
-- ============================================================
COMMENT ON TABLE prontuario IS 'Tabela principal de prontuários socioeconômicos dos pacientes';
COMMENT ON COLUMN prontuario.quais_beneficios IS 'Array de IDs dos benefícios: bolsaFamilia, pratoCheio, materialEscolar, valeGasBPC, dfSocial, cartaoCreche, habitacaoSocial, tarifaEletrica, tarifaAguaEsgoto';
COMMENT ON COLUMN prontuario.residem_sua_casa IS 'Array de categorias: gestante, idoso, pcd, naoTem';
COMMENT ON COLUMN prontuario.residencia_doenca_cronica IS 'Array: nenhumaDoenca, cancer, hipertensao, doencaRenal, asma, diabetes, hiv';
COMMENT ON COLUMN prontuario.quais_deficiencia IS 'Array: def_fisica, def_visual, def_auditiva, def_intelectual, def_autismo, def_esquizofrenia, def_depressao_grave, def_outra';
COMMENT ON COLUMN prontuario.servico_iesb IS 'Array de serviços IESB: servico_direito, servico_nutricao, servico_psicologia, servico_odontologia, servico_saude, servico_pedagogia, servico_social, servico_sistemas, servico_naf';
COMMENT ON COLUMN prontuario.antes_iesb IS 'Array: antes_nao, antes_caps, antes_hospital, antes_particular, antes_ong, antes_outro';
COMMENT ON COLUMN prontuario.dependentes IS 'Array JSON de dependentes: [{"nome": "...", "relacao": "Filho(a)|Cônjuge|Parente|Outro"}]';
