import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

type Perfil = 'ADM' | 'COO' | 'PRO' | 'ATE' | 'COM';

export function rbacMiddleware(perfisPermitidos: Perfil[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: { code: 'AUTH_010', message: 'Não autenticado.' } });
      return;
    }

    if (!perfisPermitidos.includes(req.user.perfil)) {
      res.status(403).json({ error: { code: 'AUTH_060', message: 'Você não tem permissão para acessar este recurso.' } });
      return;
    }

    next();
  };
}
