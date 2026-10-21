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
  atendimentoParaQuem?: string;
  nomeOutraPessoa?: string;
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
  /** Metadados do transporte da primeira página, mesmo após agregar a coleção. */
  paginacao: Paginacao;
}
