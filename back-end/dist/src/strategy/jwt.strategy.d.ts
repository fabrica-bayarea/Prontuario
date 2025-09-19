import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/services/prisma.service';
import { User } from '@prisma/client';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        id: string;
    }): Promise<User>;
}
export {};
