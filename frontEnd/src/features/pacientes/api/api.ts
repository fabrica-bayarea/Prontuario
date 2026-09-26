import { apiClient } from '../../../libs/api-client';

export interface Prontuario {
  id: number;
  _id?: number;
  nome: string;
  cpf: string;
  status?: string;
  createdAt?: string;
  clinicaAtendimento?: string;
  areaAtendimento?: string;
  alunoNome?: string;
  [campo: string]: unknown;
}

export interface Paginacao {
  pagina: number;
  tamanho: number;
  total: number;
  totalPaginas: number;
}

export interface ListaProntuarios {
  dados: Prontuario[];
  paginacao: Paginacao;
}

/** Envelope paginado de GET /prontuarios (#142). Teto do servidor: 100 por página. */
export async function listarProntuarios(tamanho = 100): Promise<ListaProntuarios> {
  const resposta = await apiClient.get<ListaProntuarios | Prontuario[]>('/prontuarios', {
    params: { pagina: 1, tamanho },
  });

  // Back anterior ao #142 devolve array puro. Normaliza para o envelope, assim
  // este front funciona antes, durante e depois do merge do #142.
  if (Array.isArray(resposta)) {
    return {
      dados: resposta,
      paginacao: { pagina: 1, tamanho, total: resposta.length, totalPaginas: 1 },
    };
  }

  return resposta;
}
