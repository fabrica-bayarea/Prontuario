import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/criar-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
export declare class AgendamentosController {
    private readonly agendamentosService;
    constructor(agendamentosService: AgendamentosService);
    create(dto: CreateAgendamentoDto): Promise<{
        id: string;
        status: string;
        criadoEm: Date;
        data: Date;
        aluno: string;
        programa: string;
        beneficiario: string;
        tipo: string;
        turno: string;
    }>;
    findAll(): Promise<{
        id: string;
        status: string;
        criadoEm: Date;
        data: Date;
        aluno: string;
        programa: string;
        beneficiario: string;
        tipo: string;
        turno: string;
    }[]>;
    updateStatus(id: string, dto: UpdateAgendamentoDto): Promise<{
        id: string;
        status: string;
        criadoEm: Date;
        data: Date;
        aluno: string;
        programa: string;
        beneficiario: string;
        tipo: string;
        turno: string;
    }>;
}
