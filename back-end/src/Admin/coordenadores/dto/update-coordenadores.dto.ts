import { PartialType } from '@nestjs/swagger';
import { CreateCoordenadorDto } from './criar-coordenadores.dto';

export class UpdateCoordenadorDto extends PartialType(CreateCoordenadorDto) {}
