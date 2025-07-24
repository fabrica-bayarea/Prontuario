import { PartialType } from '@nestjs/swagger';
import { CreateTiposAtendimentoDto } from './create-tipos-atendimento.dto';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateTiposAtendimentoDto extends PartialType(CreateTiposAtendimentoDto) {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duracao?: number;

  @IsOptional()
  @IsString()
  publico?: string;
}
