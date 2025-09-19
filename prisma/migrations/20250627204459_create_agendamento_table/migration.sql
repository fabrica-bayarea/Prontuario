-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "beneficiario" TEXT NOT NULL,
    "programa" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "aluno" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "turno" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'agendado',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);
