import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../libs/api-client';
import { listarProntuarios, type ListaProntuarios, type Prontuario } from '../../pacientes/api/api';
import { useOpcoesListaProntuarios } from '../../pacientes/api/useListaProntuarios';

export type ProntuarioValidacao = Prontuario;

function filtrarPendentes({ dados }: ListaProntuarios): ProntuarioValidacao[] {
  return dados.filter((prontuario) => prontuario.status === 'Aguardando Validação');
}

export const ValidacaoService = {
  listarPendentes: async (signal?: AbortSignal): Promise<ProntuarioValidacao[]> => {
    return filtrarPendentes(await listarProntuarios(100, signal));
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
    ...useOpcoesListaProntuarios(),
    select: filtrarPendentes,
  });
};

export const useValidarProntuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ValidacaoService.validar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });
};

export const useDevolverProntuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ValidacaoService.devolver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });
};
