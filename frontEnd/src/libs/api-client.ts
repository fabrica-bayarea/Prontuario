// src/lib/api-client.ts
import axios from 'axios';

// Usa a variável de ambiente injetada pelo Vite/Docker, com fallback para localhost no desenvolvimento
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Futuramente, você pode adicionar interceptors aqui (ex: para injetar token de login)
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Tratamento global de erros pode ser feito aqui
    return Promise.reject(error);
  }
);
