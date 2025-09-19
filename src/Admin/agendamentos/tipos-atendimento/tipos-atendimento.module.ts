import { Module } from '@nestjs/common';
import { TiposAtendimentoService } from './tipos-atendimento.service';
import { TiposAtendimentoController } from './tipos-atendimento.controller';
import { PrismaModule } from 'src/modules/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TiposAtendimentoService],
  controllers: [TiposAtendimentoController],
})
export class TiposAtendimentoModule {}
