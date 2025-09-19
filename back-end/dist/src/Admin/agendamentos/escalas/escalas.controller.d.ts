import { EscalasService } from './escalas.service';
import { CreateEscalaDto } from './dto/create-escala.dto';
import { UpdateEscalaDto } from './dto/update-escala.dto';
export declare class EscalasController {
    private readonly escalasService;
    constructor(escalasService: EscalasService);
    create(createEscalaDto: CreateEscalaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateEscalaDto: UpdateEscalaDto): string;
    remove(id: string): string;
}
