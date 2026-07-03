import { Router } from 'express';
import {
    criarProntuario,
    listarProntuario,
    listarPorIdProntuario,
    listarMeuProntuario,
    atualizarProntuarioPorId,
    deletarProntuarioPorId,
    validarProntuario,
    devolverProntuario
} from '../controllers/prontuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

router.post('/',    authMiddleware, rbacMiddleware(['ATE']),                          criarProntuario);
router.get('/',     authMiddleware, rbacMiddleware(['ADM','COO','PRO','ATE']),        listarProntuario);
router.get('/me',   authMiddleware, rbacMiddleware(['COM']),                          listarMeuProntuario);
router.get('/:id',  authMiddleware, rbacMiddleware(['ADM','COO','PRO','ATE','COM']), listarPorIdProntuario);
router.post('/:id/validar', authMiddleware, rbacMiddleware(['ADM','COO','PRO']),     validarProntuario);
router.post('/:id/devolver', authMiddleware, rbacMiddleware(['ADM','COO','PRO']),    devolverProntuario);
router.put('/:id',  authMiddleware, rbacMiddleware(['ATE']),                          atualizarProntuarioPorId);
router.delete('/:id', authMiddleware, rbacMiddleware(['ADM']),                        deletarProntuarioPorId);

export default router;