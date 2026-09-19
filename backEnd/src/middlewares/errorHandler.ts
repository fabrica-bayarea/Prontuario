import { Request, Response, NextFunction } from 'express';

export function rotaNaoEncontrada(req: Request, res: Response): void {
  res.status(404).json({
    error: { code: 'HTTP_404', message: 'Recurso não encontrado.' },
  });
}

// Assinatura de 4 parâmetros: é isso que faz o Express reconhecer como
// tratador de erro. Não remova o `_next` mesmo sem uso.
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = res.locals.requestId ?? 'sem-id';

  if (err?.type === 'entity.too.large') {
    res.status(413).json({
      error: { code: 'HTTP_413', message: 'Corpo da requisição excede o limite permitido.', requestId },
    });
    return;
  }
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: { code: 'HTTP_400', message: 'Corpo da requisição não é um JSON válido.', requestId },
    });
    return;
  }

  // A mensagem real só vai para o log. Nunca para o cliente (RNF-04).
  console.error(`[${requestId}] ${req.method} ${req.originalUrl}`, err);

  if (res.headersSent) return;

  res.status(500).json({
    error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId },
  });
}
