import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Controller('programas')
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

  @Post()
  create(@Body() createProgramaDto: CreateProgramaDto) {
    return this.programasService.create(createProgramaDto);
  }

  @Get()
  findAll() {
    return this.programasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProgramaDto: UpdateProgramaDto) {
    return this.programasService.update(+id, updateProgramaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programasService.remove(+id);
  }
}


