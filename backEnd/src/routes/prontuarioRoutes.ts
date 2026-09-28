import { Router } from 'express';
import prontuarioController from '../controllers/prontuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

router.post('/', authMiddleware, rbacMiddleware(['ADM', 'ATE']), (req, res) => prontuarioController.criarProntuario(req, res));
router.get('/', authMiddleware, rbacMiddleware(['COO', 'PRO', 'ATE']), (req, res) => prontuarioController.listarProntuario(req, res));
router.get('/me', authMiddleware, rbacMiddleware(['COM']), (req, res) => prontuarioController.listarMeuProntuario(req, res));
router.get('/:id', authMiddleware, rbacMiddleware(['COO', 'PRO', 'ATE', 'COM']), (req, res) => prontuarioController.listarPorIdProntuario(req, res));
router.post('/:id/validar', authMiddleware, rbacMiddleware(['ADM', 'COO', 'PRO']), (req, res) => prontuarioController.validarProntuario(req, res));
router.post('/:id/devolver', authMiddleware, rbacMiddleware(['ADM', 'COO', 'PRO']), (req, res) => prontuarioController.devolverProntuario(req, res));
router.patch('/:id/status', authMiddleware, rbacMiddleware(['ATE']), (req, res) => prontuarioController.alterarStatusProntuario(req, res));
router.put('/:id', authMiddleware, rbacMiddleware(['ADM', 'ATE']), (req, res) => prontuarioController.atualizarProntuarioPorId(req, res));

export default router;
