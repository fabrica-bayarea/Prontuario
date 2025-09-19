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
exports.CreateTiposAtendimentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTiposAtendimentoDto {
    nome;
    sigla;
    descricao;
    publicoAlvo;
    duracao;
    frequencia;
    visibilidade;
    instrucoesAluno;
    orientacoesPublicas;
    programaId;
    status;
}
exports.CreateTiposAtendimentoDto = CreateTiposAtendimentoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Atendimento Psicológico' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PSICO' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "sigla", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Atendimento psicológico voltado para adultos.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Adultos e adolescentes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "publicoAlvo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTiposAtendimentoDto.prototype, "duracao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Semanal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "frequencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aluno e Beneficiário', enum: ['Aluno e Beneficiário', 'Somente Aluno', 'Somente Coordenador'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Aluno e Beneficiário', 'Somente Aluno', 'Somente Coordenador']),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "visibilidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Compareça 10 minutos antes.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "instrucoesAluno", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Leve documento com foto.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "orientacoesPublicas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "programaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ativo', enum: ['ativo', 'inativo'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['ativo', 'inativo']),
    __metadata("design:type", String)
], CreateTiposAtendimentoDto.prototype, "status", void 0);
//# sourceMappingURL=create-tipos-atendimento.dto.js.map