import { z } from 'zod';
import type { ListaProntuarios, Paginacao, Prontuario } from './tipos';

export interface ClienteProntuarios {
  buscarPagina(pagina: number, tamanho: number, signal?: AbortSignal): Promise<unknown>;
}

const prontuarioSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  cpf: z.string(),
  status: z.string().nullish(),
  createdAt: z.string().nullish(),
  clinicaAtendimento: z.string().nullish(),
  areaAtendimento: z.string().nullish(),
  alunoNome: z.string().nullish(),
  atendimentoParaQuem: z.string().nullish(),
  nomeOutraPessoa: z.string().nullish(),
}).passthrough();

const dadosSchema = z.array(prontuarioSchema);
const paginaSchema = z.object({
  dados: dadosSchema,
  paginacao: z.object({
    pagina: z.number().int().positive(),
    tamanho: z.number().int().min(1).max(100),
    total: z.number().int().nonnegative(),
    totalPaginas: z.number().int().nonnegative(),
  }),
});

function respostaInconsistente(): Error {
  return new Error('Não foi possível carregar a lista completa: resposta inconsistente. Tente novamente.');
}

export class ListagemProntuariosService {
  constructor(private readonly cliente: ClienteProntuarios) {}

  async listar(tamanho = 100, signal?: AbortSignal): Promise<ListaProntuarios> {
    if (!Number.isSafeInteger(tamanho) || tamanho < 1) {
      throw new Error('O tamanho da página deve ser um inteiro positivo.');
    }
    const tamanhoSolicitado = Math.min(tamanho, 100);
    signal?.throwIfAborted();
    const resposta = await this.cliente.buscarPagina(1, tamanhoSolicitado, signal);
    signal?.throwIfAborted();

    if (Array.isArray(resposta)) {
      const resultado = dadosSchema.safeParse(resposta);
      if (!resultado.success) throw respostaInconsistente();
      const dados: Prontuario[] = [];
      this.adicionarSemDuplicatas(dados, resultado.data, new Set());
      // O array legado é uma resposta única, sem paginação no servidor.
      return {
        dados,
        paginacao: {
          pagina: 1, tamanho: tamanhoSolicitado, total: dados.length,
          totalPaginas: dados.length === 0 ? 0 : 1,
        },
      };
    }

    const primeira = this.validarPagina(resposta, 1, tamanhoSolicitado);
    const dados: Prontuario[] = [];
    const ids = new Set<number>();
    this.adicionarSemDuplicatas(dados, primeira.dados, ids);

    // Limite fixado pela primeira resposta: uma mudança de total exige reiniciar.
    for (let pagina = 2; pagina <= primeira.paginacao.totalPaginas; pagina++) {
      signal?.throwIfAborted();
      const respostaPagina = await this.cliente.buscarPagina(pagina, tamanhoSolicitado, signal);
      signal?.throwIfAborted();
      const atual = this.validarPagina(respostaPagina, pagina, tamanhoSolicitado, primeira.paginacao);
      this.adicionarSemDuplicatas(dados, atual.dados, ids);
    }

    if (dados.length !== primeira.paginacao.total) throw respostaInconsistente();
    return { dados, paginacao: primeira.paginacao };
  }

  private validarPagina(
    resposta: unknown, pagina: number, tamanho: number, inicial?: Paginacao,
  ): ListaProntuarios {
    const resultado = paginaSchema.safeParse(resposta);
    if (!resultado.success) throw respostaInconsistente();
    const { dados, paginacao } = resultado.data;
    const quantidadeEsperada = Math.min(tamanho, Math.max(0, paginacao.total - (pagina - 1) * tamanho));
    if (
      paginacao.pagina !== pagina || paginacao.tamanho !== tamanho ||
      paginacao.totalPaginas !== Math.ceil(paginacao.total / tamanho) ||
      dados.length !== quantidadeEsperada ||
      (inicial && (paginacao.total !== inicial.total || paginacao.totalPaginas !== inicial.totalPaginas))
    ) {
      throw respostaInconsistente();
    }
    return { dados, paginacao };
  }

  private adicionarSemDuplicatas(destino: Prontuario[], recebidos: Prontuario[], ids: Set<number>): void {
    for (const prontuario of recebidos) {
      if (ids.has(prontuario.id)) throw respostaInconsistente();
      ids.add(prontuario.id);
      destino.push(prontuario);
    }
  }
}
