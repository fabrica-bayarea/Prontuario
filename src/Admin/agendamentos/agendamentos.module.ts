import { Module } from '@nestjs/common';
import { AgendamentosController } from './agendamentos.controller';
import { AgendamentosService } from './agendamentos.service';
import { PrismaService } from 'src/services/prisma.service';
import { ProgramasModule } from './programas/programas.module';

@Module({
  controllers: [AgendamentosController],
  providers: [AgendamentosService, PrismaService],
})
export class AgendamentosModule {}
