import express = require ('express'); 
import 'dotenv/config';
import prontuarioRoutes from './routes/prontuarioRoutes'; 
// REMOVA: import './config/Database';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.app.use('/api/prontuarios', prontuarioRoutes); 
    // A conexão com o banco NÃO é mais chamada aqui
  }

  private middlewares(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.get('/', (req, res) => {
      return res.json({ message: 'API BayArea está funcionando!' });
    });
  }
}

export = new App().app; 