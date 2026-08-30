import crypto from 'crypto';
import { enviarEmailBoasVindas } from '../helpers/emailHelper';
import { hashSenha } from '../helpers/senhaHelper';
import {
  atualizarAtivo,
  atualizarSenhaHash,
  buscarParaBoasVindas,
  buscarPerfilPorId,
  existePorMatriculaOuEmail,
  inserir,
  listarTodos,
} from '../repositories/usuarioRepository';
import type { UsuarioListado, UsuarioResumo } from '../repositories/usuarioRepository';

export type { UsuarioListado, UsuarioResumo } from '../repositories/usuarioRepository';

const PERFIS_PERMITIDOS: ReadonlySet<string> = new Set(['COO', 'PRO', 'ATE']);

export class ErroDeNegocio extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: string | null,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = 'ErroDeNegocio';
  }
}

export async function criarUsuario(dados: {
  nome: string;
  matricula: string;
  email: string;
  perfil: string;
}): Promise<UsuarioResumo> {
  const { nome, matricula, email, perfil } = dados;

  if (!nome || !matricula || !email || !perfil) {
    throw new ErroDeNegocio(400, null, 'Todos os campos são obrigatórios.');
  }

  if (!PERFIS_PERMITIDOS.has(perfil)) {
    throw new ErroDeNegocio(400, null, 'Perfil inválido ou não permitido.');
  }

  if (await existePorMatriculaOuEmail(matricula, email)) {
    throw new ErroDeNegocio(409, null, 'Matrícula ou e-mail já cadastrado.');
  }

  const senhaProvisoria = crypto.randomBytes(9).toString('base64url');
  const senhaHash = await hashSenha(senhaProvisoria);
  const usuario = await inserir({ matricula, email, senhaHash, nome, perfil });

  await enviarEmailBoasVindas(email, nome, senhaProvisoria, matricula);

  return usuario;
}

export async function listarUsuarios(): Promise<UsuarioListado[]> {
  return listarTodos();
}

export async function alterarStatus(
  id: string,
  ativo: unknown,
  idSolicitante: number,
): Promise<string> {
  if (typeof ativo !== 'boolean') {
    throw new ErroDeNegocio(400, null, 'Campo "ativo" deve ser booleano.');
  }

  if (String(idSolicitante) === String(id)) {
    throw new ErroDeNegocio(403, null, 'Não é permitido alterar o próprio status.');
  }

  const perfil = await buscarPerfilPorId(id);
  if (perfil === null) {
    throw new ErroDeNegocio(404, null, 'Usuário não encontrado.');
  }

  await atualizarAtivo(id, ativo);
  return `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso.`;
}

export async function reenviarBoasVindas(id: string): Promise<void> {
  const usuario = await buscarParaBoasVindas(id);

  if (!usuario) {
    throw new ErroDeNegocio(404, null, 'Usuário não encontrado.');
  }

  if (!usuario.primeiro_acesso) {
    throw new ErroDeNegocio(
      400,
      null,
      'Este usuário já realizou o primeiro acesso. Ele deve usar a opção "Esqueci minha senha".',
    );
  }

  const senhaProvisoria = crypto.randomBytes(9).toString('base64url');
  const senhaHash = await hashSenha(senhaProvisoria);

  await atualizarSenhaHash(id, senhaHash);
  await enviarEmailBoasVindas(usuario.email, usuario.nome, senhaProvisoria, usuario.matricula);
}
