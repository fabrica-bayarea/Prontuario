import { Router } from 'express';
import {
    criarProntuario,
    listarProntuario,
    listarPorIdProntuario,
    listarMeuProntuario,
    alterarStatusProntuario,
    atualizarProntuarioPorId,
    validarProntuario,
    devolverProntuario
} from '../controllers/prontuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

router.post('/',    authMiddleware, rbacMiddleware(['ADM','ATE']),                          criarProntuario);
router.get('/',     authMiddleware, rbacMiddleware(['COO','PRO','ATE']),        listarProntuario);
router.get('/me',   authMiddleware, rbacMiddleware(['COM']),                          listarMeuProntuario);
router.get('/:id',  authMiddleware, rbacMiddleware(['COO','PRO','ATE','COM']), listarPorIdProntuario);
router.post('/:id/validar', authMiddleware, rbacMiddleware(['ADM','COO','PRO']),     validarProntuario);
router.post('/:id/devolver', authMiddleware, rbacMiddleware(['ADM','COO','PRO']),    devolverProntuario);
router.patch('/:id/status', authMiddleware, rbacMiddleware(['ATE']), alterarStatusProntuario);
router.put('/:id',  authMiddleware, rbacMiddleware(['ADM','ATE']),                          atualizarProntuarioPorId);

export default router;
