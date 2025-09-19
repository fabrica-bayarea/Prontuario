export declare class CreateCoordenadorDto {
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
    status?: 'Ativo' | 'Inativo';
    cursos?: string[];
    permissoes?: any;
}
