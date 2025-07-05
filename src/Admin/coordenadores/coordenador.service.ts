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
      cpf: createCoordenadorDto.cpf ?? null,
      status: createCoordenadorDto.status ?? null,
      cursos: createCoordenadorDto.cursos ?? [],
      permissoes: createCoordenadorDto.permissoes
    },
  });
}

  async findAll(): Promise<coordenador[]> {
  return this.prisma.coordenador.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      cpf: true,
      cursos: true,
      status: true,
      permissoes: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });
}

async findOne(id: number): Promise<coordenador> {
  const coordenador = await this.prisma.coordenador.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      cpf: true,
      cursos: true,
      status: true,
      permissoes: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });

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
  data: {
    nome: updateCoordenadorDto.nome,
    email: updateCoordenadorDto.email,
    cpf: updateCoordenadorDto.cpf,
    status: updateCoordenadorDto.status,
    cursos: updateCoordenadorDto.cursos,
    permissoes: updateCoordenadorDto.permissoes,
    telefone: updateCoordenadorDto.telefone ?? null, // se usar telefone também
  },
});
}

  async remove(id: number): Promise<void> {
    // Verifica se existe
    await this.findOne(id);

    await this.prisma.coordenador.delete({ where: { id } });
  }
}
