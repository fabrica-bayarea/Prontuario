import { Injectable } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Injectable()
export class ProgramasService {
  create(createProgramaDto: CreateProgramaDto) {
    return 'This action adds a new programa';
  }

  findAll() {
    return `This action returns all programas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} programa`;
  }

  update(id: number, updateProgramaDto: UpdateProgramaDto) {
    return `This action updates a #${id} programa`;
  }

  remove(id: number) {
    return `This action removes a #${id} programa`;
  }
}
