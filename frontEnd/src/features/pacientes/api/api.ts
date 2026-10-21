import { apiClient } from '../../../libs/api-client';
import { ListagemProntuariosService, type ClienteProntuarios } from './ListagemProntuariosService';
import type { ListaProntuarios } from './tipos';

export type { Prontuario, Paginacao, ListaProntuarios } from './tipos';

class ClienteProntuariosHttp implements ClienteProntuarios {
  buscarPagina(pagina: number, tamanho: number, signal?: AbortSignal): Promise<unknown> {
    return apiClient.get<unknown>('/prontuarios', { params: { pagina, tamanho }, signal });
  }
}

const listagem = new ListagemProntuariosService(new ClienteProntuariosHttp());

/** Coleção completa; no envelope, paginacao preserva os metadados da primeira página. */
export function listarProntuarios(tamanho = 100, signal?: AbortSignal): Promise<ListaProntuarios> {
  return listagem.listar(tamanho, signal);
}
