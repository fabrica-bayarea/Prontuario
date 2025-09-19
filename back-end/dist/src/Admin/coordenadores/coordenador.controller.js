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
exports.coordenadorController = exports.CoordenadorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coordenador_service_1 = require("./coordenador.service");
const criar_coordenadores_dto_1 = require("./dto/criar-coordenadores.dto");
const update_coordenadores_dto_1 = require("./dto/update-coordenadores.dto");
let CoordenadorController = class CoordenadorController {
    findAll() {
        return [{ id: 1, nome: 'João' }];
    }
};
exports.CoordenadorController = CoordenadorController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoordenadorController.prototype, "findAll", null);
exports.CoordenadorController = CoordenadorController = __decorate([
    (0, swagger_1.ApiTags)('Gerenciar Coordenadores'),
    (0, common_1.Controller)('coordenadores')
], CoordenadorController);
let coordenadorController = class coordenadorController {
    coordenadorService;
    constructor(coordenadorService) {
        this.coordenadorService = coordenadorService;
    }
    create(createCoordenadorDto) {
        return this.coordenadorService.create(createCoordenadorDto);
    }
    findAll() {
        return this.coordenadorService.findAll();
    }
    findOne(id) {
        return this.coordenadorService.findOne(id);
    }
    update(id, dto) {
        return this.coordenadorService.update(id, dto);
    }
    remove(id) {
        return this.coordenadorService.remove(id);
    }
};
exports.coordenadorController = coordenadorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_coordenadores_dto_1.CreateCoordenadorDto]),
    __metadata("design:returntype", void 0)
], coordenadorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], coordenadorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], coordenadorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_coordenadores_dto_1.UpdateCoordenadorDto]),
    __metadata("design:returntype", void 0)
], coordenadorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], coordenadorController.prototype, "remove", null);
exports.coordenadorController = coordenadorController = __decorate([
    (0, common_1.Controller)('admin/coordenadores'),
    __metadata("design:paramtypes", [coordenador_service_1.coordenadorService])
], coordenadorController);
//# sourceMappingURL=coordenador.controller.js.map