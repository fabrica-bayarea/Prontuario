"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramasModule = void 0;
const common_1 = require("@nestjs/common");
const programas_service_1 = require("./programas.service");
const programas_controller_1 = require("./programas.controller");
const prisma_service_1 = require("../../../services/prisma.service");
let ProgramasModule = class ProgramasModule {
};
exports.ProgramasModule = ProgramasModule;
exports.ProgramasModule = ProgramasModule = __decorate([
    (0, common_1.Module)({
        controllers: [programas_controller_1.ProgramasController],
        providers: [programas_service_1.ProgramasService, prisma_service_1.PrismaService],
        exports: [programas_service_1.ProgramasService],
    })
], ProgramasModule);
//# sourceMappingURL=programas.module.js.map