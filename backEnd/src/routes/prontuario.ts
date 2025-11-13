import { Router } from 'express'; 
import Prontuario from '../models/ProntuarioSchema'; 

const router = Router(); 

router.post('/prontuario', async (req, res) => {
    try {
        const newProntuario = new Prontuario(req.body); 
        await newProntuario.save(); 
        res.status(201).json({message: 'Prontuario salvo com sucesso', prontuario: newProntuario});
    } catch (error: any) {
        res.status(400).json({ error: error.message }); 
    }
});

export default router; 