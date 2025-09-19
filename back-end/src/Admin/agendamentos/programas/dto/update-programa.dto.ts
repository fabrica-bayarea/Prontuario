import { PartialType } from '@nestjs/swagger';
import { CreateProgramaDto } from './create-programa.dto';
import {
  IsOptional,
  IsString,
  IsIn,
  IsDateString,
} from 'class-validator';

export class UpdateProgramaDto extends PartialType(CreateProgramaDto) {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  @IsIn(['clínico', 'jurídico', 'pedagógico'])
  tipo?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ativo', 'inativo'])
  status?: string;

  @IsOptional()
  @IsString()
  sala?: string;

  @IsOptional()
  @IsDateString()
  inicio?: string;

  @IsOptional()
  @IsDateString()
  fim?: string;

  @IsOptional()
  @IsString()
  curso?: string;

  @IsOptional()
  @IsString()
  assistentes?: string;
}
