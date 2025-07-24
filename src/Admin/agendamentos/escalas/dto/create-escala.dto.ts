import { IsNotEmpty, IsString, IsArray, IsUUID, IsIn } from 'class-validator';

export class CreateEscalaDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  matricula: string;

  @IsNotEmpty()
  @IsString()
  curso: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['pendente', 'aprovado', 'removido'])
  status: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  turnos: string[]; // ex: ["Seg - Manhã", "Qua - Tarde"]

  @IsNotEmpty()
  @IsUUID()
  programaId: string;
}
