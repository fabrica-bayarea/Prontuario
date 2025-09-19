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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../services/auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const is_enable_oauth_guard_1 = require("../guards/is-enable-oauth.guard");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    configService;
    authService;
    logger;
    constructor(configService, authService, logger) {
        this.configService = configService;
        this.authService = authService;
        this.logger = logger;
    }
    SignUp(dto) {
        try {
            return this.authService.signUp(dto);
        }
        catch (error) {
            this.logger.error('Erro ao tentar realizar registro:', error.message);
        }
    }
    SignIn(dto) {
        try {
            return this.authService.signIn(dto);
        }
        catch (error) {
            this.logger.error('Erro ao tentar realizar Login:', error.message);
        }
    }
    async googleAuth() {
    }
    async googleAuthRedirect({ user }, res) {
        try {
            const accessToken = await this.authService.signInWithProvider('google', {
                ...user,
                providerId: user.googleId,
            });
            if (accessToken) {
                return res
                    .cookie('auth-token', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                })
                    .redirect(`${this.configService.get('BASE_URL_UI')}/dashboard`);
            }
            throw new Error('Invalid authentication result');
        }
        catch (error) {
            this.logger.error('Erro no callback do Google:', error.message);
            return res.redirect(`${this.configService.get('BASE_URL_UI')}/auth/error?message=google_login_failed`);
        }
    }
    async microsoftAuth() {
    }
    async microsoftAuthRedirect({ user }, res) {
        try {
            const accessToken = await this.authService.signInWithProvider('microsoft', { ...user, providerId: user.microsoftId });
            if (accessToken) {
                return res
                    .cookie('auth-token', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                })
                    .redirect(`${this.configService.get('BASE_URL_UI')}/dashboard`);
            }
            throw new Error('Invalid authentication result');
        }
        catch (error) {
            this.logger.error('Erro no callback do Microsoft:', error.message);
            return res.redirect(`${this.configService.get('BASE_URL_UI')}/auth/error?message=microsoft_login_failed`);
        }
    }
    async loginAdmin(dto) {
        try {
            return this.authService.adminSignIn(dto);
        }
        catch (error) {
            this.logger.error('Erro ao tentar login admin:', error.message);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Cadastra um novo Usuário',
        description: 'Cria um novo usuário e o grava no banco de dados.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuário cadastrado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Credenciais tomadas' }),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignUpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "SignUp", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Autenticação de usuário',
        description: 'Realiza a autenticação do usuário e retorna um token de acesso para utilização no sistema.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuário autenticado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Credenciais inválidas' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignInDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "SignIn", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar autenticação com Google' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redireciona para a página de login do Google',
    }),
    (0, common_1.UseGuards)((0, is_enable_oauth_guard_1.IsEnabledAuthGuard)('google', 'ENABLE_GOOGLE_OAUTH')),
    (0, common_1.Get)('google'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Callback do Google após autenticação' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login do Google bem-sucedido' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, is_enable_oauth_guard_1.IsEnabledAuthGuard)('google', 'ENABLE_GOOGLE_OAUTH')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar autenticação com Microsoft' }),
    (0, swagger_1.ApiResponse)({
        status: 302,
        description: 'Redireciona para a página de login da Microsoft',
    }),
    (0, common_1.Get)('microsoft'),
    (0, common_1.UseGuards)((0, is_enable_oauth_guard_1.IsEnabledAuthGuard)('microsoft', 'ENABLE_MICROSOFT_OAUTH')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "microsoftAuth", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Callback da Microsoft após autenticação' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login da Microsoft bem-sucedido' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    (0, common_1.Get)('microsoft/callback'),
    (0, common_1.UseGuards)((0, is_enable_oauth_guard_1.IsEnabledAuthGuard)('microsoft', 'ENABLE_MICROSOFT_OAUTH')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "microsoftAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Autenticação de admin',
        description: 'Realiza o login de um administrador e retorna um token.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin autenticado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Credenciais de admin inválidas' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AdmSignIn]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAdmin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Operações de Autenticação'),
    (0, common_1.Controller)({ path: 'auth', version: '1' }),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService,
        common_1.Logger])
], AuthController);
//# sourceMappingURL=auth.controller.js.map