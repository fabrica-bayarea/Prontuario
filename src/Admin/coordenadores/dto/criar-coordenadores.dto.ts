import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PermissoesDto } from './permissoes.dto'; // ajuste o path se necessário

export class CreateCoordenadorDto {
  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({ example: 'joao@iesb.br' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '61999999999', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ example: '000.000.000-00', required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ example: 'Ativo', enum: ['Ativo', 'Inativo'], required: false })
  @IsOptional()
  @IsEnum(['Ativo', 'Inativo'])
  status?: 'Ativo' | 'Inativo';

  @ApiProperty({ example: ['Engenharia', 'ADS'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cursos?: string[];

  @ApiProperty({
    type: () => PermissoesDto,
    required: false,
  })
  @IsOptional()
  permissoes?: any;
}
