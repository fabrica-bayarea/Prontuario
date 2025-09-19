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
exports.TiposAtendimentoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../services/prisma.service");
let TiposAtendimentoService = class TiposAtendimentoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTiposAtendimentoDto) {
        console.log('Dados recebidos:', createTiposAtendimentoDto);
        const visibilidadeEnum = createTiposAtendimentoDto.visibilidade;
        const created = await this.prisma.tipoAtendimento.create({
            data: {
                nome: createTiposAtendimentoDto.nome,
                sigla: createTiposAtendimentoDto.sigla,
                descricao: createTiposAtendimentoDto.descricao,
                publico: createTiposAtendimentoDto.publicoAlvo,
                duracao: createTiposAtendimentoDto.duracao,
                frequencia: createTiposAtendimentoDto.frequencia,
                visibilidade: visibilidadeEnum,
                instrucoesAluno: createTiposAtendimentoDto.instrucoesAluno,
                orientacoesPublicas: createTiposAtendimentoDto.orientacoesPublicas,
                programaId: createTiposAtendimentoDto.programaId,
                status: createTiposAtendimentoDto.status,
            },
        });
        console.log('Criado:', created);
        return created;
    }
    findAll() {
        return `This action returns all tiposAtendimento`;
    }
    findOne(id) {
        return `This action returns a #${id} tiposAtendimento`;
    }
    update(id, updateTiposAtendimentoDto) {
        return `This action updates a #${id} tiposAtendimento`;
    }
    remove(id) {
        return `This action removes a #${id} tiposAtendimento`;
    }
};
exports.TiposAtendimentoService = TiposAtendimentoService;
exports.TiposAtendimentoService = TiposAtendimentoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TiposAtendimentoService);
//# sourceMappingURL=tipos-atendimento.service.js.map