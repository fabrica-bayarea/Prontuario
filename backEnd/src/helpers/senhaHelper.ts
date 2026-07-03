import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;
const SENHA_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validarPoliticaSenha(senha: string): string | null {
  if (!SENHA_REGEX.test(senha)) {
    return 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um número.';
  }
  return null; // null = válida
}

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, BCRYPT_ROUNDS);
}

export async function compararSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}
