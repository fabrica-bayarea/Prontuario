import { Request, Response } from 'express';
import crypto from 'crypto';
import database from '../config/Database';
import { hashSenha } from '../helpers/senhaHelper';
import { enviarEmailBoasVindas } from '../helpers/emailHelper';
import { AuthRequest } from '../middlewares/authMiddleware';

const pool = database.getPool();

// Colunas de `prontuario` que podem ser gravadas a partir do corpo da requisição.
// Fonte: backEnd/src/config/init.sql. Excluídas de propósito: id, status, aluno_id,
// feedback_professor, created_at e updated_at — quem define esses seis é o servidor.
const COLUNAS_GRAVAVEIS: ReadonlySet<string> = new Set([
  'nome', 'email', 'cpf', 'data_nascimento', 'idade', 'cep', 'logradouro', 'bairro',
  'estado', 'cidade', 'complemento', 'estado_civil', 'genero', 'cor_raca', 'telefone',
  'clinica_atendimento', 'area_atendimento', 'class_atendimento', 'faculdade_particular',
  'bolsa_faculdade', 'atendimento_para_quem', 'acompanhamento_outro_lugar',
  'atendimento_para_outra_pessoa', 'dependentes', 'pessoas_por_casa', 'sua_casa_e',
  'outro_tipo_casa', 'valor_aluguel', 'renda_familiar', 'origem_renda',
  'outro_origem_renda', 'cad_unico', 'beneficio_social', 'outro_beneficio',
  'outro_beneficio_valor', 'quais_beneficios', 'valores_beneficios', 'sua_casa_estuda',
  'valor_mensalidade', 'residem_sua_casa', 'residencia_doenca_cronica',
  'residencia_deficiencia', 'quais_deficiencia', 'outra_deficiencia_especifique',
  'acompanhamento_medico', 'outro_acompanhamento', 'tipo_acompanhamento',
  'especialidade_medica', 'outra_especialidade', 'gastos_saude', 'valores_gastos_saude',
  'gastos_alimentacao', 'valores_gastos_alimentacao', 'possui_financiamento',
  'tipos_financiamento', 'gasto_agua', 'gasto_energia', 'gasto_internet',
  'gasto_condominio', 'como_soube_iesb', 'fonte_rede_socio', 'outro_fonte_rede_socio',
  'servico_iesb', 'antes_iesb', 'encaminhamento_medico', 'nome_outra_pessoa',
]);

// Status que cada perfil pode gravar via PATCH /:id/status.
// 'Aprovado' e 'Ajuste Necessário' ficam de fora de propósito: quem valida é o
// professor, por POST /:id/validar e POST /:id/devolver (RN-09, RBAC §3.7).
const STATUS_POR_PERFIL: Record<string, ReadonlySet<string>> = {
  ATE: new Set(['Aguardando Triagem', 'Em Análise', 'Agendado']),
};

// Helper: camelCase keys from snake_case DB rows
const toCamel = (row: any) => {
  if (!row) return row;
  const map: Record<string, string> = {
    data_nascimento: 'dataNascimento', estado_civil: 'estadoCivil', cor_raca: 'corRaca',
    clinica_atendimento: 'clinicaAtendimento', area_atendimento: 'areaAtendimento',
    class_atendimento: 'classAtendimento', faculdade_particular: 'faculdadeParticular',
    bolsa_faculdade: 'bolsaFaculdade',
    atendimento_para_quem: 'atendimentoParaQuem', nome_outra_pessoa: 'nomeOutraPessoa',
    acompanhamento_outro_lugar: 'acompanhamentoOutroLugar',
    atendimento_para_outra_pessoa: 'atendimentoParaOutraPessoa',
    pessoas_por_casa: 'pessoasPorCasa', sua_casa_e: 'suaCasaE',
    outro_tipo_casa: 'outroTipoCasa', valor_aluguel: 'valorAluguel',
    renda_familiar: 'rendaFamiliar', origem_renda: 'origemRenda',
    outro_origem_renda: 'outroOrigemRenda', cad_unico: 'CADUnico',
    beneficio_social: 'beneficioSocial', outro_beneficio: 'outroBeneficio',
    outro_beneficio_valor: 'outroBeneficioValor', quais_beneficios: 'quaisBeneficios',
    valores_beneficios: 'valoresBeneficios', sua_casa_estuda: 'suaCasaEstuda',
    valor_mensalidade: 'valorMensalidade', residem_sua_casa: 'residemSuaCasa',
    residencia_doenca_cronica: 'residenciaDoencaCronica',
    residencia_deficiencia: 'residenciaDeficiencia', quais_deficiencia: 'quaisDeficiencia',
    outra_deficiencia_especifique: 'outraDeficienciaEspecifique',
    acompanhamento_medico: 'acompanhamentoMedico', outro_acompanhamento: 'outroAcompanhamento',
    tipo_acompanhamento: 'tipoAcompanhamento', especialidade_medica: 'especialidadeMedica',
    outra_especialidade: 'outraEspecialidade',
    gastos_saude: 'gastosSaude', valores_gastos_saude: 'valoresGastosSaude',
    gastos_alimentacao: 'gastosAlimentacao', valores_gastos_alimentacao: 'valoresGastosAlimentacao',
    possui_financiamento: 'possuiFinanciamento', tipos_financiamento: 'tiposFinanciamento',
    gasto_agua: 'gastoAgua', gasto_energia: 'gastoEnergia', gasto_internet: 'gastoInternet', gasto_condominio: 'gastoCondominio',
    como_soube_iesb: 'comoSoubeIESB', fonte_rede_socio: 'fonteRedeSocio', outro_fonte_rede_socio: 'outroFonteRedeSocio',
    servico_iesb: 'servicoIESB', antes_iesb: 'antesIESB', encaminhamento_medico: 'encaminhamentoMedico',
    aluno_id: 'alunoId', feedback_professor: 'feedbackProfessor',
    created_at: 'createdAt', updated_at: 'updatedAt'
  };
  const out: any = {};
  for (const [k, v] of Object.entries(row)) {
    out[map[k] || k] = v;
  }
  out._id = out.id; // compat with frontend expecting _id
  return out;
};

// Helper: camelCase body to snake_case columns
const toSnake = (body: any) => {
  const map: Record<string, string> = {
    dataNascimento: 'data_nascimento', estadoCivil: 'estado_civil', corRaca: 'cor_raca',
    clinicaAtendimento: 'clinica_atendimento', areaAtendimento: 'area_atendimento',
    classAtendimento: 'class_atendimento', faculdadeParticular: 'faculdade_particular',
    bolsaFaculdade: 'bolsa_faculdade',
    atendimentoParaQuem: 'atendimento_para_quem',
    acompanhamentoOutroLugar: 'acompanhamento_outro_lugar',
    atendimentoParaOutraPessoa: 'atendimento_para_outra_pessoa',
    pessoasPorCasa: 'pessoas_por_casa', suaCasaE: 'sua_casa_e',
    outroTipoCasa: 'outro_tipo_casa', valorAluguel: 'valor_aluguel',
    rendaFamiliar: 'renda_familiar', origemRenda: 'origem_renda',
    outroOrigemRenda: 'outro_origem_renda', CADUnico: 'cad_unico',
    beneficioSocial: 'beneficio_social', outroBeneficio: 'outro_beneficio',
    outroBeneficioValor: 'outro_beneficio_valor', quaisBeneficios: 'quais_beneficios',
    valoresBeneficios: 'valores_beneficios', suaCasaEstuda: 'sua_casa_estuda',
    valorMensalidade: 'valor_mensalidade', residemSuaCasa: 'residem_sua_casa',
    residenciaDoencaCronica: 'residencia_doenca_cronica',
    residenciaDeficiencia: 'residencia_deficiencia', quaisDeficiencia: 'quais_deficiencia',
    outraDeficienciaEspecifique: 'outra_deficiencia_especifique',
    acompanhamentoMedico: 'acompanhamento_medico', outroAcompanhamento: 'outro_acompanhamento',
    tipoAcompanhamento: 'tipo_acompanhamento', especialidadeMedica: 'especialidade_medica',
    outraEspecialidade: 'outra_especialidade',
    gastosSaude: 'gastos_saude', valoresGastosSaude: 'valores_gastos_saude',
    gastosAlimentacao: 'gastos_alimentacao', valoresGastosAlimentacao: 'valores_gastos_alimentacao',
    possuiFinanciamento: 'possui_financiamento', tiposFinanciamento: 'tipos_financiamento',
    gastoAgua: 'gasto_agua', gastoEnergia: 'gasto_energia', gastoInternet: 'gasto_internet', gastoCondominio: 'gasto_condominio',
    comoSoubeIESB: 'como_soube_iesb', fonteRedeSocio: 'fonte_rede_socio', outroFonteRedeSocio: 'outro_fonte_rede_socio',
    servicoIESB: 'servico_iesb', antesIESB: 'antes_iesb', encaminhamentoMedico: 'encaminhamento_medico',
    nomeOutraPessoa: 'nome_outra_pessoa', createdAt: 'created_at', updatedAt: 'updated_at',
    alunoId: 'aluno_id', feedbackProfessor: 'feedback_professor', alunoNome: 'aluno_nome'
  };
  const arrayCols = new Set([
    'quais_beneficios', 'residem_sua_casa', 'residencia_doenca_cronica',
    'quais_deficiencia', 'gastos_saude', 'gastos_alimentacao',
    'tipos_financiamento', 'como_soube_iesb', 'servico_iesb', 'antes_iesb',
  ]);
  // Colunas JSONB (arrays de objetos ou objetos complexos)
  const jsonbCols = new Set(['dependentes']);
  const out: any = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === '_id' || k === 'id') continue;
    const col = map[k] ?? k;
    // Allowlist: chave que não corresponde a uma coluna gravável é descartada,
    // nunca vira nome de coluna no SQL.
    if (!COLUNAS_GRAVAVEIS.has(col)) continue;
    if (arrayCols.has(col)) {
      out[col] = Array.isArray(v) ? v : [];
    } else if (jsonbCols.has(col)) {
      out[col] = JSON.stringify(Array.isArray(v) ? v : []);
    } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      out[col] = JSON.stringify(v);
    } else {
      out[col] = v;
    }
  }
  return out;
};

export const criarProntuario = async (req: AuthRequest, res: Response) => {
  try {
    const body = { 
      ...req.body, 
      clinicaAtendimento: req.body.clinicaAtendimento || 'Clínica Escola IESB',
    };

    const data = toSnake(body);

    // Campos controlados pelo servidor — definidos após o toSnake, nunca vindos do corpo.
    data.status = 'Aguardando Validação';
    if (req.user?.sub) {
      data.aluno_id = req.user.sub;
    }

    const cols = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = vals.map((_, i) => `$${i + 1}`);

    const result = await pool.query(
      `INSERT INTO prontuario (${cols.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`,
      vals
    );

    const novoProntuario = result.rows[0];

    // Criar acesso COM (Comunidade) automaticamente, se não existir
    if (data.email && data.cpf && data.nome) {
      const checkUser = await pool.query(
        'SELECT id FROM usuarios WHERE matricula = $1 OR email = $2',
        [data.cpf, data.email]
      );

      if (checkUser.rows.length === 0) {
        const senhaProvisoria = crypto.randomBytes(9).toString('base64url');
        const senhaHash = await hashSenha(senhaProvisoria);
        
        await pool.query(
          `INSERT INTO usuarios (matricula, email, senha_hash, nome, perfil, primeiro_acesso)
           VALUES ($1, $2, $3, $4, $5, true)`,
          [data.cpf, data.email, senhaHash, data.nome, 'COM']
        );

        // Envia o e-mail de boas-vindas com a senha provisória
        await enviarEmailBoasVindas(data.email, data.nome, senhaProvisoria, data.cpf);
      }
    }

    res.status(201).json(toCamel(novoProntuario));
  } catch (error: any) {
    console.error('Erro ao criar prontuário:', error);
    let msg = error.message;
    if (error.code === '23505') {
      if (error.constraint === 'prontuario_cpf_key') {
        msg = 'Este CPF já possui um acolhimento registrado.';
      } else if (error.constraint === 'usuarios_email_key') {
        msg = 'Este e-mail já está cadastrado por outro usuário.';
      } else if (error.constraint === 'usuarios_matricula_key') {
        msg = 'Esta matrícula/CPF já está cadastrada por outro usuário.';
      } else {
        msg = 'Cadastro duplicado: um registro com estes dados já existe.';
      }
    }
    res.status(400).json({ error: msg });
  }
};

export const listarProntuario = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.perfil === 'ATE') {
      const result = await pool.query(`
        SELECT p.*, u.nome AS aluno_nome
        FROM prontuario p
        LEFT JOIN usuarios u ON p.aluno_id = u.id
        WHERE (p.aluno_id = $1 OR p.aluno_id IS NULL)
        ORDER BY p.id DESC
      `, [req.user.sub]);
      return res.status(200).json(result.rows.map(toCamel));
    }

    // COO e PRO ganham escopo por clínica na Sprint 2, após a tabela usuarios receber essa coluna.
    const result = await pool.query(`
      SELECT p.*, u.nome AS aluno_nome
      FROM prontuario p 
      LEFT JOIN usuarios u ON p.aluno_id = u.id 
      ORDER BY p.id DESC
    `);
    res.status(200).json(result.rows.map(toCamel));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listarPorIdProntuario = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nome AS aluno_nome
      FROM prontuario p
      LEFT JOIN usuarios u ON p.aluno_id = u.id
      WHERE p.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Nao encontrado' });

    const prontuario = result.rows[0];
    const perfil = req.user?.perfil;

    // RBAC §4 — escopo de visibilidade.
    // COM: apenas o próprio registro (usuário COM é criado com matricula = cpf).
    if (perfil === 'COM' && prontuario.cpf !== req.user?.matricula) {
      return res.status(404).json({ message: 'Nao encontrado' });
    }

    // ATE: prontuários próprios e registros legados sem aluno responsável.
    if (
      perfil === 'ATE' &&
      prontuario.aluno_id !== null &&
      Number(prontuario.aluno_id) !== Number(req.user?.sub)
    ) {
      return res.status(404).json({ message: 'Nao encontrado' });
    }

    // COO e PRO: leitura ampla nesta sprint. A tabela `usuarios` não tem coluna de
    // clínica, então o escopo por clínica (RBAC §4) depende de migration e entra na
    // Sprint 2. Não improvise filtro por nome de clínica.
    res.json(toCamel(prontuario));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listarMeuProntuario = async (req: any, res: Response) => {
  try {
    const matricula = req.user?.matricula;
    if (!matricula) {
      return res.status(400).json({ message: 'Matrícula não encontrada no token.' });
    }
    const result = await pool.query('SELECT * FROM prontuario WHERE cpf = $1', [matricula]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Prontuário não encontrado para este usuário.' });
    res.json(toCamel(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const alterarStatusProntuario = async (req: AuthRequest, res: Response) => {
  try {
    const perfil = req.user?.perfil ?? '';
    const statusPermitidos = STATUS_POR_PERFIL[perfil];

    // Perfil sem entrada no mapa não altera status por esta rota.
    if (!statusPermitidos) {
      return res.status(403).json({
        error: { code: 'AUTH_060', message: 'Você não tem permissão para acessar este recurso.' },
      });
    }

    const { status } = req.body;

    if (typeof status !== 'string' || !statusPermitidos.has(status)) {
      return res.status(400).json({
        error: { code: 'PRONT_003', message: 'Status inválido.' },
      });
    }

    if (req.user?.perfil === 'ATE') {
      const acesso = await pool.query(
        'SELECT id FROM prontuario WHERE id = $1 AND (aluno_id = $2 OR aluno_id IS NULL)',
        [req.params.id, req.user.sub]
      );

      if (acesso.rows.length === 0) {
        return res.status(404).json({ message: 'Nao encontrado' });
      }
    }

    const result = await pool.query(
      'UPDATE prontuario SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Nao encontrado' });
    res.json(toCamel(result.rows[0]));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const atualizarProntuarioPorId = async (req: Request, res: Response) => {
  try {
    const data = toSnake(req.body);
    const cols = Object.keys(data);

    if (cols.length === 0) {
      return res.status(400).json({
        error: { code: 'PRONT_002', message: 'Nenhum campo válido para atualização.' },
      });
    }

    const vals = Object.values(data);
    const sets = cols.map((c, i) => `${c} = $${i + 1}`);
    vals.push(req.params.id);
    const result = await pool.query(
      `UPDATE prontuario SET ${sets.join(',')}, updated_at = NOW() WHERE id = $${vals.length} RETURNING *`,
      vals
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Nao encontrado' });
    res.json(toCamel(result.rows[0]));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const validarProntuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    
    const result = await pool.query(
      `UPDATE prontuario SET status = $1, feedback_professor = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      ['Aprovado', feedback || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Prontuário não encontrado.' });
    res.json(toCamel(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const devolverProntuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const result = await pool.query(
      `UPDATE prontuario SET status = $1, feedback_professor = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      ['Ajuste Necessário', feedback || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Prontuário não encontrado.' });
    res.json(toCamel(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
