import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
export declare class ProgramasService {
    create(createProgramaDto: CreateProgramaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateProgramaDto: UpdateProgramaDto): string;
    remove(id: number): string;
}
