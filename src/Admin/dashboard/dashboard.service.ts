import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service'; // ajuste o caminho conforme sua estrutura

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDadosDashboard() {
    // Exemplo básico, adaptando com seus dados do schema Prisma
    const cursos = await this.prisma.curso.count();
    // Você pode criar queries para outras informações que quiser
    // Por exemplo, contar usuários, pendências, etc, conforme seu schema e necessidade

    return {
      cursos,
      // Exemplo fixo (substitua por dados reais quando criar tabelas correspondentes)
      programas: 32,
      usuarios: 158,
      atendimentosMes: 276,
      pendencias: [
        "5 alunos aguardando aprovação",
        "12 beneficiários pendentes"
      ],
      notificacoes: [
        "Novo curso adicionado por Maria Souza",
        "Sistema em manutenção dia 05/05 às 20h"
      ],
      graficoCursos: {
        labels: ["Psicologia", "Nutrição", "Direito", "Odontologia"],
        values: [78, 65, 52, 40]
      },
      graficoBeneficiarios: {
        labels: ["Aprovados", "Pendentes"],
        values: [160, 40]
      }
    };
  }
}
