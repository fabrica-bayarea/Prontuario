import { Router } from 'express'; 
import {
    criarProntuario, 
    listarProntuario, 
    listarPorIdProntuario,
    atualizarProntuarioPorId,
    deletarProntuarioPorId
} from '../controllers/prontuarioController'; 

const router = Router(); 

router.post('/', criarProntuario); 
router.get('/', listarProntuario); 
router.get('/:id', listarPorIdProntuario); 
router.put('/:id', atualizarProntuarioPorId); 
router.delete('/:id', deletarProntuarioPorId); 

export default router; 