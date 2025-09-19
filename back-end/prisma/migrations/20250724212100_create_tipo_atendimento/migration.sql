/*
  Warnings:

  - Added the required column `curso` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Programa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracao` to the `TipoAtendimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TipoAtendimento` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Programa_nome_key";

-- DropIndex
DROP INDEX "TipoAtendimento_nome_key";

-- AlterTable
ALTER TABLE "Programa" ADD COLUMN     "assistentes" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "curso" TEXT NOT NULL,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "fim" TIMESTAMP(3),
ADD COLUMN     "inicio" TIMESTAMP(3),
ADD COLUMN     "sala" TEXT,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TipoAtendimento" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "duracao" INTEGER NOT NULL,
ADD COLUMN     "publico" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ProgramaAgendamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "ProgramaAgendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoAtendimentoAgendamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoAtendimentoAgendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Escala" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "turnos" TEXT[],
    "programaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Escala_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramaAgendamento_nome_key" ON "ProgramaAgendamento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "TipoAtendimentoAgendamento_nome_key" ON "TipoAtendimentoAgendamento"("nome");

-- AddForeignKey
ALTER TABLE "Escala" ADD CONSTRAINT "Escala_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "Programa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
