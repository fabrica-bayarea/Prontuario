import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';

@Module({
  providers: [CursosService],
  controllers: [CursosController]
})
export class CursosModule {}
