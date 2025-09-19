import { ExecutionContext } from '@nestjs/common';
declare const MicrosoftOAuthCallbackGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class MicrosoftOAuthCallbackGuard extends MicrosoftOAuthCallbackGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
