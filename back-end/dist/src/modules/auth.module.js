"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("../strategy/jwt.strategy");
const google_strategy_1 = require("../strategy/google.strategy");
const microsoft_strategy_1 = require("../strategy/microsoft.strategy");
const prisma_service_1 = require("../services/prisma.service");
const auth_service_1 = require("../services/auth.service");
const auth_controller_1 = require("../controllers/auth.controller");
let AuthModule = AuthModule_1 = class AuthModule {
    static register() {
        return {
            module: AuthModule_1,
            imports: [
                config_1.ConfigModule,
                passport_1.PassportModule,
                jwt_1.JwtModule.registerAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: async (configService) => ({
                        secret: configService.getOrThrow('JWT_SECRET'),
                        signOptions: { expiresIn: '1d' },
                    }),
                }),
            ],
            providers: [
                common_1.Logger,
                jwt_strategy_1.JwtStrategy,
                prisma_service_1.PrismaService,
                auth_service_1.AuthService,
                {
                    provide: 'OAUTH_STRATEGIES',
                    useFactory: (configService) => [
                        ...(configService.get('ENABLE_GOOGLE_OAUTH') === 'true' ? [new google_strategy_1.GoogleStrategy(configService)] : []),
                        ...(configService.get('ENABLE_MICROSOFT_OAUTH') === 'true' ? [new microsoft_strategy_1.MicrosoftStrategy(configService)] : []),
                    ],
                    inject: [config_1.ConfigService],
                },
            ],
            controllers: [auth_controller_1.AuthController],
            exports: [auth_service_1.AuthService, jwt_1.JwtModule],
        };
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = AuthModule_1 = __decorate([
    (0, common_1.Module)({})
], AuthModule);
//# sourceMappingURL=auth.module.js.map