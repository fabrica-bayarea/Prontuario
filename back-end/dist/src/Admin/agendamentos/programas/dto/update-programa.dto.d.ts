import { CreateProgramaDto } from './create-programa.dto';
declare const UpdateProgramaDto_base: import("@nestjs/common").Type<Partial<CreateProgramaDto>>;
export declare class UpdateProgramaDto extends UpdateProgramaDto_base {
    nome?: string;
    descricao?: string;
    tipo?: string;
    status?: string;
    sala?: string;
    inicio?: string;
    fim?: string;
    curso?: string;
    assistentes?: string;
}
export {};
