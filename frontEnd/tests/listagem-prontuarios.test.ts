import { describe, expect, it, vi } from 'vitest';
import { ListagemProntuariosService } from '../src/features/pacientes/api/ListagemProntuariosService';
import { criarPagina, criarProntuarios } from './fixtures/prontuarios';

describe('coleção completa de prontuários', () => {
  it('preserva os 201 registros do array legado com uma chamada', async () => {
    const dados = criarProntuarios(201);
    const buscarPagina = vi.fn().mockResolvedValue(dados);
    const resultado = await new ListagemProntuariosService({ buscarPagina }).listar();
    expect(resultado.dados).toEqual(dados);
    expect(resultado.paginacao.total).toBe(201);
    expect(buscarPagina).toHaveBeenCalledExactlyOnceWith(1, 100, undefined);
  });

  it.each([[0, 1], [1, 1], [100, 1], [101, 2], [201, 3]])(
    '%i registros paginados exigem %i chamadas',
    async (total, chamadas) => {
      const dados = criarProntuarios(total);
      const buscarPagina = vi.fn(async (pagina: number, tamanho: number) => criarPagina(dados, pagina, tamanho));
      const resultado = await new ListagemProntuariosService({ buscarPagina }).listar();
      expect(resultado.dados).toEqual(dados);
      expect(resultado.paginacao).toEqual(criarPagina(dados, 1).paginacao);
      expect(buscarPagina.mock.calls.map(([pagina, tamanho]) => [pagina, tamanho]))
        .toEqual(Array.from({ length: chamadas }, (_, indice) => [indice + 1, 100]));
    },
  );

  it.each([1, 20, 100, 500])('respeita tamanho menor e limita a 100: %i', async (tamanho) => {
    const dados = criarProntuarios(101);
    const buscarPagina = vi.fn(async (pagina: number, limite: number) => criarPagina(dados, pagina, limite));
    const resultado = await new ListagemProntuariosService({ buscarPagina }).listar(tamanho);
    expect(resultado.dados).toHaveLength(101);
    expect(resultado.paginacao.tamanho).toBe(Math.min(tamanho, 100));
    expect(buscarPagina.mock.calls.every(([, limite]) => limite === Math.min(tamanho, 100))).toBe(true);
  });

  it.each([0, -1, 1.5, NaN, Infinity])('rejeita tamanho inválido sem HTTP: %s', async (tamanho) => {
    const buscarPagina = vi.fn();
    await expect(new ListagemProntuariosService({ buscarPagina }).listar(tamanho)).rejects.toThrow('inteiro positivo');
    expect(buscarPagina).not.toHaveBeenCalled();
  });

  const dados = criarProntuarios(201);
  const pagina2 = criarPagina(dados, 2);
  const casosInvalidos: [string, unknown][] = [
    ['página repetida', criarPagina(dados, 1)],
    ['total alterado', { ...pagina2, paginacao: { ...pagina2.paginacao, total: 202 } }],
    ['tamanho alterado', criarPagina(dados, 2, 50)],
    ['página vazia inesperada', { ...pagina2, dados: [] }],
    ['página curta', { ...pagina2, dados: pagina2.dados.slice(1) }],
    ['IDs duplicados', { ...pagina2, dados: [dados[0], ...pagina2.dados.slice(1)] }],
    ['dados não são array', { ...pagina2, dados: {} }],
    ['array no lugar do envelope', pagina2.dados],
    ['total de páginas incoerente', { ...pagina2, paginacao: { ...pagina2.paginacao, totalPaginas: 4 } }],
    ['página fracionária', { ...pagina2, paginacao: { ...pagina2.paginacao, pagina: 2.5 } }],
    ['total negativo', { ...pagina2, paginacao: { ...pagina2.paginacao, total: -1 } }],
    ['ID inválido', { ...pagina2, dados: [{ ...dados[100], id: null }, ...pagina2.dados.slice(1)] }],
    ['registro inválido', { ...pagina2, dados: [{ id: 101 }, ...pagina2.dados.slice(1)] }],
  ];

  it.each(casosInvalidos)('falha sem publicar resultado parcial: %s', async (_, invalida) => {
    const buscarPagina = vi.fn().mockResolvedValueOnce(criarPagina(dados, 1)).mockResolvedValueOnce(invalida);
    await expect(new ListagemProntuariosService({ buscarPagina }).listar()).rejects.toThrow('Tente novamente');
    expect(buscarPagina).toHaveBeenCalledTimes(2);
  });

  it('falha na página 2 e nova tentativa reinicia na página 1', async () => {
    let falhar = true;
    const buscarPagina = vi.fn(async (pagina: number) => {
      if (pagina === 2 && falhar) throw new Error('Falha de rede simulada');
      return criarPagina(dados, pagina);
    });
    const servico = new ListagemProntuariosService({ buscarPagina });
    await expect(servico.listar()).rejects.toThrow('Falha de rede simulada');
    falhar = false;
    expect((await servico.listar()).dados).toEqual(dados);
    expect(buscarPagina.mock.calls.map(([pagina]) => pagina)).toEqual([1, 2, 1, 2, 3]);
  });

  it('não publica coleção se a última página divergir do total', async () => {
    const buscarPagina = vi.fn(async (pagina: number) => {
      const resposta = criarPagina(dados, pagina);
      return pagina === 3 ? { ...resposta, dados: [] } : resposta;
    });
    await expect(new ListagemProntuariosService({ buscarPagina }).listar()).rejects.toThrow('Tente novamente');
  });

  it('cancela o transporte pendente e não busca a terceira página', async () => {
    const controle = new AbortController();
    const buscarPagina = vi.fn(async (pagina: number, _tamanho: number, signal?: AbortSignal) => {
      if (pagina === 1) return criarPagina(dados, 1);
      return new Promise<never>((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    });
    const consulta = new ListagemProntuariosService({ buscarPagina }).listar(100, controle.signal);
    const rejeicao = expect(consulta).rejects.toMatchObject({ name: 'AbortError' });
    await vi.waitFor(() => expect(buscarPagina).toHaveBeenCalledTimes(2));
    controle.abort();
    await rejeicao;
    expect(buscarPagina).toHaveBeenLastCalledWith(2, 100, controle.signal);
  });

  it('ignora resposta tardia mesmo se o transporte não tratar cancelamento', async () => {
    const controle = new AbortController();
    const buscarPagina = vi.fn(async (pagina: number) => {
      if (pagina === 2) controle.abort();
      return criarPagina(dados, pagina);
    });
    await expect(new ListagemProntuariosService({ buscarPagina }).listar(100, controle.signal))
      .rejects.toMatchObject({ name: 'AbortError' });
    expect(buscarPagina).toHaveBeenCalledTimes(2);
  });

  it('um sinal já cancelado impede até a primeira chamada', async () => {
    const controle = new AbortController();
    controle.abort();
    const buscarPagina = vi.fn();
    await expect(new ListagemProntuariosService({ buscarPagina }).listar(100, controle.signal))
      .rejects.toMatchObject({ name: 'AbortError' });
    expect(buscarPagina).not.toHaveBeenCalled();
  });

  it('não mistura conjuntos de atendentes em consultas concorrentes', async () => {
    const conjuntos = [criarProntuarios(201), criarProntuarios(101, 1001)];
    const resultados = await Promise.all(conjuntos.map((conjunto) =>
      new ListagemProntuariosService({
        buscarPagina: async (pagina, tamanho) => criarPagina(conjunto, pagina, tamanho),
      }).listar(),
    ));
    expect(resultados.map((resultado) => resultado.dados)).toEqual(conjuntos);
    expect(resultados[0].dados.some((primeiro) => resultados[1].dados.some((segundo) => segundo.id === primeiro.id))).toBe(false);
  });
});
