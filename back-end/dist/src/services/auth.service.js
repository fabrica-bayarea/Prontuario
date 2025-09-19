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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("./prisma.service");
const library_1 = require("@prisma/client/runtime/library");
const argon2 = require("argon2");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async generateJwt(user, rememberMe = false) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            userName: user.userName,
            isAdmin: user.isAdmin ?? false,
        };
        return {
            accessToken: this.jwtService.sign(payload, {
                expiresIn: rememberMe ? '30d' : '1d',
                algorithm: 'HS256',
            }),
        };
    }
    async hashPassword(password) {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });
    }
    async findOrCreateUser(data, provider) {
        let user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    userName: data.userName,
                    passwordHash: provider === 'local' ? data.password : data.providerId,
                    providerId: provider === 'local' ? null : data.providerId,
                    role: 'ADMIN',
                    authProvider: provider,
                },
            });
        }
        return user;
    }
    handleSignUpError(error) {
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ForbiddenException('Email ou nome de usuário já estão em uso');
        }
        throw new common_1.BadRequestException('Erro ao criar usuário');
    }
    async signUp(dto) {
        const hashedPassword = await this.hashPassword(dto.password);
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (user) {
            throw new common_1.ForbiddenException('Email já cadastrado');
        }
        try {
            const user = await this.findOrCreateUser({ ...dto, password: hashedPassword }, 'local');
            return this.generateJwt(user);
        }
        catch (error) {
            this.handleSignUpError(error);
        }
    }
    async signIn(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        const isInvalidCredentials = !user ||
            !user.passwordHash ||
            user.authProvider !== 'local' ||
            !(await argon2.verify(user.passwordHash, dto.password));
        if (isInvalidCredentials) {
            throw new common_1.ForbiddenException('Credenciais inválidas');
        }
        return this.generateJwt(user, dto.rememberMe);
    }
    async signInWithProvider(provider, req) {
        if (!req.email) {
            throw new common_1.ForbiddenException(`No user from ${provider}`);
        }
        const user = await this.findOrCreateUser(req, provider);
        return this.generateJwt(user);
    }
    async adminSignIn(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        const isInvalidCredentials = !user ||
            !user.passwordHash ||
            user.authProvider !== 'local' ||
            !(await argon2.verify(user.passwordHash, dto.password)) ||
            !user.isAdmin;
        if (isInvalidCredentials) {
            throw new common_1.ForbiddenException('Credenciais de administrador inválidas');
        }
        return this.generateJwt(user, dto.rememberMe);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map