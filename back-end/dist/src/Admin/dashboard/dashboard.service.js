"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../services/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDadosDashboard() {
        const cursos = await this.prisma.curso.count();
        return {
            cursos,
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map