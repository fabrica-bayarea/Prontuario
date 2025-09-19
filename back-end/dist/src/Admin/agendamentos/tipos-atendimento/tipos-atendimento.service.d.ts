import { CreateTiposAtendimentoDto } from './dto/create-tipos-atendimento.dto';
import { UpdateTiposAtendimentoDto } from './dto/update-tipos-atendimento.dto';
import { PrismaService } from 'src/services/prisma.service';
export declare class TiposAtendimentoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createTiposAtendimentoDto: CreateTiposAtendimentoDto): Promise<{
        id: string;
        nome: string;
        status: string;
        descricao: string | null;
        sigla: string;
        duracao: number | null;
        frequencia: string | null;
        visibilidade: import(".prisma/client").$Enums.Visibilidade;
        instrucoesAluno: string | null;
        orientacoesPublicas: string | null;
        programaId: string;
        publico: string | null;
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTiposAtendimentoDto: UpdateTiposAtendimentoDto): string;
    remove(id: number): string;
}
