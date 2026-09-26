import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../libs/api-client';
import {
  PERMISSOES_POR_PERFIL,
  ROTA_INICIAL_POR_PERFIL,
  type ChaveTela,
  type Perfil,
} from '../config/permissions';

interface Usuario {
  id: number;
  matricula: string;
  email: string;
  nome: string;
  perfil: Perfil;
  permissoes?: ChaveTela[];
  rotaInicial?: string;
}

// O BE-06 devolve `permissoes` e `rotaInicial` ao lado de `usuario`, não dentro dele.
function camposSessao(response: any): Pick<Usuario, 'permissoes' | 'rotaInicial'> {
  return { permissoes: response.permissoes, rotaInicial: response.rotaInicial };
}

// O BE-06 passará a devolver `permissoes` e `rotaInicial` junto do usuário.
// Enquanto não vierem, derivamos do perfil pelo mapa provisório.
function comPermissoes(usuario: Usuario | null): Usuario | null {
  if (!usuario) return null;
  return {
    ...usuario,
    permissoes: usuario.permissoes ?? [...PERMISSOES_POR_PERFIL[usuario.perfil]],
    rotaInicial: usuario.rotaInicial ?? ROTA_INICIAL_POR_PERFIL[usuario.perfil],
  };
}

interface AuthContextType {
  usuario: Usuario | null;
  permissoes: ChaveTela[];
  rotaInicial: string;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  tokenTemporario: string | null;
  login: (
    identificador: string,
    senha: string,
  ) => Promise<{ primeiroAcesso: true } | { primeiroAcesso: false; rotaInicial: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('usuario');
    return comPermissoes(saved ? JSON.parse(saved) : null);
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [tokenTemporario, setTokenTemporario] = useState<string | null>(() => {
    return sessionStorage.getItem('tokenTemporario');
  });

  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    return !!sessionStorage.getItem('tokenTemporario');
  });

  const [isLoading, setIsLoading] = useState(true);

  // Consideramos autenticado se houver token válido e usuário
  const isAuthenticated = !!token && !!usuario;

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Ignora falha no logout da API, limpa localmente
      }
    }

    setToken(null);
    setUsuario(null);
    setTokenTemporario(null);
    setMustChangePassword(false);

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('tokenTemporario');
  }, [token]);

  // 401 em qualquer chamada autenticada: o api-client avisa por evento e o
  // logout aqui faz o PrivateRoute levar ao login, sem recarregar a página.
  useEffect(() => {
    window.addEventListener('auth:unauthorized', logout);
    return () => window.removeEventListener('auth:unauthorized', logout);
  }, [logout]);

  // Verifica se o token armazenado ainda é válido ao carregar a app
  useEffect(() => {
    async function verificarToken() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response: any = await apiClient.get('/auth/me');
        const usuarioAtual = comPermissoes({ ...response.usuario, ...camposSessao(response) });
        setUsuario(usuarioAtual);
        localStorage.setItem('usuario', JSON.stringify(usuarioAtual));
      } catch {
        // Token inválido ou expirado
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    verificarToken();
  }, [token, logout]);

  async function login(
    identificador: string,
    senha: string,
  ): Promise<{ primeiroAcesso: true } | { primeiroAcesso: false; rotaInicial: string }> {
    const response: any = await apiClient.post('/auth/login', { matricula: identificador, senha });

    if (response.primeiroAcesso) {
      setTokenTemporario(response.tokenTemporario);
      setMustChangePassword(true);
      sessionStorage.setItem('tokenTemporario', response.tokenTemporario);

      // Também guardamos temporariamente os dados do usuário se vieram na requisição
      if (response.usuario) {
        setUsuario(response.usuario);
      }
      return { primeiroAcesso: true };
    }

    const { token: newToken } = response;
    const newUsuario = comPermissoes({ ...response.usuario, ...camposSessao(response) });

    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(newUsuario));

    // Limpa estado de primeiro acesso caso estivesse sujo
    setTokenTemporario(null);
    setMustChangePassword(false);
    sessionStorage.removeItem('tokenTemporario');

    return { primeiroAcesso: false, rotaInicial: newUsuario!.rotaInicial! };
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        permissoes: usuario?.permissoes ?? [],
        rotaInicial: usuario?.rotaInicial ?? '/login',
        token,
        isAuthenticated,
        isLoading,
        mustChangePassword,
        tokenTemporario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
