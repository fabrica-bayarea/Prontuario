import { ConfigService } from '@nestjs/config';
declare const MicrosoftStrategy_base: new (...args: any) => any;
export declare class MicrosoftStrategy extends MicrosoftStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(req: any, accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any>;
}
export {};
