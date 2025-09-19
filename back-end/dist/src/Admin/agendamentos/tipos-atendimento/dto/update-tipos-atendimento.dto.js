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
exports.UpdateTiposAtendimentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tipos_atendimento_dto_1 = require("./create-tipos-atendimento.dto");
const class_validator_1 = require("class-validator");
class UpdateTiposAtendimentoDto extends (0, swagger_1.PartialType)(create_tipos_atendimento_dto_1.CreateTiposAtendimentoDto) {
    nome;
    descricao;
    duracao;
    publico;
}
exports.UpdateTiposAtendimentoDto = UpdateTiposAtendimentoDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTiposAtendimentoDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTiposAtendimentoDto.prototype, "descricao", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateTiposAtendimentoDto.prototype, "duracao", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTiposAtendimentoDto.prototype, "publico", void 0);
//# sourceMappingURL=update-tipos-atendimento.dto.js.map