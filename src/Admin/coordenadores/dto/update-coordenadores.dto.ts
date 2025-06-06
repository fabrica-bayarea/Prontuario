import { PartialType } from '@nestjs/mapped-types';
import { CreateCoordenadorDto } from './criar-coordenadores.dto';

export class UpdateCoordenadorDto extends PartialType(CreateCoordenadorDto) {}
