import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
  alterarStatus,
  criarUsuario,
  ErroDeNegocio,
  listarUsuarios,
  reenviarBoasVindas,
} from '../services/usuarioService';

class UsuarioController {
  public async criarUsuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { nome, matricula, email, perfil } = req.body;
      const usuario = await criarUsuario({ nome, matricula, email, perfil });
      res.status(201).json({ message: 'Usuário criado com sucesso.', usuario });
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json({ error: { message: error.message } });
        return;
      }
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  }

  public async listarUsuarios(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarios = await listarUsuarios();
      res.json({ usuarios });
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json({ error: { message: error.message } });
        return;
      }
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  }

  public async alterarStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { ativo } = req.body;
      const mensagem = await alterarStatus(id, ativo, req.user!.sub);
      res.json({ message: mensagem });
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json({ error: { message: error.message } });
        return;
      }
      console.error('Erro ao alterar status:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  }

  public async reenviarBoasVindas(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      await reenviarBoasVindas(id);
      res.json({ message: 'E-mail reenviado com sucesso. Uma nova senha provisória foi gerada.' });
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json({ error: { message: error.message } });
        return;
      }
      console.error('Erro ao reenviar e-mail:', error);
      res.status(500).json({ error: { message: 'Erro interno ao reenviar e-mail.' } });
    }
  }
}

export default new UsuarioController();
