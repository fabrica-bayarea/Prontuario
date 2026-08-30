import database from '../config/Database';

export interface UsuarioResumo {
  id: number;
  matricula: string;
  email: string;
  nome: string;
  perfil: string;
  ativo: boolean;
}

export interface UsuarioListado extends UsuarioResumo {
  primeiro_acesso: boolean;
  bloqueado_ate: Date | null;
  created_at: Date;
}

interface UsuarioBoasVindas {
  matricula: string;
  email: string;
  nome: string;
  primeiro_acesso: boolean;
}

export async function existePorMatriculaOuEmail(
  matricula: string,
  email: string,
): Promise<boolean> {
  const pool = database.getPool();
  const result = await pool.query(
    'SELECT id FROM usuarios WHERE matricula = $1 OR email = $2',
    [matricula, email]
  );
  return result.rows.length > 0;
}

export async function inserir(dados: {
  matricula: string;
  email: string;
  senhaHash: string;
  nome: string;
  perfil: string;
}): Promise<UsuarioResumo> {
  const pool = database.getPool();
  const { matricula, email, senhaHash, nome, perfil } = dados;
  const result = await pool.query(
    `INSERT INTO usuarios (matricula, email, senha_hash, nome, perfil, primeiro_acesso)
         VALUES ($1, $2, $3, $4, $5, true) RETURNING id, matricula, email, nome, perfil, ativo`,
    [matricula, email, senhaHash, nome, perfil]
  );
  return result.rows[0] as UsuarioResumo;
}

export async function listarTodos(): Promise<UsuarioListado[]> {
  const pool = database.getPool();
  const result = await pool.query(
    `SELECT id, matricula, email, nome, perfil, ativo, primeiro_acesso, bloqueado_ate, created_at 
         FROM usuarios 
         ORDER BY nome ASC`
  );
  return result.rows as UsuarioListado[];
}

export async function buscarPerfilPorId(id: string): Promise<string | null> {
  const pool = database.getPool();
  const result = await pool.query('SELECT perfil FROM usuarios WHERE id = $1', [id]);
  const usuario = result.rows[0] as { perfil: string } | undefined;
  return usuario?.perfil ?? null;
}

export async function atualizarAtivo(id: string, ativo: boolean): Promise<void> {
  const pool = database.getPool();
  await pool.query('UPDATE usuarios SET ativo = $1 WHERE id = $2', [ativo, id]);
}

export async function buscarParaBoasVindas(id: string): Promise<UsuarioBoasVindas | null> {
  const pool = database.getPool();
  const result = await pool.query(
    'SELECT matricula, email, nome, primeiro_acesso FROM usuarios WHERE id = $1',
    [id]
  );
  return (result.rows[0] as UsuarioBoasVindas | undefined) ?? null;
}

export async function atualizarSenhaHash(id: string, senhaHash: string): Promise<void> {
  const pool = database.getPool();
  await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);
}
