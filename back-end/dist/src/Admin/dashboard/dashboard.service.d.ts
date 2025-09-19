import { PrismaService } from 'src/services/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getDadosDashboard(): Promise<{
        cursos: number;
        programas: number;
        usuarios: number;
        atendimentosMes: number;
        pendencias: string[];
        notificacoes: string[];
        graficoCursos: {
            labels: string[];
            values: number[];
        };
        graficoBeneficiarios: {
            labels: string[];
            values: number[];
        };
    }>;
}
