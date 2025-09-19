export declare class SignUpDto {
    name: string;
    userName: string;
    email: string;
    password: string;
}
export declare class SignInDto {
    email: string;
    password: string;
    rememberMe: boolean;
}
export declare class GenerateAuthTokenDto {
    accessToken: string;
    expiresIn: string;
    createdAt: string;
}
export declare class UserInfoDto {
    id: number;
    fullName: string;
    userName: string;
    email: string;
}
export declare class SignResponseJwtDto {
    access: GenerateAuthTokenDto;
    user: UserInfoDto;
}
export declare class AdmSignIn {
    email: string;
    password: string;
    rememberMe: boolean;
}
