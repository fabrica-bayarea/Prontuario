import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
export declare class CursosController {
    private readonly cursosService;
    constructor(cursosService: CursosService);
    create(createCursoDto: CreateCursoDto): import(".prisma/client").Prisma.Prisma__CursoClient<{
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
    findOne(id: string): import(".prisma/client").Prisma.Prisma__CursoClient<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateCursoDto: UpdateCursoDto): import(".prisma/client").Prisma.Prisma__CursoClient<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__CursoClient<{
        id: number;
        nome: string;
        criadoEm: Date;
        descricao: string;
        modalidade: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
