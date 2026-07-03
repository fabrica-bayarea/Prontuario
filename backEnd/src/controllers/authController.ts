import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import database from '../config/Database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { registrarLog } from '../helpers/logHelper';
import { validarPoliticaSenha, hashSenha, compararSenha } from '../helpers/senhaHelper';
import { enviarEmailRecuperacao } from '../helpers/emailHelper';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '8h';

class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { matricula, senha } = req.body;
      const login = matricula; // Aceita matricula ou email no mesmo campo

      if (!login || !senha) {
        res.status(400).json({ error: { code: 'AUTH_001', message: 'Matrícula/Email e senha são obrigatórios.' } });
        return;
      }

      const pool = database.getPool();
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE matricula = $1 OR email = $1',
        [login]
      );

      if (result.rows.length === 0) {
        await registrarLog('LOGIN_FALHA', null, req, { login_tentado: login, motivo: 'usuario_nao_encontrado' });
        res.status(401).json({ error: { code: 'AUTH_002', message: 'Matrícula/Email ou senha inválidos.' } });
        return;
      }

      const usuario = result.rows[0];

      if (!usuario.ativo) {
        await registrarLog('LOGIN_FALHA', usuario.id, req, { motivo: 'conta_inativa' });
        res.status(403).json({ error: { code: 'AUTH_003', message: 'Usuário desativado. Contate o administrador.' } });
        return;
      }

      if (usuario.bloqueado_ate && new Date(usuario.bloqueado_ate) > new Date()) {
        await registrarLog('LOGIN_FALHA', usuario.id, req, { motivo: 'conta_bloqueada', bloqueado_ate: usuario.bloqueado_ate });
        res.status(429).json({ error: { code: 'AUTH_004', message: 'Conta bloqueada temporariamente devido a múltiplas falhas. Tente novamente mais tarde.' } });
        return;
      }

      const senhaValida = await compararSenha(senha, usuario.senha_hash);

      if (!senhaValida) {
        const novasTentativas = (usuario.tentativas_login || 0) + 1;
        if (novasTentativas >= 5) {
          const bloqueadoAte = new Date(Date.now() + 15 * 60000); // 15 minutos
          await pool.query('UPDATE usuarios SET tentativas_login = $1, bloqueado_ate = $2 WHERE id = $3', [novasTentativas, bloqueadoAte, usuario.id]);
          await registrarLog('CONTA_BLOQUEADA', usuario.id, req);
          res.status(429).json({ error: { code: 'AUTH_004', message: 'Conta bloqueada temporariamente devido a múltiplas falhas. Tente novamente mais tarde.' } });
        } else {
          await pool.query('UPDATE usuarios SET tentativas_login = $1 WHERE id = $2', [novasTentativas, usuario.id]);
          await registrarLog('LOGIN_FALHA', usuario.id, req, { motivo: 'senha_invalida', tentativas: novasTentativas });
          res.status(401).json({ error: { code: 'AUTH_002', message: 'Matrícula/Email ou senha inválidos.' } });
        }
        return;
      }

      // Senha correta: resetar falhas
      await pool.query('UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE id = $1', [usuario.id]);

      const usuarioRetorno = {
        id: usuario.id,
        matricula: usuario.matricula,
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
      };

      if (usuario.primeiro_acesso) {
        const tokenTemporario = jwt.sign(
          { sub: usuario.id, tipo: 'PRIMEIRO_ACESSO' },
          JWT_SECRET,
          { expiresIn: '15m' }
        );
        await registrarLog('LOGIN_SUCESSO', usuario.id, req, { primeiro_acesso: true });
        res.json({ primeiroAcesso: true, tokenTemporario, usuario: usuarioRetorno });
        return;
      }

      const token = jwt.sign(
        { sub: usuario.id, matricula: usuario.matricula, perfil: usuario.perfil },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      await registrarLog('LOGIN_SUCESSO', usuario.id, req);
      res.json({ token, usuario: usuarioRetorno });
    } catch (error: any) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: { code: 'AUTH_500', message: 'Erro interno do servidor.' } });
    }
  }

  public async primeiroAcesso(req: AuthRequest, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: { code: 'AUTH_010', message: 'Token não fornecido.' } });
        return;
      }

      const tokenStr = authHeader.split(' ')[1]!;
      let decoded: any;
      try {
        decoded = jwt.verify(tokenStr, JWT_SECRET);
      } catch {
        res.status(401).json({ error: { code: 'AUTH_010', message: 'Token inválido ou expirado.' } });
        return;
      }

      if (decoded.tipo !== 'PRIMEIRO_ACESSO') {
         res.status(401).json({ error: { code: 'AUTH_010', message: 'Requer token temporário de primeiro acesso.' } });
         return;
      }

      const usuarioId = decoded.sub;

      const { novaSenha, confirmarSenha } = req.body;

      if (!novaSenha || !confirmarSenha) {
        res.status(400).json({ error: { code: 'AUTH_020', message: 'As senhas são obrigatórias.' } });
        return;
      }

      if (novaSenha !== confirmarSenha) {
        res.status(400).json({ error: { code: 'AUTH_021', message: 'As senhas não coincidem.' } });
        return;
      }

      const erroPolitica = validarPoliticaSenha(novaSenha);
      if (erroPolitica) {
        res.status(400).json({ error: { code: 'AUTH_022', message: erroPolitica } });
        return;
      }

      const pool = database.getPool();
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1 AND primeiro_acesso = true', [usuarioId]);

      if (result.rows.length === 0) {
        res.status(400).json({ error: { code: 'AUTH_023', message: 'Este usuário não está pendente de primeiro acesso.' } });
        return;
      }

      const usuario = result.rows[0];
      const novoHash = await hashSenha(novaSenha);

      await pool.query(
        'UPDATE usuarios SET senha_hash = $1, primeiro_acesso = false WHERE id = $2',
        [novoHash, usuario.id]
      );

      const tokenDefinitivo = jwt.sign(
        { sub: usuario.id, matricula: usuario.matricula, perfil: usuario.perfil },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      await registrarLog('PRIMEIRO_ACESSO', usuario.id, req);
      
      res.json({
        token: tokenDefinitivo,
        usuario: {
          id: usuario.id,
          matricula: usuario.matricula,
          email: usuario.email,
          nome: usuario.nome,
          perfil: usuario.perfil,
        }
      });
    } catch (error: any) {
      console.error('Erro no primeiro acesso:', error);
      res.status(500).json({ error: { code: 'AUTH_500', message: 'Erro interno do servidor.' } });
    }
  }

  public async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarioId = req.user?.sub || null;
      await registrarLog('LOGOUT', usuarioId, req);
      res.json({ message: 'Sessão encerrada com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: { code: 'AUTH_500', message: 'Erro interno do servidor.' } });
    }
  }

  public async recuperarSenha(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: { code: 'AUTH_030', message: 'E-mail é obrigatório.' } });
        return;
      }

      const pool = database.getPool();
      const result = await pool.query('SELECT id, nome, email FROM usuarios WHERE email = $1 AND ativo = true', [email]);
      
      // Sempre retorna sucesso, independente de encontrar o email ou não
      res.json({ message: 'Se o e-mail informado estiver cadastrado, você receberá um link em instantes.' });

      if (result.rows.length > 0) {
        const usuario = result.rows[0];
        // Invalida tokens anteriores
        await pool.query('UPDATE tokens_recuperacao SET usado = true WHERE usuario_id = $1 AND usado = false', [usuario.id]);
        
        const token = crypto.randomBytes(32).toString('hex');
        const expiraEm = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas

        await pool.query(
          'INSERT INTO tokens_recuperacao (usuario_id, token, expira_em) VALUES ($1, $2, $3)',
          [usuario.id, token, expiraEm]
        );

        await enviarEmailRecuperacao(usuario.email, usuario.nome, token);
        await registrarLog('SENHA_RECUPERADA', usuario.id, req);
      }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
    }
  }

  public async redefinirSenha(req: Request, res: Response): Promise<void> {
    const pool = database.getPool();
    const client = await pool.connect();
    
    try {
      const { token, novaSenha, confirmarSenha } = req.body;

      if (!token || !novaSenha || !confirmarSenha) {
        res.status(400).json({ error: { code: 'AUTH_040', message: 'Todos os campos são obrigatórios.' } });
        return;
      }

      if (novaSenha !== confirmarSenha) {
        res.status(400).json({ error: { code: 'AUTH_041', message: 'As senhas não coincidem.' } });
        return;
      }

      const erroPolitica = validarPoliticaSenha(novaSenha);
      if (erroPolitica) {
        res.status(400).json({ error: { code: 'AUTH_042', message: erroPolitica } });
        return;
      }

      await client.query('BEGIN');

      const result = await client.query(
        'SELECT usuario_id FROM tokens_recuperacao WHERE token = $1 AND usado = false AND expira_em > NOW() FOR UPDATE',
        [token]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: { code: 'AUTH_043', message: 'Link inválido ou expirado.' } });
        return;
      }

      const usuarioId = result.rows[0].usuario_id;
      const novoHash = await hashSenha(novaSenha);

      await client.query(
        'UPDATE usuarios SET senha_hash = $1, primeiro_acesso = false, tentativas_login = 0, bloqueado_ate = NULL WHERE id = $2',
        [novoHash, usuarioId]
      );

      await client.query(
        'UPDATE tokens_recuperacao SET usado = true WHERE token = $1',
        [token]
      );

      await client.query('COMMIT');
      
      await registrarLog('SENHA_REDEFINIDA', usuarioId, req);
      res.json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao redefinir senha:', error);
      res.status(500).json({ error: { code: 'AUTH_500', message: 'Erro interno do servidor.' } });
    } finally {
      client.release();
    }
  }

  public async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.sub) {
        res.status(401).json({ error: { code: 'AUTH_010', message: 'Não autenticado.' } });
        return;
      }

      const pool = database.getPool();
      const result = await pool.query(
        'SELECT id, matricula, email, nome, perfil FROM usuarios WHERE id = $1',
        [req.user.sub]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: { code: 'AUTH_050', message: 'Usuário não encontrado.' } });
        return;
      }

      res.json({ usuario: result.rows[0] });
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: { code: 'AUTH_500', message: 'Erro interno do servidor.' } });
    }
  }

  public async listarLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50, tipo, usuario_id, de, ate } = req.query;
      const parsedPage = Math.max(1, parseInt(page as string, 10));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
      const offset = (parsedPage - 1) * parsedLimit;

      let baseQuery = `
        SELECT l.*, u.nome, u.matricula 
        FROM logs_acesso l 
        LEFT JOIN usuarios u ON l.usuario_id = u.id 
        WHERE 1=1
      `;
      let countQuery = `SELECT COUNT(*) FROM logs_acesso l WHERE 1=1`;
      const queryParams: any[] = [];

      if (tipo) {
        queryParams.push(tipo);
        baseQuery += ` AND l.tipo = $${queryParams.length}`;
        countQuery += ` AND l.tipo = $${queryParams.length}`;
      }
      if (usuario_id) {
        queryParams.push(usuario_id);
        baseQuery += ` AND l.usuario_id = $${queryParams.length}`;
        countQuery += ` AND l.usuario_id = $${queryParams.length}`;
      }
      if (de) {
        queryParams.push(de);
        baseQuery += ` AND l.created_at >= $${queryParams.length}`;
        countQuery += ` AND l.created_at >= $${queryParams.length}`;
      }
      if (ate) {
        queryParams.push(ate);
        baseQuery += ` AND l.created_at <= $${queryParams.length}`;
        countQuery += ` AND l.created_at <= $${queryParams.length}`;
      }

      baseQuery += ` ORDER BY l.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      
      const pool = database.getPool();
      
      const [dataResult, countResult] = await Promise.all([
        pool.query(baseQuery, [...queryParams, parsedLimit, offset]),
        pool.query(countQuery, queryParams)
      ]);

      const total = parseInt(countResult.rows[0].count, 10);
      const totalPaginas = Math.ceil(total / parsedLimit);

      res.json({
        logs: dataResult.rows,
        paginacao: {
          total,
          pagina: parsedPage,
          limite: parsedLimit,
          totalPaginas
        }
      });
    } catch (error) {
      console.error('Erro ao listar logs:', error);
      res.status(500).json({ error: { code: 'AUTH_500', message: 'Erro interno do servidor.' } });
    }
  }
}

export default new AuthController();
