import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
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
