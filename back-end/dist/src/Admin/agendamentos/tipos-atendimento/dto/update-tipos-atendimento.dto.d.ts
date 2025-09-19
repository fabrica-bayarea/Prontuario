import { CreateTiposAtendimentoDto } from './create-tipos-atendimento.dto';
declare const UpdateTiposAtendimentoDto_base: import("@nestjs/common").Type<Partial<CreateTiposAtendimentoDto>>;
export declare class UpdateTiposAtendimentoDto extends UpdateTiposAtendimentoDto_base {
    nome?: string;
    descricao?: string;
    duracao?: number;
    publico?: string;
}
export {};
