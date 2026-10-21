import type { ListaProntuarios, Prontuario } from '../../src/features/pacientes/api/api';

export function criarProntuarios(total: number, inicio = 1): Prontuario[] {
  return Array.from({ length: total }, (_, indice) => ({
    id: inicio + indice,
    nome: indice === total - 1 ? 'Paciente Última Página' : `Paciente Sintético ${inicio + indice}`,
    cpf: String(inicio + indice).padStart(11, '0'),
    status: indice === total - 1 ? 'Aguardando Validação' : 'Aprovado',
    createdAt: new Date().toISOString(),
    clinicaAtendimento: 'Clínica Escola Ceilândia',
    areaAtendimento: 'Psicologia',
    alunoNome: 'Atendente Sintético',
  }));
}

export function criarPagina(dados: Prontuario[], pagina: number, tamanho = 100): ListaProntuarios {
  return {
    dados: dados.slice((pagina - 1) * tamanho, pagina * tamanho),
    paginacao: { pagina, tamanho, total: dados.length, totalPaginas: Math.ceil(dados.length / tamanho) },
  };
}
