import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})

export class PrismaModule {}
