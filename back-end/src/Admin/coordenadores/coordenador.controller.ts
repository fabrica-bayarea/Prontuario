import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { coordenadorService } from './coordenador.service';
import { coordenador } from '@prisma/client';
import { CreateCoordenadorDto } from 'src/Admin/coordenadores/dto/criar-coordenadores.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenadores.dto';

@ApiTags('Gerenciar Coordenadores')
@Controller('coordenadores')
export class CoordenadorController {
  @Get()
  findAll() {
    return [{ id: 1, nome: 'João' }];
  }
}

@Controller('admin/coordenadores')
export class coordenadorController {
  constructor(private readonly coordenadorService: coordenadorService) {}

  @Post()
  create(@Body() createCoordenadorDto: CreateCoordenadorDto) {
    return this.coordenadorService.create(createCoordenadorDto);
  }

  @Get()
  findAll() {
    return this.coordenadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coordenadorService.findOne(id);
  }

 // No controller:
@Put(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateCoordenadorDto,
) {
  return this.coordenadorService.update(id, dto); // dto = objeto com dados reais
}

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coordenadorService.remove(id);
  }
}
