import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'bayarea',
  user: process.env.DB_USER || 'prontuario_app',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

class Database {
  public async connect(): Promise<void> {
    try {
      const client = await pool.connect();
      console.log('Conectado ao PostgreSQL');
      client.release();
    } catch (error: any) {
      console.error('Erro ao conectar ao PostgreSQL:', error.message);
      console.warn('Servidor continuará sem banco de dados');
    }
  }

  public getPool(): Pool {
    return pool;
  }
}

export = new Database();
