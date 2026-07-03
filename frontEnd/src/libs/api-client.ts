import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: injeta token JWT automaticamente em cada request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Se receber 401, limpa o token e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // Não redirecionar se já estiver na tela de login ou primeiro acesso, para que o usuário possa ver a mensagem de erro
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/primeiro-acesso') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
