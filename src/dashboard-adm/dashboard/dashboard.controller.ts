import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController { 

    @Get('graficos')
  getDadosDashboard() {
    return {
      cursos: 12,
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
