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
exports.MicrosoftStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_microsoft_1 = require("passport-microsoft");
const config_1 = require("@nestjs/config");
let MicrosoftStrategy = class MicrosoftStrategy extends (0, passport_1.PassportStrategy)(passport_microsoft_1.Strategy, 'microsoft') {
    configService;
    constructor(configService) {
        super({
            clientID: configService.get('MICROSOFT_CLIENT_ID'),
            clientSecret: configService.get('MICROSOFT_CLIENT_SECRET'),
            callbackURL: 'http://localhost:3000/v1/auth/microsoft/callback',
            scope: ['user.read'],
            tenant: 'common',
            passReqToCallback: true,
        });
        this.configService = configService;
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        if (!profile || !profile.displayName || !profile.emails || !profile.id) {
            return done(new Error('Perfil da Microsoft está incompleto ou inválido'), false);
        }
        const user = {
            microsoftId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            accessToken,
        };
        done(null, user);
    }
};
exports.MicrosoftStrategy = MicrosoftStrategy;
exports.MicrosoftStrategy = MicrosoftStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MicrosoftStrategy);
//# sourceMappingURL=microsoft.strategy.js.map