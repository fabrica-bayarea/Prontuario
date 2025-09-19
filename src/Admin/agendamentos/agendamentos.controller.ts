import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/criar-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';

@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  create(@Body() dto: CreateAgendamentoDto) {
    return this.agendamentosService.create(dto);
  }

  @Get()
  findAll() {
    return this.agendamentosService.findAll();
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAgendamentoDto) {
    return this.agendamentosService.updateStatus(id, dto.status);
  }
}
