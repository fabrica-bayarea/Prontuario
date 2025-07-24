import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TiposAtendimentoService } from './tipos-atendimento.service';
import { CreateTiposAtendimentoDto } from './dto/create-tipos-atendimento.dto';
import { UpdateTiposAtendimentoDto } from './dto/update-tipos-atendimento.dto';

@Controller('tipos-atendimento')
export class TiposAtendimentoController {
  constructor(private readonly tiposAtendimentoService: TiposAtendimentoService) {}

  @Post()
  create(@Body() createTiposAtendimentoDto: CreateTiposAtendimentoDto) {
    return this.tiposAtendimentoService.create(createTiposAtendimentoDto);
  }

  @Get()
  findAll() {
    return this.tiposAtendimentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposAtendimentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiposAtendimentoDto: UpdateTiposAtendimentoDto) {
    return this.tiposAtendimentoService.update(+id, updateTiposAtendimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposAtendimentoService.remove(+id);
  }
}
