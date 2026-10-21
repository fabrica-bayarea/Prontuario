// Classificação automática de triagem (EP-02). Porta as regras que hoje vivem em
// frontEnd/src/features/triagem/components/Triagem.tsx (calcularTriagem) pro
// servidor: o prontuário nasce classificado no INSERT, em vez de recalculado
// no cliente a cada render.
//
// Os pesos não são mais constantes fixas (issue #154, EP-08): vêm da versão
// ativa de `criterios_triagem` (global ou por clínica) — ver
// criteriosTriagemRepository.buscarAtivaPorClinica. Mudar um peso é uma
// versão nova; classificações antigas guardam qual versão as gerou e nunca
// são recalculadas.

export type Prioridade = 'baixa' | 'media' | 'alta';

export interface PesosTriagem {
  rendaBaixa: number;
  rendaMedia: number;
  vulnerabilidadeSocial: number;
  moradiaVulneravel: number;
  riscoSaude: number;
  limiarAlta: number;
  limiarMedia: number;
}

/** Pesos que BE-09 (#150) codificou como constantes — usados só se, por algum
 * defeito de configuração, não houver nenhuma versão ativa no banco (a
 * migration 004 sempre semeia a versão 1 global, então isso não deveria
 * acontecer em operação normal). */
export const PESOS_PADRAO: PesosTriagem = {
  rendaBaixa: 3,
  rendaMedia: 2,
  vulnerabilidadeSocial: 2,
  moradiaVulneravel: 1,
  riscoSaude: 2,
  limiarAlta: 4,
  limiarMedia: 2,
};

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
 * de criação, antes do toSnake/allowlist) e dos pesos da versão de critérios
 * ativa (global ou da clínica).
 *
 * Sem renda familiar ou sem número de pessoas na casa, não classifica — regra
 * "dados incompletos impedem a execução" do EP-02, não um erro: devolve
 * prioridade/pontuação nulas e registra o motivo em `criterios`.
 */
export function classificar(dados: Record<string, unknown>, pesos: PesosTriagem): ResultadoTriagem {
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
    pontos += pesos.rendaBaixa;
    criterios.push({
      tipo: 'alerta',
      titulo: 'Renda per capita < 1 salário mínimo',
      descricao: `A renda declarada (${renda}) dividida pelos ${pessoas} membro(s) da família indica vulnerabilidade econômica crítica.`,
      pontos: pesos.rendaBaixa,
    });
  } else if (rendaMedia) {
    pontos += pesos.rendaMedia;
    criterios.push({
      tipo: 'alerta',
      titulo: 'Renda em faixa de atenção (1 a 3 Salários Mínimos)',
      descricao: `Renda declarada (${renda}) requer acompanhamento de prioridade moderada.`,
      pontos: pesos.rendaMedia,
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
    pontos += pesos.vulnerabilidadeSocial;
    const benefs = quaisBeneficios.length > 0 ? quaisBeneficios.join(', ') : 'Benefício Social';
    criterios.push({
      tipo: 'alerta',
      titulo: 'Vulnerabilidade Social Detectada',
      descricao: `Participante de programas de transferência de renda (${benefs})${temCadUnico ? ' e cadastrado no CadÚnico' : ''}.`,
      pontos: pesos.vulnerabilidadeSocial,
    });
  } else if (casaVulneravel) {
    pontos += pesos.moradiaVulneravel;
    criterios.push({
      tipo: 'alerta',
      titulo: 'Moradia Alugada / Cedida',
      descricao: `Residência ${(suaCasaE as string).toLowerCase()} com comprometimento financeiro mensal constante.`,
      pontos: pesos.moradiaVulneravel,
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
    pontos += pesos.riscoSaude;
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
      pontos: pesos.riscoSaude,
    });
  }

  criterios.push({ tipo: 'neutro', titulo: 'Documentação completa', pontos: 0 });

  let prioridade: Prioridade;
  if (pontos >= pesos.limiarAlta) {
    prioridade = 'alta';
  } else if (pontos >= pesos.limiarMedia) {
    prioridade = 'media';
  } else {
    prioridade = 'baixa';
  }

  return { prioridade, pontuacao: pontos, criterios, calculadaEm: new Date() };
}
