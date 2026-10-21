import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../libs/api-client';
import { listarProntuarios } from '../../pacientes/api/api';

export interface ProntuarioValidacao {
  id: number;
  nome: string;
  cpf: string;
  alunoNome?: string;
  clinicaAtendimento: string;
  areaAtendimento: string;
  status: string;
  createdAt: string;
  // Outros campos relevantes
  atendimentoParaQuem?: string;
  nomeOutraPessoa?: string;
}

export const ValidacaoService = {
  listarPendentes: async (): Promise<ProntuarioValidacao[]> => {
    // Busca a página (até 100) e filtra no frontend; ver EP-07 para filtro no servidor.
    const { dados } = await listarProntuarios();
    return dados.filter((p) => p.status === 'Aguardando Validação') as ProntuarioValidacao[];
  },

  validar: async ({ id, feedback }: { id: number; feedback: string }): Promise<any> => {
    return await apiClient.post(`/prontuarios/${id}/validar`, { feedback });
  },

  devolver: async ({ id, feedback }: { id: number; feedback: string }): Promise<any> => {
    return await apiClient.post(`/prontuarios/${id}/devolver`, { feedback });
  }
};

export const useProntuariosPendentes = () => {
  return useQuery({
    queryKey: ['prontuariosPendentes'],
    queryFn: ValidacaoService.listarPendentes,
  });
};

export const useValidarProntuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ValidacaoService.validar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuariosPendentes'] });
    },
  });
};

export const useDevolverProntuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ValidacaoService.devolver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuariosPendentes'] });
    },
  });
};
