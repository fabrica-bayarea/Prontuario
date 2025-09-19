import { Module } from '@nestjs/common';
import { EscalasService } from './escalas.service';
import { EscalasController } from './escalas.controller';

@Module({
  controllers: [EscalasController],
  providers: [EscalasService],
})
export class EscalasModule {}
