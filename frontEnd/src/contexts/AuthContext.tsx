import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../libs/api-client';

interface Usuario {
  id: number;
  matricula: string;
  email: string;
  nome: string;
  perfil: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  tokenTemporario: string | null;
  login: (identificador: string, senha: string) => Promise<{ primeiroAcesso: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
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
      } catch (err) {
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

  // Verifica se o token armazenado ainda é válido ao carregar a app
  useEffect(() => {
    async function verificarToken() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response: any = await apiClient.get('/auth/me');
        setUsuario(response.usuario);
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
      } catch {
        // Token inválido ou expirado
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    verificarToken();
  }, [token, logout]);

  async function login(identificador: string, senha: string): Promise<{ primeiroAcesso: boolean }> {
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

    const { token: newToken, usuario: newUsuario } = response;

    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(newUsuario));
    
    // Limpa estado de primeiro acesso caso estivesse sujo
    setTokenTemporario(null);
    setMustChangePassword(false);
    sessionStorage.removeItem('tokenTemporario');
    
    return { primeiroAcesso: false };
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
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
