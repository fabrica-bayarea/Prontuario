import { Logger } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { SignInDto, SignUpDto, AdmSignIn } from 'src/dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private configService;
    private authService;
    private logger;
    constructor(configService: ConfigService, authService: AuthService, logger: Logger);
    SignUp(dto: SignUpDto): Promise<{
        accessToken: string;
    }> | undefined;
    SignIn(dto: SignInDto): Promise<{
        accessToken: string;
    }> | undefined;
    googleAuth(): Promise<void>;
    googleAuthRedirect({ user }: any, res: Response): Promise<void>;
    microsoftAuth(): Promise<void>;
    microsoftAuthRedirect({ user }: any, res: Response): Promise<void>;
    loginAdmin(dto: AdmSignIn): Promise<{
        accessToken: string;
    }>;
}
