import { PrismaService } from 'src/services/prisma.service';
import { CreateAgendamentoDto } from './dto/criar-agendamento.dto';
export declare class AgendamentosService {
    private prisma;
    constructor(prisma: PrismaService);
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
    updateStatus(id: string, status: string): Promise<{
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
