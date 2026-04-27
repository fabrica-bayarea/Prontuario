// src/services/api.ts
import axios from 'axios';

// 1. Criamos uma instância do Axios com o endereço base do seu Backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// 2. Definimos as funções que o Frontend vai usar
export const ProntuarioService = {
  // Função para criar um novo prontuário (POST)
  criar: async (dadosDoFormulario: any) => {
    try {
      // Mongoose: required String rejeita string vazia — complemento é opcional no formulário
      const complemento =
        typeof dadosDoFormulario.complemento === 'string' &&
        dadosDoFormulario.complemento.trim() !== ''
          ? dadosDoFormulario.complemento.trim()
          : 'Sem complemento';
      const payload = { ...dadosDoFormulario, complemento };
      // Isso envia um POST para http://localhost:3001/api/prontuarios
      const response = await api.post('/prontuarios', payload);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao integrar com backend:', error);
      throw error; // Repassa o erro para o componente tratar (ex: mostrar alerta)
    }
  },

  // Função para listar todos (GET) - Útil para telas de listagem
  listar: async () => {
    try {
      const response = await api.get('/prontuarios');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar lista:', error);
      throw error;
    }
  }
};