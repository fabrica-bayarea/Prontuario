import { IsString, IsDateString } from 'class-validator';

export class CreateAgendamentoDto {
  @IsString()
  beneficiario: string;

  @IsString()
  programa: string;

  @IsString()
  tipo: string;

  @IsString()
  aluno: string;

  @IsDateString()
  data: string;

  @IsString()
  turno: string;
}
