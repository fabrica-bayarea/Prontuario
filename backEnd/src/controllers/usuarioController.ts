import { Request, Response } from 'express';
import crypto from 'crypto';
import database from '../config/Database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { hashSenha } from '../helpers/senhaHelper';
import { enviarEmailBoasVindas } from '../helpers/emailHelper';

class UsuarioController {
  public async criarUsuario(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { nome, matricula, email, perfil } = req.body;

      if (!nome || !matricula || !email || !perfil) {
        res.status(400).json({ error: { message: 'Todos os campos são obrigatórios.' } });
        return;
      }

      // Conforme definido no plano, restrito a COO, PRO e ATE
      if (!['COO', 'PRO', 'ATE'].includes(perfil)) {
        res.status(400).json({ error: { message: 'Perfil inválido ou não permitido.' } });
        return;
      }

      const pool = database.getPool();

      // Verificar se matrícula ou e-mail já existem
      const checkResult = await pool.query(
        'SELECT id FROM usuarios WHERE matricula = $1 OR email = $2',
        [matricula, email]
      );

      if (checkResult.rows.length > 0) {
        res.status(409).json({ error: { message: 'Matrícula ou e-mail já cadastrado.' } });
        return;
      }

      // Gerar senha aleatória complexa (ex: 12 caracteres base64url)
      const senhaProvisoria = crypto.randomBytes(9).toString('base64url'); // ~12 chars
      const senhaHash = await hashSenha(senhaProvisoria);

      const result = await pool.query(
        `INSERT INTO usuarios (matricula, email, senha_hash, nome, perfil, primeiro_acesso)
         VALUES ($1, $2, $3, $4, $5, true) RETURNING id, matricula, email, nome, perfil, ativo`,
        [matricula, email, senhaHash, nome, perfil]
      );

      const novoUsuario = result.rows[0];

      // Envia o e-mail (em dev apenas loga no console)
      await enviarEmailBoasVindas(email, nome, senhaProvisoria, matricula);

      res.status(201).json({ message: 'Usuário criado com sucesso.', usuario: novoUsuario });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  }

  public async listarUsuarios(req: AuthRequest, res: Response): Promise<void> {
    try {
      const pool = database.getPool();
      const result = await pool.query(
        `SELECT id, matricula, email, nome, perfil, ativo, primeiro_acesso, bloqueado_ate, created_at 
         FROM usuarios 
         ORDER BY nome ASC`
      );
      res.json({ usuarios: result.rows });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  }

  public async alterarStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      if (typeof ativo !== 'boolean') {
        res.status(400).json({ error: { message: 'Campo "ativo" deve ser booleano.' } });
        return;
      }

      // Evita que o ADM desative a si próprio por acidente
      if (req.user && String(req.user.sub) === String(id)) {
        res.status(403).json({ error: { message: 'Não é permitido alterar o próprio status.' } });
        return;
      }

      const pool = database.getPool();
      
      const checkResult = await pool.query('SELECT perfil FROM usuarios WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        res.status(404).json({ error: { message: 'Usuário não encontrado.' } });
        return;
      }
      
      // Proteger contra desativação de outros ADMs? Por enquanto deixamos livre para o ADM gerenciar tudo.

      await pool.query('UPDATE usuarios SET ativo = $1 WHERE id = $2', [ativo, id]);

      res.json({ message: `Usuário ${ativo ? 'ativado' : 'desativado'} com sucesso.` });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
    }
  }

  public async reenviarBoasVindas(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pool = database.getPool();

      const userResult = await pool.query('SELECT matricula, email, nome, primeiro_acesso FROM usuarios WHERE id = $1', [id]);
      
      if (userResult.rows.length === 0) {
        res.status(404).json({ error: { message: 'Usuário não encontrado.' } });
        return;
      }

      const usuario = userResult.rows[0];

      if (!usuario.primeiro_acesso) {
        res.status(400).json({ error: { message: 'Este usuário já realizou o primeiro acesso. Ele deve usar a opção "Esqueci minha senha".' } });
        return;
      }

      // Como a senha anterior foi criptografada, precisamos gerar uma nova
      const senhaProvisoria = crypto.randomBytes(9).toString('base64url');
      const senhaHash = await hashSenha(senhaProvisoria);

      await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);

      await enviarEmailBoasVindas(usuario.email, usuario.nome, senhaProvisoria, usuario.matricula);

      res.json({ message: 'E-mail reenviado com sucesso. Uma nova senha provisória foi gerada.' });
    } catch (error) {
      console.error('Erro ao reenviar e-mail:', error);
      res.status(500).json({ error: { message: 'Erro interno ao reenviar e-mail.' } });
    }
  }
}

export default new UsuarioController();
