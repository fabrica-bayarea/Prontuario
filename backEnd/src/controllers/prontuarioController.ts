import { Request, Response } from 'express';
import crypto from 'crypto';
import database from '../config/Database';
import { hashSenha } from '../helpers/senhaHelper';
import { enviarEmailBoasVindas } from '../helpers/emailHelper';

const pool = database.getPool();

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
    const col = map[k] || k;
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

export const criarProntuario = async (req: any, res: Response) => {
  try {
    const body = { 
      ...req.body, 
      status: 'Aguardando Validação',
    };
    if (req.user?.sub) {
      body.alunoId = req.user.sub;
    }

    const data = toSnake(body);
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
    res.status(400).json({ error: error.message });
  }
};

export const listarProntuario = async (req: Request, res: Response) => {
  try {
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

export const listarPorIdProntuario = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.nome AS aluno_nome
      FROM prontuario p 
      LEFT JOIN usuarios u ON p.aluno_id = u.id 
      WHERE p.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Nao encontrado' });
    res.json(toCamel(result.rows[0]));
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

export const atualizarProntuarioPorId = async (req: Request, res: Response) => {
  try {
    const data = toSnake(req.body);
    const cols = Object.keys(data);
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

export const deletarProntuarioPorId = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('DELETE FROM prontuario WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Nao encontrado' });
    res.json({ message: 'Prontuario deletado', id: result.rows[0].id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
