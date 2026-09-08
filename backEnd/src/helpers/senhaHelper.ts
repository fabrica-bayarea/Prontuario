import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const BCRYPT_ROUNDS = 12;
const SENHA_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// Hash de custo equivalente ao de um usuário real, usado no login quando a
// matrícula/e-mail informado não corresponde a ninguém. Comparar a senha
// recebida contra este hash (em vez de pular a comparação) mantém o tempo de
// resposta igual ao de um login com usuário existente, para a latência não
// denunciar se a conta é válida.
export const HASH_DESCARTAVEL = bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), BCRYPT_ROUNDS);

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
