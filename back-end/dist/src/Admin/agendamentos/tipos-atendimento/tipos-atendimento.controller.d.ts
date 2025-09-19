import { TiposAtendimentoService } from './tipos-atendimento.service';
import { CreateTiposAtendimentoDto } from './dto/create-tipos-atendimento.dto';
import { UpdateTiposAtendimentoDto } from './dto/update-tipos-atendimento.dto';
export declare class TiposAtendimentoController {
    private readonly tiposAtendimentoService;
    constructor(tiposAtendimentoService: TiposAtendimentoService);
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
    findOne(id: string): string;
    update(id: string, updateTiposAtendimentoDto: UpdateTiposAtendimentoDto): string;
    remove(id: string): string;
}
