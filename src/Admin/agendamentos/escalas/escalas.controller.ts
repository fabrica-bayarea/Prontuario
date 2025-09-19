import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EscalasService } from './escalas.service';
import { CreateEscalaDto } from './dto/create-escala.dto';
import { UpdateEscalaDto } from './dto/update-escala.dto';

@Controller('escalas')
export class EscalasController {
  constructor(private readonly escalasService: EscalasService) {}

  @Post()
  create(@Body() createEscalaDto: CreateEscalaDto) {
    return this.escalasService.create(createEscalaDto);
  }

  @Get()
  findAll() {
    return this.escalasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.escalasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEscalaDto: UpdateEscalaDto) {
    return this.escalasService.update(+id, updateEscalaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.escalasService.remove(+id);
  }
}
