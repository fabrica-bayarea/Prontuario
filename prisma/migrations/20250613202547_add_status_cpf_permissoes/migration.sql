/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `coordenador` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "coordenador" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "permissoes" JSONB,
ADD COLUMN     "status" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "coordenador_cpf_key" ON "coordenador"("cpf");
