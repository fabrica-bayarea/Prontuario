import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

/**
 * Valida req.body contra o schema e substitui req.body pelo valor já parseado.
 * Campo não previsto no schema é descartado pelo próprio Zod.
 */
export function validar(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      res.status(400).json({
        error: {
          code: 'VAL_001',
          message: 'Dados inválidos.',
          details: resultado.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
      });
      return;
    }

    req.body = resultado.data;
    next();
  };
}
