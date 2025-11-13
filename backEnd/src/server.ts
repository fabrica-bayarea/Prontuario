// src/server.ts
import appInstance = require('./app'); // Importa a instância do App (compatível com `export =`)
import database = require('./config/Database'); // Importa a instância do Database

const PORT = process.env.PORT || 3001;

// Criamos uma função async para controlar a inicialização
async function startServer() {
  try {
    // 1. Conecta ao banco e ESPERA
    await database.connect();
    
    // 2. SÓ DEPOIS, inicia o servidor
    appInstance.listen(PORT, () => {
      console.log(` Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(' Falha ao iniciar a aplicação:', error);
    process.exit(1);
  }
}

// Executa a função
startServer();