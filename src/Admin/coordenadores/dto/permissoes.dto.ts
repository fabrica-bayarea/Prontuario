import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PermissoesDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  aprovarBeneficiarios: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  cadastrarConteudos: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  gerarRelatorios: boolean;
}
