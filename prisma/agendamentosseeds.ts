import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.programa.createMany({
    data: [
      { nome: "Programa Saúde" },
      { nome: "Programa Social" },
      { nome: "Programa Educação" },
    ],
    skipDuplicates: true,
  });

  await prisma.tipoAtendimento.createMany({
    data: [
      { nome: "Psicológico" },
      { nome: "Assistência Social" },
      { nome: "Orientação Profissional" },
    ],
    skipDuplicates: true,
  });

  await prisma.aluno.createMany({
    data: [
      { nome: "João da Silva" },
      { nome: "Maria Souza" },
      { nome: "Carlos Alberto" },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
