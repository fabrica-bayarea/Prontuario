import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { AdmSignIn, SignInDto, SignUpDto } from 'src/dto/auth.dto';
export declare class AuthService {
    private prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private generateJwt;
    private hashPassword;
    private findOrCreateUser;
    private handleSignUpError;
    signUp(dto: SignUpDto): Promise<{
        accessToken: string;
    }>;
    signIn(dto: SignInDto): Promise<{
        accessToken: string;
    }>;
    signInWithProvider(provider: string, req: {
        providerId: string;
        email: string;
        name: string;
    }): Promise<{
        accessToken: string;
    }>;
    adminSignIn(dto: AdmSignIn): Promise<{
        accessToken: string;
    }>;
}
