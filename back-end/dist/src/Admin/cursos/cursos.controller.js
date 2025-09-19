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
exports.CursosController = void 0;
const common_1 = require("@nestjs/common");
const cursos_service_1 = require("./cursos.service");
const create_curso_dto_1 = require("./dto/create-curso.dto");
const update_curso_dto_1 = require("./dto/update-curso.dto");
let CursosController = class CursosController {
    cursosService;
    constructor(cursosService) {
        this.cursosService = cursosService;
    }
    create(createCursoDto) {
        return this.cursosService.create(createCursoDto);
    }
    findAll() {
        return this.cursosService.findAll();
    }
    findOne(id) {
        return this.cursosService.findOne(+id);
    }
    update(id, updateCursoDto) {
        return this.cursosService.update(+id, updateCursoDto);
    }
    remove(id) {
        return this.cursosService.remove(+id);
    }
};
exports.CursosController = CursosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_curso_dto_1.CreateCursoDto]),
    __metadata("design:returntype", void 0)
], CursosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CursosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CursosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_curso_dto_1.UpdateCursoDto]),
    __metadata("design:returntype", void 0)
], CursosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CursosController.prototype, "remove", null);
exports.CursosController = CursosController = __decorate([
    (0, common_1.Controller)('cursos'),
    __metadata("design:paramtypes", [cursos_service_1.CursosService])
], CursosController);
//# sourceMappingURL=cursos.controller.js.map