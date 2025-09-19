import { CanActivate, Type } from '@nestjs/common';
export declare function IsEnabledAuthGuard(strategyName: string, configKey: string): Type<CanActivate>;
