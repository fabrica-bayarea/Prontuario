/*
  Warnings:

  - Added the required column `visibilidade` to the `TipoAtendimento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Visibilidade" AS ENUM ('ALUNO_E_BENEFICIARIO', 'SOMENTE_ALUNO', 'SOMENTE_COORDENADOR');

-- AlterTable
ALTER TABLE "TipoAtendimento" ADD COLUMN     "visibilidade" "Visibilidade" NOT NULL;
