import { Module } from '@nestjs/common';
import { coordenadorService } from './coordenador.service';
import { coordenadorController } from './coordenador.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [coordenadorController],
  providers: [coordenadorService, PrismaService],
})
export class CoordenadoresModule {}
