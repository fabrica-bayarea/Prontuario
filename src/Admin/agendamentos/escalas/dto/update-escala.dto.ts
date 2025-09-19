import { PartialType } from '@nestjs/swagger';
import { CreateEscalaDto } from './create-escala.dto';
import { IsOptional, IsString, IsArray, IsUUID, IsIn } from 'class-validator';

export class UpdateEscalaDto extends PartialType(CreateEscalaDto) {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsString()
  curso?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pendente', 'aprovado', 'removido'])
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  turnos?: string[];

  @IsOptional()
  @IsUUID()
  programaId?: string;
}