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
exports.coordenadorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../services/prisma.service");
let coordenadorService = class coordenadorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCoordenadorDto) {
        const telefone = createCoordenadorDto.telefone ?? null;
        return this.prisma.coordenador.create({
            data: {
                nome: createCoordenadorDto.nome,
                email: createCoordenadorDto.email,
                telefone: telefone,
                cpf: createCoordenadorDto.cpf ?? null,
                status: createCoordenadorDto.status ?? null,
                cursos: createCoordenadorDto.cursos ?? [],
                permissoes: createCoordenadorDto.permissoes
            },
        });
    }
    async findAll() {
        return this.prisma.coordenador.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                cpf: true,
                cursos: true,
                status: true,
                permissoes: true,
                criadoEm: true,
                atualizadoEm: true,
            },
        });
    }
    async findOne(id) {
        const coordenador = await this.prisma.coordenador.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
                cpf: true,
                cursos: true,
                status: true,
                permissoes: true,
                criadoEm: true,
                atualizadoEm: true,
            },
        });
        if (!coordenador) {
            throw new common_1.NotFoundException(`coordenador com ID ${id} não encontrado`);
        }
        return coordenador;
    }
    async update(id, updateCoordenadorDto) {
        await this.findOne(id);
        console.log(updateCoordenadorDto);
        return this.prisma.coordenador.update({
            where: { id },
            data: {
                nome: updateCoordenadorDto.nome,
                email: updateCoordenadorDto.email,
                cpf: updateCoordenadorDto.cpf,
                status: updateCoordenadorDto.status,
                cursos: updateCoordenadorDto.cursos,
                permissoes: updateCoordenadorDto.permissoes,
                telefone: updateCoordenadorDto.telefone ?? null,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.coordenador.delete({ where: { id } });
    }
};
exports.coordenadorService = coordenadorService;
exports.coordenadorService = coordenadorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], coordenadorService);
//# sourceMappingURL=coordenador.service.js.map