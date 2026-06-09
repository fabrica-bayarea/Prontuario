import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../libs/api-client';
import { FormularioData } from '../schema';

export const ProntuarioService = {
  criar: async (dados: FormularioData): Promise<any> => {
    return await apiClient.post('/prontuarios', dados);
  },
};

export const useCriarProntuario = () => {
  return useMutation({
    mutationFn: ProntuarioService.criar,
  });
};