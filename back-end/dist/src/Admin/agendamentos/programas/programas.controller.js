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
exports.ProgramasController = void 0;
const common_1 = require("@nestjs/common");
const programas_service_1 = require("./programas.service");
const create_programa_dto_1 = require("./dto/create-programa.dto");
const update_programa_dto_1 = require("./dto/update-programa.dto");
let ProgramasController = class ProgramasController {
    programasService;
    constructor(programasService) {
        this.programasService = programasService;
    }
    create(createProgramaDto) {
        return this.programasService.create(createProgramaDto);
    }
    findAll() {
        return this.programasService.findAll();
    }
    findOne(id) {
        return this.programasService.findOne(+id);
    }
    update(id, updateProgramaDto) {
        return this.programasService.update(+id, updateProgramaDto);
    }
    remove(id) {
        return this.programasService.remove(+id);
    }
};
exports.ProgramasController = ProgramasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_programa_dto_1.CreateProgramaDto]),
    __metadata("design:returntype", void 0)
], ProgramasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProgramasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_programa_dto_1.UpdateProgramaDto]),
    __metadata("design:returntype", void 0)
], ProgramasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgramasController.prototype, "remove", null);
exports.ProgramasController = ProgramasController = __decorate([
    (0, common_1.Controller)('programas'),
    __metadata("design:paramtypes", [programas_service_1.ProgramasService])
], ProgramasController);
//# sourceMappingURL=programas.controller.js.map