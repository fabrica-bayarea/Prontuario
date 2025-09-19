"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscalasService = void 0;
const common_1 = require("@nestjs/common");
let EscalasService = class EscalasService {
    create(createEscalaDto) {
        return 'This action adds a new escala';
    }
    findAll() {
        return `This action returns all escalas`;
    }
    findOne(id) {
        return `This action returns a #${id} escala`;
    }
    update(id, updateEscalaDto) {
        return `This action updates a #${id} escala`;
    }
    remove(id) {
        return `This action removes a #${id} escala`;
    }
};
exports.EscalasService = EscalasService;
exports.EscalasService = EscalasService = __decorate([
    (0, common_1.Injectable)()
], EscalasService);
//# sourceMappingURL=escalas.service.js.map