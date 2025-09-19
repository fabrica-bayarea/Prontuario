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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposAtendimentoController = void 0;
const common_1 = require("@nestjs/common");
const tipos_atendimento_service_1 = require("./tipos-atendimento.service");
const create_tipos_atendimento_dto_1 = require("./dto/create-tipos-atendimento.dto");
const update_tipos_atendimento_dto_1 = require("./dto/update-tipos-atendimento.dto");
let TiposAtendimentoController = class TiposAtendimentoController {
    tiposAtendimentoService;
    constructor(tiposAtendimentoService) {
        this.tiposAtendimentoService = tiposAtendimentoService;
    }
    create(createTiposAtendimentoDto) {
        return this.tiposAtendimentoService.create(createTiposAtendimentoDto);
    }
    findAll() {
        return this.tiposAtendimentoService.findAll();
    }
    findOne(id) {
        return this.tiposAtendimentoService.findOne(+id);
    }
    update(id, updateTiposAtendimentoDto) {
        return this.tiposAtendimentoService.update(+id, updateTiposAtendimentoDto);
    }
    remove(id) {
        return this.tiposAtendimentoService.remove(+id);
    }
};
exports.TiposAtendimentoController = TiposAtendimentoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tipos_atendimento_dto_1.CreateTiposAtendimentoDto]),
    __metadata("design:returntype", void 0)
], TiposAtendimentoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TiposAtendimentoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposAtendimentoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tipos_atendimento_dto_1.UpdateTiposAtendimentoDto]),
    __metadata("design:returntype", void 0)
], TiposAtendimentoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposAtendimentoController.prototype, "remove", null);
exports.TiposAtendimentoController = TiposAtendimentoController = __decorate([
    (0, common_1.Controller)('tipos-atendimento'),
    __metadata("design:paramtypes", [tipos_atendimento_service_1.TiposAtendimentoService])
], TiposAtendimentoController);
//# sourceMappingURL=tipos-atendimento.controller.js.map