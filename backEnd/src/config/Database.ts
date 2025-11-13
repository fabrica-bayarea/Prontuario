import mongoose = require ('mongoose'); 

class Database {
  private MONGO_URL: string = process.env.MONGO_URL || 'mongodb://localhost:27017/bayarea';

  // Remova o constructor()

  // Deixe o método public e retorne a Promise
  public connect(): Promise<void> {
    mongoose.set('strictQuery', false);

    console.log('Conectando ao MongoDB...');

    // Retorne a promise do mongoose
    return mongoose.connect(this.MONGO_URL)
      .then(() => {
        console.log(' Conectado ao MongoDB');
      })
      .catch((error) => {
        console.error(' Erro ao conectar ao MongoDB:', error.message);
        process.exit(1); // Se falhar, mate o processo
      });
  }
}
export = new Database(); 