import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
export declare class ProgramasController {
    private readonly programasService;
    constructor(programasService: ProgramasService);
    create(createProgramaDto: CreateProgramaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateProgramaDto: UpdateProgramaDto): string;
    remove(id: string): string;
}
