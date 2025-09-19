/*
  Warnings:

  - You are about to drop the `Coordenador` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Coordenador";

-- CreateTable
CREATE TABLE "coordenador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coordenador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coordenador_email_key" ON "coordenador"("email");
