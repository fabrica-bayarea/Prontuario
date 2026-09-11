import crypto from 'crypto';
import { enviarEmailBoasVindas } from '../helpers/emailHelper';
import { hashSenha } from '../helpers/senhaHelper';
import * as prontuarioRepository from '../repositories/prontuarioRepository';
import { existePorMatriculaOuEmail, inserir as inserirUsuario } from '../repositories/usuarioRepository';

// Status que cada perfil pode gravar via PATCH /:id/status.
// 'Aprovado' e 'Ajuste Necessário' ficam de fora de propósito: quem valida é o
// professor, por POST /:id/validar e POST /:id/devolver (RN-09, RBAC §3.7).
const STATUS_POR_PERFIL: Record<string, ReadonlySet<string>> = {
  ATE: new Set(['Aguardando Triagem', 'Em Análise', 'Agendado']),
};

const TAMANHO_PADRAO = 20;
const TAMANHO_MAXIMO = 100;

/**
 * As respostas de erro do prontuário nunca foram um envelope único (algumas rotas
 * respondem `{ error: ... }`, outras `{ message: ... }` puro) — isso é assim desde
 * antes desta issue e mudar agora quebraria o front sem necessidade. Por isso este
 * erro carrega o corpo exato da resposta (`payload`), em vez de só uma mensagem
 * como o `ErroDeNegocio` de `usuarioService`.
 */
export class ErroDeNegocio extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: unknown,
  ) {
    super(typeof payload === 'string' ? payload : JSON.stringify(payload));
    this.name = 'ErroDeNegocio';
  }
}

export interface Paginacao {
  pagina: number;
  tamanho: number;
  total: number;
  totalPaginas: number;
}

export interface ListaProntuarios {
  dados: any[];
  paginacao: Paginacao;
}

export async function criarProntuario(
  bodyCamel: Record<string, unknown>,
  alunoIdSolicitante: number | null,
): Promise<any> {
  try {
    const body = {
      ...bodyCamel,
      clinicaAtendimento: (bodyCamel as any).clinicaAtendimento || 'Clínica Escola IESB',
    };

    const novoProntuario = await prontuarioRepository.inserir(body, {
      status: 'Aguardando Validação',
      alunoId: alunoIdSolicitante,
    });

    // Cria acesso COM (Comunidade) automaticamente, se não existir
    if (novoProntuario.email && novoProntuario.cpf && novoProntuario.nome) {
      const jaExiste = await existePorMatriculaOuEmail(novoProntuario.cpf, novoProntuario.email);

      if (!jaExiste) {
        const senhaProvisoria = crypto.randomBytes(9).toString('base64url');
        const senhaHash = await hashSenha(senhaProvisoria);

        await inserirUsuario({
          matricula: novoProntuario.cpf,
          email: novoProntuario.email,
          senhaHash,
          nome: novoProntuario.nome,
          perfil: 'COM',
        });

        await enviarEmailBoasVindas(novoProntuario.email, novoProntuario.nome, senhaProvisoria, novoProntuario.cpf);
      }
    }

    return novoProntuario;
  } catch (error: any) {
    console.error('Erro ao criar prontuário:', error);
    let msg = error.message;
    if (error.code === '23505') {
      if (error.constraint === 'prontuario_cpf_key') {
        msg = 'Este CPF já possui um acolhimento registrado.';
      } else if (error.constraint === 'usuarios_email_key') {
        msg = 'Este e-mail já está cadastrado por outro usuário.';
      } else if (error.constraint === 'usuarios_matricula_key') {
        msg = 'Esta matrícula/CPF já está cadastrada por outro usuário.';
      } else {
        msg = 'Cadastro duplicado: um registro com estes dados já existe.';
      }
    }
    throw new ErroDeNegocio(400, { error: msg });
  }
}

/**
 * Lista prontuários com paginação (`?pagina=&tamanho=`, teto de 100 por página).
 * ATE enxerga só os prontuários do próprio aluno (ou sem aluno responsável).
 * COO e PRO mantêm leitura ampla nesta sprint — a tabela `usuarios` não tem
 * coluna de clínica, então não dá pra restringir mais que isso. Não improvise
 * filtro por nome de clínica.
 */
export async function listarProntuarios(
  perfil: string | undefined,
  usuarioId: number | undefined,
  paginaRaw: unknown,
  tamanhoRaw: unknown,
): Promise<ListaProntuarios> {
  const pagina = Math.max(1, parseInt(String(paginaRaw ?? '1'), 10) || 1);
  const tamanho = Math.min(
    TAMANHO_MAXIMO,
    Math.max(1, parseInt(String(tamanhoRaw ?? String(TAMANHO_PADRAO)), 10) || TAMANHO_PADRAO),
  );

  const opcoes: prontuarioRepository.OpcoesListagem =
    perfil === 'ATE' && usuarioId !== undefined
      ? { alunoId: usuarioId, pagina, tamanho }
      : { pagina, tamanho };
  const { linhas, total } = await prontuarioRepository.listarComEscopo(opcoes);

  return {
    dados: linhas,
    paginacao: {
      pagina,
      tamanho,
      total,
      totalPaginas: Math.ceil(total / tamanho),
    },
  };
}

export async function buscarProntuarioPorId(
  id: string,
  perfil: string | undefined,
  usuarioId: number | undefined,
  matriculaSolicitante: string | undefined,
): Promise<any> {
  const prontuario = await prontuarioRepository.buscarPorId(id);
  if (!prontuario) {
    throw new ErroDeNegocio(404, { message: 'Nao encontrado' });
  }

  // RBAC §4 — escopo de visibilidade.
  // COM: apenas o próprio registro (usuário COM é criado com matricula = cpf).
  if (perfil === 'COM' && prontuario.cpf !== matriculaSolicitante) {
    throw new ErroDeNegocio(404, { message: 'Nao encontrado' });
  }

  // ATE: prontuários próprios e registros legados sem aluno responsável.
  if (perfil === 'ATE' && prontuario.alunoId !== null && Number(prontuario.alunoId) !== Number(usuarioId)) {
    throw new ErroDeNegocio(404, { message: 'Nao encontrado' });
  }

  // COO e PRO: leitura ampla nesta sprint. A tabela `usuarios` não tem coluna de
  // clínica, então o escopo por clínica (RBAC §4) depende de migration e entra na
  // Sprint 2. Não improvise filtro por nome de clínica.
  return prontuario;
}

export async function buscarMeuProntuario(matricula: string | undefined): Promise<any> {
  if (!matricula) {
    throw new ErroDeNegocio(400, { message: 'Matrícula não encontrada no token.' });
  }

  const prontuario = await prontuarioRepository.buscarPorCpf(matricula);
  if (!prontuario) {
    throw new ErroDeNegocio(404, { message: 'Prontuário não encontrado para este usuário.' });
  }

  return prontuario;
}

export async function alterarStatusProntuario(
  id: string,
  perfil: string | undefined,
  usuarioId: number | undefined,
  statusRaw: unknown,
): Promise<any> {
  const statusPermitidos = STATUS_POR_PERFIL[perfil ?? ''];

  // Perfil sem entrada no mapa não altera status por esta rota.
  if (!statusPermitidos) {
    throw new ErroDeNegocio(403, {
      error: { code: 'AUTH_060', message: 'Você não tem permissão para acessar este recurso.' },
    });
  }

  if (typeof statusRaw !== 'string' || !statusPermitidos.has(statusRaw)) {
    throw new ErroDeNegocio(400, { error: { code: 'PRONT_003', message: 'Status inválido.' } });
  }

  if (perfil === 'ATE') {
    const temAcesso = await prontuarioRepository.existeParaAluno(id, usuarioId!);
    if (!temAcesso) {
      throw new ErroDeNegocio(404, { message: 'Nao encontrado' });
    }
  }

  const atualizado = await prontuarioRepository.atualizarStatus(id, statusRaw);
  if (!atualizado) {
    throw new ErroDeNegocio(404, { message: 'Nao encontrado' });
  }
  return atualizado;
}

export async function atualizarProntuarioPorId(id: string, bodyCamel: Record<string, unknown>): Promise<any> {
  const dataFiltrada = prontuarioRepository.toSnake(bodyCamel);
  if (Object.keys(dataFiltrada).length === 0) {
    throw new ErroDeNegocio(400, { error: { code: 'PRONT_002', message: 'Nenhum campo válido para atualização.' } });
  }

  const atualizado = await prontuarioRepository.atualizarPorId(id, bodyCamel);
  if (!atualizado) {
    throw new ErroDeNegocio(404, { message: 'Nao encontrado' });
  }
  return atualizado;
}

export async function validarProntuario(id: string, feedback: unknown): Promise<any> {
  const atualizado = await prontuarioRepository.validar(id, (feedback as string) || null);
  if (!atualizado) {
    throw new ErroDeNegocio(404, { message: 'Prontuário não encontrado.' });
  }
  return atualizado;
}

export async function devolverProntuario(id: string, feedback: unknown): Promise<any> {
  const atualizado = await prontuarioRepository.devolver(id, (feedback as string) || null);
  if (!atualizado) {
    throw new ErroDeNegocio(404, { message: 'Prontuário não encontrado.' });
  }
  return atualizado;
}
