import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { registrarLog } from '../helpers/logHelper';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET não definido no .env');
  process.exit(1);
}

export interface JwtPayload {
  sub: number;
  matricula: string;
  perfil: 'ADM' | 'COO' | 'PRO' | 'ATE' | 'COM';
  tipo?: string; // presente apenas em tokens temporários
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: { code: 'AUTH_010', message: 'Token não fornecido.' } });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: { code: 'AUTH_010', message: 'Formato de token inválido.' } });
    return;
  }

  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET!) as JwtPayload;

    // BLOQUEAR tokens temporários de primeiro acesso em rotas normais
    if (decoded.tipo === 'PRIMEIRO_ACESSO') {
      res.status(401).json({ error: { code: 'AUTH_010', message: 'Token temporário não permitido nesta rota.' } });
      return;
    }

    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      registrarLog('TOKEN_EXPIRADO', null, req);
      res.status(401).json({ error: { code: 'AUTH_012', message: 'Sessão expirada. Faça login novamente.' } });
    } else {
      res.status(401).json({ error: { code: 'AUTH_010', message: 'Token inválido.' } });
    }
  }
}
