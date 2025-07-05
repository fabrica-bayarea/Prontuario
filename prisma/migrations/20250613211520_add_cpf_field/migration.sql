/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `coordenador` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `coordenador` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "coordenador_cpf_key";

-- DropIndex
DROP INDEX "coordenador_email_key";

-- AlterTable
ALTER TABLE "coordenador" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm";
