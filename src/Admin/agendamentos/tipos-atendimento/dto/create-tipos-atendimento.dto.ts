import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, Min, IsIn, IsUUID } from 'class-validator';

export class CreateTiposAtendimentoDto {
  @ApiProperty({ example: 'Atendimento Psicológico' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'PSICO' })
  @IsString()
  @IsNotEmpty()
  sigla: string;

  @ApiProperty({ example: 'Atendimento psicológico voltado para adultos.' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ example: 'Adultos e adolescentes' })
  @IsString()
  @IsNotEmpty()
  publicoAlvo: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(1)
  duracao: number;

  @ApiPropertyOptional({ example: 'Semanal' })
  @IsOptional()
  @IsString()
  frequencia?: string;

  @ApiProperty({ example: 'Aluno e Beneficiário', enum: ['Aluno e Beneficiário', 'Somente Aluno', 'Somente Coordenador'] })
  @IsString()
  @IsIn(['Aluno e Beneficiário', 'Somente Aluno', 'Somente Coordenador'])
  visibilidade: string;

  @ApiPropertyOptional({ example: 'Compareça 10 minutos antes.' })
  @IsOptional()
  @IsString()
  instrucoesAluno?: string;

  @ApiPropertyOptional({ example: 'Leve documento com foto.' })
  @IsOptional()
  @IsString()
  orientacoesPublicas?: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab' })
  @IsUUID()
  programaId: string;

  @ApiProperty({ example: 'ativo', enum: ['ativo', 'inativo'] })
  @IsString()
  @IsIn(['ativo', 'inativo'])
  status: string;
}
