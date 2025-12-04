
import appInstance from './app'; 
import database from './config/Database'

const PORT = process.env.PORT || 3001;


async function startServer() {
  try {
   
    await database.connect();
    
    
    appInstance.app.listen(PORT, () => {
      console.log(` Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(' Falha ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

// Executa a função
startServer();