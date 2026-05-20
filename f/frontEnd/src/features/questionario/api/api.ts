import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../libs/api-client';

export const ProntuarioService = {
  criar: async (dados: any): Promise<any> => {
    return await apiClient.post('/prontuarios', dados);
  },
};

export const useCriarProntuario = () => {
  return useMutation({
    mutationFn: ProntuarioService.criar,
  });
};