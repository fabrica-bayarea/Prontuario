import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { coordenador } from '@prisma/client';
import { CreateCoordenadorDto } from './dto/criar-coordenadores.dto';

@Injectable()
export class coordenadorService {
  constructor(private readonly prisma: PrismaService) {}

 async create(createCoordenadorDto: CreateCoordenadorDto) {
  const telefone = createCoordenadorDto.telefone ?? null; // se undefined, vira null

  return this.prisma.coordenador.create({
    data: {
      nome: createCoordenadorDto.nome,
      email: createCoordenadorDto.email,
      telefone: telefone,
    },
  });
}

  async findAll(): Promise<coordenador[]> {
    return this.prisma.coordenador.findMany();
  }

  async findOne(id: number): Promise<coordenador> {
    const coordenador = await this.prisma.coordenador.findUnique({ where: { id } });

    if (!coordenador) {
      throw new NotFoundException(`coordenador com ID ${id} não encontrado`);
    }

    return coordenador;
  }

  async update(id: number, data: Partial<coordenador>): Promise<coordenador> {
    // Verifica se existe
    await this.findOne(id);

    return this.prisma.coordenador.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<void> {
    // Verifica se existe
    await this.findOne(id);

    await this.prisma.coordenador.delete({ where: { id } });
  }
}
