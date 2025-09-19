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
exports.CreateCoordenadorDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const permissoes_dto_1 = require("./permissoes.dto");
class CreateCoordenadorDto {
    nome;
    email;
    telefone;
    cpf;
    status;
    cursos;
    permissoes;
}
exports.CreateCoordenadorDto = CreateCoordenadorDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'João Silva' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCoordenadorDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'joao@iesb.br' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateCoordenadorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '61999999999', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCoordenadorDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '000.000.000-00', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCoordenadorDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ativo', enum: ['Ativo', 'Inativo'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Ativo', 'Inativo']),
    __metadata("design:type", String)
], CreateCoordenadorDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Engenharia', 'ADS'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCoordenadorDto.prototype, "cursos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => permissoes_dto_1.PermissoesDto,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateCoordenadorDto.prototype, "permissoes", void 0);
//# sourceMappingURL=criar-coordenadores.dto.js.map