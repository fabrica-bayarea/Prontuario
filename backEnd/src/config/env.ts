import 'dotenv/config';

const OBRIGATORIAS = ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET'] as const;

const faltando = OBRIGATORIAS.filter((chave) => !process.env[chave]);

if (faltando.length > 0) {
  console.error(
    `FATAL: variáveis de ambiente obrigatórias ausentes: ${faltando.join(', ')}. ` +
    'Confira backEnd/.env — o template está em backEnd/.env.example.',
  );
  process.exit(1);
}

const producao = process.env.NODE_ENV === 'production';

function lerOrigens(): string[] {
  const bruto = (process.env.CORS_ORIGINS ?? '').trim();
  if (bruto) {
    return bruto.split(',').map((o) => o.trim()).filter(Boolean);
  }
  if (producao) {
    console.error('FATAL: CORS_ORIGINS é obrigatório quando NODE_ENV=production.');
    process.exit(1);
  }
  return ['http://localhost:5173', 'http://localhost'];
}

export const env = {
  producao,
  porta: Number(process.env.PORT) || 3001,
  origensPermitidas: lerOrigens(),
  poolMax: Number(process.env.DB_POOL_MAX) || 10,
};
