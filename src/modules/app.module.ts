import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthModule } from 'src/modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/modules/prisma.module';
import { DashboardModule } from 'src/Admin/dashboard/dashboard.module';
import { CoordenadoresModule } from 'src/Admin/coordenadores/coordenador.module';
import { AgendamentosModule } from 'src/Admin/agendamentos/agendamentos.module';
import { ProgramasModule } from 'src/Admin/agendamentos/programas/programas.module';
import { TiposAtendimentoModule } from 'src/Admin/agendamentos/tipos-atendimento/tipos-atendimento.module';
import { EscalasModule } from 'src/Admin/agendamentos/escalas/escalas.module';

@Module({
  imports: [ DashboardModule, 
    CoordenadoresModule, 
    AgendamentosModule, 
    ProgramasModule,
    TiposAtendimentoModule,
    EscalasModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    PrismaModule, 
    AuthModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
