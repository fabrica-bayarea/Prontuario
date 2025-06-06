import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { coordenador } from '@prisma/client';
import { CreateCoordenadorDto } from './dto/criar-coordenadores.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenadores.dto';

@Injectable()
export class coordenadorService {
  constructor(private readonly prisma: PrismaService) {}

 async create(createCoordenadorDto: CreateCoordenadorDto) {
  const telefone = createCoordenadorDto.telefone ?? null; 

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

 async update(id: number, updateCoordenadorDto: UpdateCoordenadorDto) {
  await this.findOne(id);

  console.log(updateCoordenadorDto);

  return this.prisma.coordenador.update({
    where: { id },
    data: updateCoordenadorDto,
  });
}

  async remove(id: number): Promise<void> {
    // Verifica se existe
    await this.findOne(id);

    await this.prisma.coordenador.delete({ where: { id } });
  }
}
