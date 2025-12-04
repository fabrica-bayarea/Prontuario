import express from 'express'; 
import cors from 'cors'; 
import 'dotenv/config';
import prontuarioRoutes from './routes/prontuarioRoutes'; 


class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(cors()); 
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.get('/', (req, res) => {
      return res.json({ message: 'API BayArea está funcionando!' });
    });

    this.app.use('/api/prontuarios', prontuarioRoutes); 
  }
}

export default new App(); 