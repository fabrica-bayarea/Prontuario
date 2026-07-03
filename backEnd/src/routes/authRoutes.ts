import { Router } from 'express';
import authController from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

// Públicas
router.post('/login', (req, res) => authController.login(req, res));
router.post('/recuperar-senha', (req, res) => authController.recuperarSenha(req, res));
router.post('/redefinir-senha', (req, res) => authController.redefinirSenha(req, res));
router.post('/primeiro-acesso', (req, res) => authController.primeiroAcesso(req, res));

// Protegidas
router.post('/logout', authMiddleware, (req, res) => authController.logout(req, res));
router.get('/me', authMiddleware, (req, res) => authController.me(req, res));
router.get('/logs', authMiddleware, rbacMiddleware(['ADM']), (req, res) => authController.listarLogs(req, res));

export default router;
