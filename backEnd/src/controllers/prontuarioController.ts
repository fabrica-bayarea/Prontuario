import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as prontuarioService from '../services/prontuarioService';
import { ErroDeNegocio } from '../services/prontuarioService';

class ProntuarioController {
  public async criarProntuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const novoProntuario = await prontuarioService.criarProntuario(req.body, req.user?.sub ?? null);
      res.status(201).json(novoProntuario);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao criar prontuário:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }

  public async listarProntuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resultado = await prontuarioService.listarProntuarios(
        req.user?.perfil,
        req.user?.sub,
        req.query.pagina,
        req.query.tamanho,
      );
      res.status(200).json(resultado);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao listar prontuários:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }

  public async listarPorIdProntuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const prontuario = await prontuarioService.buscarProntuarioPorId(
        req.params.id as string,
        req.user?.perfil,
        req.user?.sub,
        req.user?.matricula,
      );
      res.json(prontuario);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao listar prontuário por id:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }

  public async listarMeuProntuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const prontuario = await prontuarioService.buscarMeuProntuario(req.user?.matricula);
      res.json(prontuario);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao listar o próprio prontuário:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }

  public async alterarStatusProntuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const prontuario = await prontuarioService.alterarStatusProntuario(
        req.params.id as string,
        req.user?.perfil,
        req.user?.sub,
        req.body.status,
      );
      res.json(prontuario);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao alterar status do prontuário:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }

  public async atualizarProntuarioPorId(req: Request, res: Response): Promise<void> {
    try {
      const prontuario = await prontuarioService.atualizarProntuarioPorId(req.params.id as string, req.body);
      res.json(prontuario);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao atualizar prontuário:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }

  public async validarProntuario(req: Request, res: Response): Promise<void> {
    try {
      const prontuario = await prontuarioService.validarProntuario(req.params.id as string, req.body.feedback);
      res.json(prontuario);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao validar prontuário:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }

  public async devolverProntuario(req: Request, res: Response): Promise<void> {
    try {
      const prontuario = await prontuarioService.devolverProntuario(req.params.id as string, req.body.feedback);
      res.json(prontuario);
    } catch (error) {
      if (error instanceof ErroDeNegocio) {
        res.status(error.status).json(error.payload);
        return;
      }
      console.error('Erro ao devolver prontuário:', error);
      res.status(500).json({ error: { code: 'SRV_500', message: 'Erro interno do servidor.', requestId: res.locals.requestId } });
    }
  }
}

export default new ProntuarioController();
