import { CreateEscalaDto } from './create-escala.dto';
declare const UpdateEscalaDto_base: import("@nestjs/common").Type<Partial<CreateEscalaDto>>;
export declare class UpdateEscalaDto extends UpdateEscalaDto_base {
    nome?: string;
    matricula?: string;
    curso?: string;
    status?: string;
    turnos?: string[];
    programaId?: string;
}
export {};
