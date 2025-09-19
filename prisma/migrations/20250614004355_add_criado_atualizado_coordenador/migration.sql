/*
  Warnings:

  - Added the required column `atualizadoEm` to the `coordenador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "coordenador" ADD COLUMN "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "coordenador" ADD COLUMN "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
