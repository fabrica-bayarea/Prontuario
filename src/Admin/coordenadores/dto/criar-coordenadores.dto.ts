import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoordenadorDto {
  @ApiProperty({
    description: 'Nome completo do coordenador',
    example: 'João Silva'
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Email válido do coordenador',
    example: 'joao.silva@email.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Telefone para contato',
    example: '123456789',
    required: false
  })
  @IsOptional()
  @IsString()
  telefone?: string;
}