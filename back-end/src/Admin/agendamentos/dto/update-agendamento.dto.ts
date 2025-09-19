import { IsString } from 'class-validator';

export class UpdateAgendamentoDto {
  @IsString()
  status: string;
}
