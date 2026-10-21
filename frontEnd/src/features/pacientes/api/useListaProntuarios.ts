import { queryOptions, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import { listarProntuarios } from './api';

export function useOpcoesListaProntuarios() {
  const { usuario, isAuthenticated } = useAuth();
  return queryOptions({
    queryKey: ['pacientes', usuario?.id, usuario?.perfil],
    queryFn: ({ signal }) => listarProntuarios(100, signal),
    enabled: isAuthenticated,
    // Não reter dados sensíveis após sair; React Query cancela a consulta sem observadores.
    gcTime: 0,
    retry: false,
  });
}

export function useListaProntuarios() {
  return useQuery(useOpcoesListaProntuarios());
}
