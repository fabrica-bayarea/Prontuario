import { Request, Response } from 'express'; 
import Prontuario from '../models/ProntuarioSchema'; 

//criando novo prontuario -> rota post 
export const criarProntuario = async (req: Request, res: Response) => {
    try {
        const prontuario = await Prontuario.create(req.body); 
        res.status(201).json(prontuario); 
    } catch (error: any) {
        res.status(400).json({error: error.message}); 
    }
};

//listando todos os prontuarios -> rota get 

export const listarProntuario = async (req: Request, res: Response) => {
    try {
        const prontuario = await Prontuario.find(); 
        res.status(200).json(prontuario); 
    } catch (error: any) {
        res.status(500).json({error: error.message}); 
    }
}; 

//listando prontuario por id - rota getbyid

export const listarPorIdProntuario = async (req: Request, res: Response) => {
    try {
        const prontuario = await Prontuario.findById(req.params.id); 
        if (!prontuario) return res.status (404).json({ message: "Nao encontrado"}); 
        res.json(prontuario); 
    } catch (error: any){
        res.status(500).json({ error: error.message}); 
    }
};

//atualizar um prontuario por id - rota put 

export const atualizarProntuarioPorId = async (req: Request, res: Response) => {
    try {
        const prontuario = await Prontuario.findByIdAndUpdate(req.params.id, req.body, {new: true}); 
        if(!prontuario) return res.status(404).json({ message: 'Nao encontrado'}); 
        res.json(prontuario); 
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
};

//excluir um usuario por id - rota delete 

export const deletarProntuarioPorId = async (req: Request, res: Response) => {
    try {
        const prontuario = await Prontuario.findByIdAndDelete(req.params.id); 
        if(!prontuario) return res.status(404).json({message: 'Nao encontrado'}); 
        res.json({message: 'Apagado com sucesso'}); 
    } catch (error: any) {
        res.status(500).json({error : error.message}); 
    }
}