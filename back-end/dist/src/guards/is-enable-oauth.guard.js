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
exports.IsEnabledAuthGuard = IsEnabledAuthGuard;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
function IsEnabledAuthGuard(strategyName, configKey) {
    var Guard_1;
    let Guard = Guard_1 = class Guard {
        configService;
        logger = new common_1.Logger(Guard_1.name + ':' + strategyName);
        constructor(configService) {
            this.configService = configService;
        }
        canActivate(context) {
            const isEnabled = this.configService.get(configKey) === 'true';
            if (!isEnabled) {
                this.logger.warn(`Attempted to use disabled authentication method: ${strategyName}`);
                throw new common_1.ServiceUnavailableException(`Authentication method '${strategyName}' is currently disabled.`);
            }
            const passportAuthGuard = new ((0, passport_1.AuthGuard)(strategyName))();
            return passportAuthGuard.canActivate(context);
        }
    };
    Guard = Guard_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [config_1.ConfigService])
    ], Guard);
    return (0, common_1.mixin)(Guard);
}
//# sourceMappingURL=is-enable-oauth.guard.js.map