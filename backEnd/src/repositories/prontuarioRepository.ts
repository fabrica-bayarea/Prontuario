import database from '../config/Database';

const pool = database.getPool();

// ============================================================
// Mapeamento linha <-> objeto (snake_case no banco, camelCase pro resto da app)
// ============================================================

// Colunas de `prontuario` que podem ser gravadas a partir do corpo da requisição.
// Fonte: backEnd/src/config/init.sql. Excluídas de propósito: id, status, aluno_id,
// feedback_professor, created_at e updated_at — quem define esses seis é o servidor
// (via os parâmetros extras de `inserir`, nunca a partir do corpo do cliente).
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

const MAPA_CAMEL_PARA_SNAKE: Record<string, string> = {
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
  alunoId: 'aluno_id', feedbackProfessor: 'feedback_professor', alunoNome: 'aluno_nome',
};

const MAPA_SNAKE_PARA_CAMEL: Record<string, string> = Object.fromEntries(
  Object.entries(MAPA_CAMEL_PARA_SNAKE).map(([camel, snake]) => [snake, camel]),
);

const COLUNAS_ARRAY: ReadonlySet<string> = new Set([
  'quais_beneficios', 'residem_sua_casa', 'residencia_doenca_cronica',
  'quais_deficiencia', 'gastos_saude', 'gastos_alimentacao',
  'tipos_financiamento', 'como_soube_iesb', 'servico_iesb', 'antes_iesb',
]);

// Colunas JSONB (arrays de objetos ou objetos complexos)
const COLUNAS_JSONB: ReadonlySet<string> = new Set(['dependentes']);

/** Body em camelCase -> objeto pronto pra INSERT/UPDATE, já filtrado pelo allowlist. */
export function toSnake(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === '_id' || k === 'id') continue;
    const col = MAPA_CAMEL_PARA_SNAKE[k] ?? k;
    // Allowlist: chave que não corresponde a uma coluna gravável é descartada,
    // nunca vira nome de coluna no SQL.
    if (!COLUNAS_GRAVAVEIS.has(col)) continue;
    if (COLUNAS_ARRAY.has(col)) {
      out[col] = Array.isArray(v) ? v : [];
    } else if (COLUNAS_JSONB.has(col)) {
      out[col] = JSON.stringify(Array.isArray(v) ? v : []);
    } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      out[col] = JSON.stringify(v);
    } else {
      out[col] = v;
    }
  }
  return out;
}

/** Linha do banco (snake_case) -> objeto camelCase pro resto da aplicação. */
function toCamel(row: any): any {
  if (!row) return row;
  const out: any = {};
  for (const [k, v] of Object.entries(row)) {
    out[MAPA_SNAKE_PARA_CAMEL[k] ?? k] = v;
  }
  out._id = out.id; // compat com o frontend, que espera _id
  return out;
}

export interface CamposServidorProntuario {
  status: string;
  alunoId: number | null;
}

export interface OpcoesListagem {
  /** Quando informado, restringe aos prontuários do próprio aluno (ou sem aluno responsável). */
  alunoId?: number;
  pagina: number;
  tamanho: number;
}

export interface ResultadoListagem {
  linhas: any[];
  total: number;
}

/** Grava um novo prontuário. `dadosServidor` nunca vem do corpo do cliente. */
export async function inserir(
  bodyCamel: Record<string, unknown>,
  dadosServidor: CamposServidorProntuario,
): Promise<any> {
  const data = toSnake(bodyCamel);
  data.status = dadosServidor.status;
  if (dadosServidor.alunoId !== null) {
    data.aluno_id = dadosServidor.alunoId;
  }

  const cols = Object.keys(data);
  const vals = Object.values(data);
  const placeholders = vals.map((_, i) => `$${i + 1}`);

  const result = await pool.query(
    `INSERT INTO prontuario (${cols.join(',')}) VALUES (${placeholders.join(',')}) RETURNING *`,
    vals,
  );
  return toCamel(result.rows[0]);
}

/**
 * Lista prontuários com paginação. Quando `alunoId` é informado, restringe o
 * escopo aos prontuários daquele aluno (ou sem aluno responsável) — usado
 * para o perfil ATE. COO e PRO chamam sem `alunoId` (leitura ampla; a tabela
 * `usuarios` ainda não tem coluna de clínica pra restringir mais que isso).
 */
export async function listarComEscopo(opcoes: OpcoesListagem): Promise<ResultadoListagem> {
  const offset = (opcoes.pagina - 1) * opcoes.tamanho;
  const filtroAluno = opcoes.alunoId !== undefined ? 'WHERE (p.aluno_id = $1 OR p.aluno_id IS NULL)' : '';
  const paramsFiltro = opcoes.alunoId !== undefined ? [opcoes.alunoId] : [];

  const queryDados = `
    SELECT p.*, u.nome AS aluno_nome
    FROM prontuario p
    LEFT JOIN usuarios u ON p.aluno_id = u.id
    ${filtroAluno}
    ORDER BY p.id DESC
    LIMIT $${paramsFiltro.length + 1} OFFSET $${paramsFiltro.length + 2}
  `;
  const queryTotal = `SELECT COUNT(*) FROM prontuario p ${filtroAluno}`;

  const [dadosResult, totalResult] = await Promise.all([
    pool.query(queryDados, [...paramsFiltro, opcoes.tamanho, offset]),
    pool.query(queryTotal, paramsFiltro),
  ]);

  return {
    linhas: dadosResult.rows.map(toCamel),
    total: parseInt(totalResult.rows[0].count, 10),
  };
}

export async function buscarPorId(id: string | number): Promise<any | null> {
  const result = await pool.query(
    `
      SELECT p.*, u.nome AS aluno_nome
      FROM prontuario p
      LEFT JOIN usuarios u ON p.aluno_id = u.id
      WHERE p.id = $1
    `,
    [id],
  );
  return result.rows.length > 0 ? toCamel(result.rows[0]) : null;
}

export async function buscarPorCpf(cpf: string): Promise<any | null> {
  const result = await pool.query('SELECT * FROM prontuario WHERE cpf = $1', [cpf]);
  return result.rows.length > 0 ? toCamel(result.rows[0]) : null;
}

/** Usado no escopo ATE: o prontuário existe e pertence a este aluno (ou não tem responsável)? */
export async function existeParaAluno(id: string, alunoId: number): Promise<boolean> {
  const result = await pool.query(
    'SELECT id FROM prontuario WHERE id = $1 AND (aluno_id = $2 OR aluno_id IS NULL)',
    [id, alunoId],
  );
  return result.rows.length > 0;
}

export async function atualizarStatus(id: string, status: string): Promise<any | null> {
  const result = await pool.query(
    'UPDATE prontuario SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id],
  );
  return result.rows.length > 0 ? toCamel(result.rows[0]) : null;
}

/** Assume que `bodyCamel` já foi validado (não-vazio depois do allowlist) pelo serviço. */
export async function atualizarPorId(id: string, bodyCamel: Record<string, unknown>): Promise<any | null> {
  const data = toSnake(bodyCamel);
  const cols = Object.keys(data);
  const vals = Object.values(data);
  const sets = cols.map((c, i) => `${c} = $${i + 1}`);
  vals.push(id);

  const result = await pool.query(
    `UPDATE prontuario SET ${sets.join(',')}, updated_at = NOW() WHERE id = $${vals.length} RETURNING *`,
    vals,
  );
  return result.rows.length > 0 ? toCamel(result.rows[0]) : null;
}

export async function validar(id: string, feedback: string | null): Promise<any | null> {
  const result = await pool.query(
    `UPDATE prontuario SET status = $1, feedback_professor = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
    ['Aprovado', feedback, id],
  );
  return result.rows.length > 0 ? toCamel(result.rows[0]) : null;
}

export async function devolver(id: string, feedback: string | null): Promise<any | null> {
  const result = await pool.query(
    `UPDATE prontuario SET status = $1, feedback_professor = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
    ['Ajuste Necessário', feedback, id],
  );
  return result.rows.length > 0 ? toCamel(result.rows[0]) : null;
}
