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
exports.AdmSignIn = exports.SignResponseJwtDto = exports.UserInfoDto = exports.GenerateAuthTokenDto = exports.SignInDto = exports.SignUpDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SignUpDto {
    name;
    userName;
    email;
    password;
}
exports.SignUpDto = SignUpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'first name last name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Preencha o campo de nome completo' }),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'username' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Preencha o campo de nome de usuario' }),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'username@gmail.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Preencha o campo de email' }),
    (0, class_validator_1.IsString)({ message: 'O email deve ser uma string' }),
    __metadata("design:type", String)
], SignUpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senha123!' }),
    (0, class_validator_1.IsString)({ message: 'A senha deve ser uma string' }),
    (0, class_validator_1.IsStrongPassword)({}, {
        message: 'Senha deve ter 8 caracteres, 1 especial, 1 número e uma letra maiúscula'
    }),
    __metadata("design:type", String)
], SignUpDto.prototype, "password", void 0);
class SignInDto {
    email;
    password;
    rememberMe;
}
exports.SignInDto = SignInDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'username@gmail.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'deve ser no modelo de email' }),
    __metadata("design:type", String)
], SignInDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senha123!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'preencha com sua senha' }),
    (0, class_validator_1.IsString)({ message: 'senha deve ser uma string' }),
    __metadata("design:type", String)
], SignInDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)({ message: 'deve ser um booleano' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'preencha o campo de lembrar de mim' }),
    __metadata("design:type", Boolean)
], SignInDto.prototype, "rememberMe", void 0);
class GenerateAuthTokenDto {
    accessToken;
    expiresIn;
    createdAt;
}
exports.GenerateAuthTokenDto = GenerateAuthTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O token de acesso não pode estar vazio' }),
    (0, class_validator_1.IsString)({ message: 'O token de acesso deve ser uma string' }),
    __metadata("design:type", String)
], GenerateAuthTokenDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3600' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O tempo de expiração não pode estar vazio' }),
    (0, class_validator_1.IsString)({ message: 'O tempo de expiração deve ser uma string' }),
    __metadata("design:type", String)
], GenerateAuthTokenDto.prototype, "expiresIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: new Date().toISOString() }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data de criação não pode estar vazia' }),
    __metadata("design:type", String)
], GenerateAuthTokenDto.prototype, "createdAt", void 0);
class UserInfoDto {
    id;
    fullName;
    userName;
    email;
}
exports.UserInfoDto = UserInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O id não pode estar vazio' }),
    (0, class_validator_1.IsNumber)({}, { message: 'O id deve ser um número' }),
    __metadata("design:type", Number)
], UserInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'first name last name' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Preencha o campo de nome completo' }),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string' }),
    __metadata("design:type", String)
], UserInfoDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'username' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Preencha o campo de nome de usuario' }),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string' }),
    __metadata("design:type", String)
], UserInfoDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'example@gmail.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'O email deve ser válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O email não pode estar vazio' }),
    __metadata("design:type", String)
], UserInfoDto.prototype, "email", void 0);
class SignResponseJwtDto {
    access;
    user;
}
exports.SignResponseJwtDto = SignResponseJwtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: GenerateAuthTokenDto }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Os dados de acesso não podem estar vazios' }),
    __metadata("design:type", GenerateAuthTokenDto)
], SignResponseJwtDto.prototype, "access", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserInfoDto }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Os dados do usuário não podem estar vazios' }),
    __metadata("design:type", UserInfoDto)
], SignResponseJwtDto.prototype, "user", void 0);
class AdmSignIn {
    email;
    password;
    rememberMe;
}
exports.AdmSignIn = AdmSignIn;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@teste.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'deve ser no modelo de email' }),
    __metadata("design:type", String)
], AdmSignIn.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin123!' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'preencha com sua senha' }),
    (0, class_validator_1.IsString)({ message: 'senha deve ser uma string' }),
    __metadata("design:type", String)
], AdmSignIn.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)({ message: 'deve ser um booleano' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'preencha o campo de lembrar de mim' }),
    __metadata("design:type", Boolean)
], AdmSignIn.prototype, "rememberMe", void 0);
//# sourceMappingURL=auth.dto.js.map