![Centro Universitário IESB](../assets/logoIesb.png)

## Back-end - NestJS

### Tecnologias
- NestJS
- TypeScript
- Prisma
- Postgres
- Docker

### Rodando localmente

1. Mude para a pasta `back-end`:
  ```bash
  cd back-end
  ```

2. Instale as dependências:
  ```bash
  npm install
  ```

3. Crie um container do Postgres:
  ```bash
  docker run --name database_trello \
    -e POSTGRES_PASSWORD=password_postgres -e POSTGRES_USER=user_postgres \
    -d -p 5432:5432 postgres
  ```

4. Criar arquivo .env de acordo com o arquivo .env.example que está na pasta "back-end/"
  
> [!IMPORTANT]  
> É crucial que as variaveis de ambiente usada na criação do container seja a mesma no "DATABASE_URL"

5. Aplique as migrações no banco de dados:
  ```bash
  npx prisma migrate dev
  ```

6. Inicie a aplicação:
  ```bash
  npm run start:dev
  ```

7. Acesse [http://localhost:3000/docs](http://localhost:3000/docs) com o seu navegador para ver o resultado.


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

## CONFIGURANDO O ADMINISTRADOR NO POSTGRES

1. Criar o administrador no banco de dados:
   
   npx ts-node prisma/seed.ts

2. Acesse o PrismaStudio e ative 'isAdmin':

npx prisma studio

No prisma studio, selecione user e o Admin deve aparecer lá. Use a edição para ativar 'isAdmin'.

3. Após isso, basta iniciar normalmente o código do back e fazer o teste no swagger