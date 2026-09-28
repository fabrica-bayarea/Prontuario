import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = crypto.randomUUID();
  res.locals.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
