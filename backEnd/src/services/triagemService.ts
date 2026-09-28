// Classificação automática de triagem (EP-02). Porta as regras que hoje vivem em
// frontEnd/src/features/triagem/components/Triagem.tsx (calcularTriagem) pro
// servidor: o prontuário nasce classificado no INSERT, em vez de recalculado
// no cliente a cada render.

export type Prioridade = 'baixa' | 'media' | 'alta';

export interface CriterioTriagem {
  tipo: 'alerta' | 'neutro';
  titulo: string;
  descricao?: string;
  pontos: number;
}

export interface ResultadoTriagem {
  prioridade: Prioridade | null;
  pontuacao: number | null;
  criterios: CriterioTriagem[];
  /** null quando não classificado (dados incompletos) — não é erro. */
  calculadaEm: Date | null;
}

const GRUPOS_DE_RISCO: ReadonlySet<string> = new Set(['idoso', 'gestante', 'pcd']);

function estaAusente(valor: unknown): boolean {
  return valor === undefined || valor === null || valor === '';
}

function comoArray(valor: unknown): unknown[] {
  return Array.isArray(valor) ? valor : [];
}

/**
 * Classifica o prontuário em baixa/média/alta prioridade a partir dos dados
 * do corpo da requisição (mesmo objeto camelCase usado no restante do fluxo
 * de criação, antes do toSnake/allowlist).
 *
 * Sem renda familiar ou sem número de pessoas na casa, não classifica — regra
 * "dados incompletos impedem a execução" do EP-02, não um erro: devolve
 * prioridade/pontuação nulas e registra o motivo em `criterios`.
 */
export function classificar(dados: Record<string, unknown>): ResultadoTriagem {
  const rendaFamiliar = dados.rendaFamiliar;
  const pessoasPorCasa = dados.pessoasPorCasa;

  if (estaAusente(rendaFamiliar) || estaAusente(pessoasPorCasa)) {
    const motivos: CriterioTriagem[] = [];
    if (estaAusente(rendaFamiliar)) {
      motivos.push({ tipo: 'neutro', titulo: 'Triagem não executada', descricao: 'Renda familiar não informada.', pontos: 0 });
    }
    if (estaAusente(pessoasPorCasa)) {
      motivos.push({ tipo: 'neutro', titulo: 'Triagem não executada', descricao: 'Número de pessoas na casa não informado.', pontos: 0 });
    }
    return { prioridade: null, pontuacao: null, criterios: motivos, calculadaEm: null };
  }

  let pontos = 0;
  const criterios: CriterioTriagem[] = [];

  const renda = String(rendaFamiliar);
  const pessoas = Number(pessoasPorCasa);
  const rendaBaixa = renda === 'Nenhuma' || renda === 'MeioUm' || renda.includes('800') || renda.includes('600');
  const rendaMedia = renda === 'DeUmAteTres' || renda === 'DeUmAteDois';

  if (rendaBaixa) {
    pontos += 3;
    criterios.push({
      tipo: 'alerta',
      titulo: 'Renda per capita < 1 salário mínimo',
      descricao: `A renda declarada (${renda}) dividida pelos ${pessoas} membro(s) da família indica vulnerabilidade econômica crítica.`,
      pontos: 3,
    });
  } else if (rendaMedia) {
    pontos += 2;
    criterios.push({
      tipo: 'alerta',
      titulo: 'Renda em faixa de atenção (1 a 3 Salários Mínimos)',
      descricao: `Renda declarada (${renda}) requer acompanhamento de prioridade moderada.`,
      pontos: 2,
    });
  } else {
    criterios.push({ tipo: 'neutro', titulo: 'Renda familiar acima de 3 salários mínimos', pontos: 0 });
  }

  const quaisBeneficios = comoArray(dados.quaisBeneficios);
  const temBeneficio = quaisBeneficios.length > 0 || dados.beneficioSocial === 'Sim';
  const temCadUnico = Boolean(dados.cadUnico || dados.CADUnico);
  const suaCasaE = dados.suaCasaE as string | undefined;
  const casaVulneravel = suaCasaE === 'Alugada' || suaCasaE === 'Cedida';

  if (temBeneficio || temCadUnico) {
    pontos += 2;
    const benefs = quaisBeneficios.length > 0 ? quaisBeneficios.join(', ') : 'Benefício Social';
    criterios.push({
      tipo: 'alerta',
      titulo: 'Vulnerabilidade Social Detectada',
      descricao: `Participante de programas de transferência de renda (${benefs})${temCadUnico ? ' e cadastrado no CadÚnico' : ''}.`,
      pontos: 2,
    });
  } else if (casaVulneravel) {
    pontos += 1;
    criterios.push({
      tipo: 'alerta',
      titulo: 'Moradia Alugada / Cedida',
      descricao: `Residência ${(suaCasaE as string).toLowerCase()} com comprometimento financeiro mensal constante.`,
      pontos: 1,
    });
  } else {
    criterios.push({ tipo: 'neutro', titulo: 'Sem benefícios sociais ativos cadastrados', pontos: 0 });
  }

  const quaisDeficiencia = comoArray(dados.quaisDeficiencia);
  const temDeficiencia = dados.residenciaDeficiencia === 'Sim' || quaisDeficiencia.length > 0;
  const doencas = (comoArray(dados.residenciaDoencaCronica) as string[]).filter((d) => d !== 'nenhumaDoenca');
  const gruposRisco = (comoArray(dados.residemSuaCasa) as string[]).filter((r) => GRUPOS_DE_RISCO.has(r));
  const classAtendimento = String(dados.classAtendimento ?? '');
  const ehUrgente =
    classAtendimento.toLowerCase().includes('urgente') ||
    classAtendimento.includes('3') ||
    classAtendimento.includes('4');

  if (temDeficiencia || doencas.length > 0 || gruposRisco.length > 0 || ehUrgente) {
    pontos += 2;
    const itensRisco = [
      temDeficiencia ? 'Deficiência' : '',
      doencas.length > 0 ? `Doenças crônicas (${doencas.join(', ')})` : '',
      gruposRisco.length > 0 ? `Moradores em grupo de risco (${gruposRisco.join(', ')})` : '',
      ehUrgente ? 'Classificação de urgência' : '',
    ].filter(Boolean).join(' • ');

    criterios.push({
      tipo: 'alerta',
      titulo: 'Necessidade Especial / Saúde / Risco',
      descricao: itensRisco || 'Presença de fatores de risco de saúde na residência.',
      pontos: 2,
    });
  }

  criterios.push({ tipo: 'neutro', titulo: 'Documentação completa', pontos: 0 });

  let prioridade: Prioridade;
  if (pontos >= 4) {
    prioridade = 'alta';
  } else if (pontos >= 2) {
    prioridade = 'media';
  } else {
    prioridade = 'baixa';
  }

  return { prioridade, pontuacao: pontos, criterios, calculadaEm: new Date() };
}
