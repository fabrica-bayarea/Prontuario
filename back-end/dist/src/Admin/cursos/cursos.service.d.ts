import { PrismaService } from 'src/services/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
export declare class CursosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateCursoDto): import(".prisma/client").Prisma.Prisma__CursoClient<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__CursoClient<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateCursoDto): import(".prisma/client").Prisma.Prisma__CursoClient<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__CursoClient<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
