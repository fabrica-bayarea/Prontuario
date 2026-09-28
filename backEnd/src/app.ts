import './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { requestId } from './middlewares/requestId';
import { limiteGlobal, limiteAutenticacao } from './middlewares/rateLimit';
import { errorHandler, rotaNaoEncontrada } from './middlewares/errorHandler';
import prontuarioRoutes from './routes/prontuarioRoutes';
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.tratamentoDeErro();
  }

  private middlewares(): void {
    // A API roda atrás de ingress/Nginx. Sem isto o rate limit veria sempre o mesmo IP.
    this.app.set('trust proxy', 1);

    this.app.use(helmet());
    this.app.use(requestId);
    this.app.use(cors({
      origin: (origin, callback) => {
        // Requisição sem Origin (curl, health check, server-to-server) é permitida.
        if (!origin || env.origensPermitidas.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Origem não permitida pelo CORS.'));
      },
      credentials: true,
    }));
    this.app.use(express.json({ limit: '100kb' }));
    this.app.use(limiteGlobal);
  }

  private routes(): void {
    this.app.get('/', (req, res) => {
      return res.json({ message: 'API BayArea está funcionando!' });
    });

    if (!env.producao) {
      // Rota de diagnóstico do tratador de erro. Nunca registrada em produção.
      this.app.get('/api/_diagnostico/erro', () => {
        throw new Error('boom');
      });
    }

    this.app.use('/api/auth', limiteAutenticacao, authRoutes);
    this.app.use('/api/prontuarios', prontuarioRoutes);
    this.app.use('/api/usuarios', usuarioRoutes);
  }

  private tratamentoDeErro(): void {
    this.app.use(rotaNaoEncontrada);
    this.app.use(errorHandler);
  }
}

export default new App();
