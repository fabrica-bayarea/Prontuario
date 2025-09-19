import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service'; // ajuste o path se necessário
import { CreateAgendamentoDto } from './dto/criar-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Injectable()
export class AgendamentosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAgendamentoDto) {
    return this.prisma.agendamento.create({
      data: {
        ...dto,
        data: new Date(dto.data),
        status: 'agendado',
      },
    });
  }

  async findAll() {
    return this.prisma.agendamento.findMany();
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.agendamento.update({
      where: { id },
      data: { status },
    });
  }
}
