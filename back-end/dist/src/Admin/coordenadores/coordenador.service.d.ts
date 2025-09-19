import { PrismaService } from 'src/services/prisma.service';
import { coordenador } from '@prisma/client';
import { CreateCoordenadorDto } from './dto/criar-coordenadores.dto';
import { UpdateCoordenadorDto } from './dto/update-coordenadores.dto';
export declare class coordenadorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findAll(): Promise<coordenador[]>;
    findOne(id: number): Promise<coordenador>;
    update(id: number, updateCoordenadorDto: UpdateCoordenadorDto): Promise<{
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
