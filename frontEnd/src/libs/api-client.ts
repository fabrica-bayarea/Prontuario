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
    // 401 numa chamada autenticada: sessão caiu. Quem trata é o AuthContext,
    // para não descartar o estado da aplicação com um reload.
    const autenticada = Boolean(error.config?.headers?.Authorization);
    const rotaDeAuth = /\/auth\/(login|logout|primeiro-acesso)$/.test(error.config?.url ?? '');
    if (error.response?.status === 401 && autenticada && !rotaDeAuth) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const apiClient = instancia as unknown as ClienteApi;
