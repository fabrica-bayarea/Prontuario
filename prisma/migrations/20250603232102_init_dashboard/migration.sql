-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "cursos" INTEGER NOT NULL,
    "programas" INTEGER NOT NULL,
    "usuarios" INTEGER NOT NULL,
    "atendimentosMes" INTEGER NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pendencia" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "dashboardId" INTEGER NOT NULL,

    CONSTRAINT "Pendencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" SERIAL NOT NULL,
    "mensagem" TEXT NOT NULL,
    "dashboardId" INTEGER NOT NULL,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraficoCurso" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "dashboardId" INTEGER NOT NULL,

    CONSTRAINT "GraficoCurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraficoBeneficiario" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "dashboardId" INTEGER NOT NULL,

    CONSTRAINT "GraficoBeneficiario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordenador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coordenador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coordenador_email_key" ON "Coordenador"("email");

-- AddForeignKey
ALTER TABLE "Pendencia" ADD CONSTRAINT "Pendencia_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraficoCurso" ADD CONSTRAINT "GraficoCurso_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraficoBeneficiario" ADD CONSTRAINT "GraficoBeneficiario_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
