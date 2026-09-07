import { Request } from 'express';
import database from '../config/Database';

type TipoLog =
  | 'LOGIN_SUCESSO' | 'LOGIN_FALHA' | 'LOGOUT'
  | 'TOKEN_EXPIRADO' | 'SENHA_RECUPERADA' | 'SENHA_REDEFINIDA'
  | 'PRIMEIRO_ACESSO' | 'CONTA_BLOQUEADA' | 'CONTA_DESBLOQUEADA'
  | 'ACESSO_NEGADO' | 'LOGIN_BLOQUEADO';

export function obterIpRequisicao(req: Request): string {
  return (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
}

export async function registrarLog(
  tipo: TipoLog,
  usuarioId: number | null,
  req: Request,
  detalhes?: Record<string, unknown>
): Promise<void> {
  try {
    const ip = obterIpRequisicao(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const pool = database.getPool();
    await pool.query(
      `INSERT INTO logs_acesso (usuario_id, tipo, ip, user_agent, detalhes)
       VALUES ($1, $2, $3, $4, $5)`,
      [usuarioId, tipo, ip, userAgent, JSON.stringify(detalhes || {})]
    );
  } catch (error) {
    console.error('Falha ao registrar log de acesso:', error);
    // Silencia — log NUNCA deve quebrar o fluxo principal
  }
}
