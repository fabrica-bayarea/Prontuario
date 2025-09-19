import { coordenadorService } from './coordenador.service';
import { CreateCoordenadorDto } from 'src/Admin/coordenadores/dto/criar-coordenadores.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenadores.dto';
export declare class CoordenadorController {
    findAll(): {
        id: number;
        nome: string;
    }[];
}
export declare class coordenadorController {
    private readonly coordenadorService;
    constructor(coordenadorService: coordenadorService);
    create(createCoordenadorDto: CreateCoordenadorDto): Promise<{
        id: number;
        email: string;
        nome: string;
        telefone: string | null;
        cpf: string | null;
        status: string | null;
        cursos: string[];
        permissoes: import("@prisma/client/runtime/library").JsonValue | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        nome: string;
        telefone: string | null;
        cpf: string | null;
        status: string | null;
        cursos: string[];
        permissoes: import("@prisma/client/runtime/library").JsonValue | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        email: string;
        nome: string;
        telefone: string | null;
        cpf: string | null;
        status: string | null;
        cursos: string[];
        permissoes: import("@prisma/client/runtime/library").JsonValue | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    update(id: number, dto: UpdateCoordenadorDto): Promise<{
        id: number;
        email: string;
        nome: string;
        telefone: string | null;
        cpf: string | null;
        status: string | null;
        cursos: string[];
        permissoes: import("@prisma/client/runtime/library").JsonValue | null;
        criadoEm: Date;
        atualizadoEm: Date;
    }>;
    remove(id: number): Promise<void>;
}
