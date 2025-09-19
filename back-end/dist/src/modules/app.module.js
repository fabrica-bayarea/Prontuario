"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("../controllers/app.controller");
const app_service_1 = require("../services/app.service");
const auth_module_1 = require("./auth.module");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma.module");
const dashboard_module_1 = require("../Admin/dashboard/dashboard.module");
const coordenador_module_1 = require("../Admin/coordenadores/coordenador.module");
const agendamentos_module_1 = require("../Admin/agendamentos/agendamentos.module");
const programas_module_1 = require("../Admin/agendamentos/programas/programas.module");
const tipos_atendimento_module_1 = require("../Admin/agendamentos/tipos-atendimento/tipos-atendimento.module");
const escalas_module_1 = require("../Admin/agendamentos/escalas/escalas.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [dashboard_module_1.DashboardModule,
            coordenador_module_1.CoordenadoresModule,
            agendamentos_module_1.AgendamentosModule,
            programas_module_1.ProgramasModule,
            tipos_atendimento_module_1.TiposAtendimentoModule,
            escalas_module_1.EscalasModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule.register(),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map