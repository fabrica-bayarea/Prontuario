import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../libs/api-client';
import { FormularioData } from '../schema';

export const ProntuarioService = {
  criar: async (dados: FormularioData): Promise<any> => {
    return await apiClient.post('/prontuarios', dados);
  },
  listarMeu: async (): Promise<any> => {
    return await apiClient.get('/prontuarios/me');
  }
};

export const useCriarProntuario = () => {
  return useMutation({
    mutationFn: ProntuarioService.criar,
  });
};

export const useMeuProntuario = () => {
  return useQuery({
    queryKey: ['meuProntuario'],
    queryFn: ProntuarioService.listarMeu,
    retry: false,
  });
};