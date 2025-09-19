/*
  Warnings:

  - You are about to drop the column `createdAt` on the `TipoAtendimento` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TipoAtendimento` table. All the data in the column will be lost.
  - Added the required column `programaId` to the `TipoAtendimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `TipoAtendimento` table without a default value. This is not possible if the table is not empty.
  - Made the column `sigla` on table `TipoAtendimento` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TipoAtendimento" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "instrucoesAluno" TEXT,
ADD COLUMN     "orientacoesPublicas" TEXT,
ADD COLUMN     "programaId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "duracao" DROP NOT NULL,
ALTER COLUMN "sigla" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TipoAtendimento" ADD CONSTRAINT "TipoAtendimento_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "Programa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
