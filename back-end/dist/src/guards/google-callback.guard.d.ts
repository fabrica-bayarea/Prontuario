import { ExecutionContext } from '@nestjs/common';
declare const GoogleOAuthCallbackGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleOAuthCallbackGuard extends GoogleOAuthCallbackGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
