-- CreateTable
CREATE TABLE "Programa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Programa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoAtendimento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoAtendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Programa_nome_key" ON "Programa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "TipoAtendimento_nome_key" ON "TipoAtendimento"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_nome_key" ON "Aluno"("nome");
