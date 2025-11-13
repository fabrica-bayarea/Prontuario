import express = require ('express'); 
import 'dotenv/config';
// REMOVA: import './config/Database';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
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