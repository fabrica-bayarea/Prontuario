import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateProgramaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['clínico', 'jurídico', 'pedagógico'])
  tipo: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['ativo', 'inativo'])
  status: string;

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
