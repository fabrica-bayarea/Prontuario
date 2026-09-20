import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

// O interceptor abaixo devolve `response.data`, não o AxiosResponse.
// Esta interface diz isso ao TypeScript; nada muda em runtime.
interface ClienteApi {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  interceptors: AxiosInstance['interceptors'];
}

const baseURL = import.meta.env.VITE_API_URL || '/api';

const instancia = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: injeta token JWT automaticamente em cada request
instancia.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instancia.interceptors.response.use(
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

export const apiClient = instancia as unknown as ClienteApi;
