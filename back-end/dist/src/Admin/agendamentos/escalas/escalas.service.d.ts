import { CreateEscalaDto } from './dto/create-escala.dto';
import { UpdateEscalaDto } from './dto/update-escala.dto';
export declare class EscalasService {
    create(createEscalaDto: CreateEscalaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEscalaDto: UpdateEscalaDto): string;
    remove(id: number): string;
}
