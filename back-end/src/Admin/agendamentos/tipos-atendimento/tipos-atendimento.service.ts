import { Injectable } from '@nestjs/common';
import { CreateTiposAtendimentoDto } from './dto/create-tipos-atendimento.dto';
import { UpdateTiposAtendimentoDto } from './dto/update-tipos-atendimento.dto';
import { PrismaService } from 'src/services/prisma.service';
import { Visibilidade } from '@prisma/client';

@Injectable()
export class TiposAtendimentoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTiposAtendimentoDto: CreateTiposAtendimentoDto) {
    console.log('Dados recebidos:', createTiposAtendimentoDto);

    const visibilidadeEnum = createTiposAtendimentoDto.visibilidade as Visibilidade;

    const created = await this.prisma.tipoAtendimento.create({
      data: {
        nome: createTiposAtendimentoDto.nome,
        sigla: createTiposAtendimentoDto.sigla,
        descricao: createTiposAtendimentoDto.descricao,
        publico: createTiposAtendimentoDto.publicoAlvo,
        duracao: createTiposAtendimentoDto.duracao,
        frequencia: createTiposAtendimentoDto.frequencia,
        visibilidade: visibilidadeEnum,
        instrucoesAluno: createTiposAtendimentoDto.instrucoesAluno,
        orientacoesPublicas: createTiposAtendimentoDto.orientacoesPublicas,
        programaId: createTiposAtendimentoDto.programaId,
        status: createTiposAtendimentoDto.status,
      },
    });

    console.log('Criado:', created);
    return created;
  }

  findAll() {
    return `This action returns all tiposAtendimento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tiposAtendimento`;
  }

  update(id: number, updateTiposAtendimentoDto: UpdateTiposAtendimentoDto) {
    return `This action updates a #${id} tiposAtendimento`;
  }

  remove(id: number) {
    return `This action removes a #${id} tiposAtendimento`;
  }
}
