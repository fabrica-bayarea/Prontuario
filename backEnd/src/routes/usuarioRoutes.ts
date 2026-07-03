import { Router } from 'express';
import usuarioController from '../controllers/usuarioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

// Todas as rotas de usuários são exclusivas do perfil ADM
router.use(authMiddleware);
router.use(rbacMiddleware(['ADM']));

router.post('/', (req, res) => usuarioController.criarUsuario(req, res));
router.get('/', (req, res) => usuarioController.listarUsuarios(req, res));
router.patch('/:id/status', (req, res) => usuarioController.alterarStatus(req, res));
router.post('/:id/reenviar-boas-vindas', (req, res) => usuarioController.reenviarBoasVindas(req, res));

export default router;
