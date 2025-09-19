/**
 * SEEDS.TS É O ARQUIVO TEMPORÁRIO PARA A CRIAÇÃO DO ADMIN E SUAS CREDENCIAIS NO POSTGRES. EXECUÇÃO ÚNICA.
 * 
 * Com o postgres rodando, basta rodar o comando npx ts-node prisma/seed.ts e depois verificar no prisma studio (npx run prisma studio).
 * 
 * No prisma studio, deve-se ativar o campo 'isAdmin'
 */

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Adm123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@teste.com' },
    update: {},
    create: {
        userName: 'admin',
      email: 'admin@teste.com',
      name: 'Administrador',
      passwordHash,
      authProvider: 'local',
      role: 'ADMIN',
    },
  });

  console.log('Admin criado:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
