import rateLimit from 'express-rate-limit';

const QUINZE_MINUTOS = 15 * 60 * 1000;

export const limiteGlobal = rateLimit({
  windowMs: QUINZE_MINUTOS,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: { code: 'HTTP_429', message: 'Muitas requisições. Tente novamente em alguns minutos.' },
  },
});

export const limiteAutenticacao = rateLimit({
  windowMs: QUINZE_MINUTOS,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: { code: 'HTTP_429', message: 'Muitas tentativas. Tente novamente em alguns minutos.' },
  },
});
