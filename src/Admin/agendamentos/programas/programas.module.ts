import { Module } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [ProgramasController],
  providers: [ProgramasService, PrismaService],
  exports: [ProgramasService],
})
export class ProgramasModule {}
