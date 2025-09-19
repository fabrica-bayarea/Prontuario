# 🩺 Prontuário

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![NestJS](https://img.shields.io/badge/NestJS-9.x-red?logo=nestjs)
![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![Postgres](https://img.shields.io/badge/PostgreSQL-15.x-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Engine-blue?logo=docker)

Sistema de **Prontuário Eletrônico** desenvolvido com **NestJS + Prisma + PostgreSQL (Docker)** no back-end e **React + Vite** no front-end.

---

## 🛠️ Tecnologias utilizadas

### Back-end
- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

### Front-end
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Rodando o projeto localmente

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu-usuario/prontuario.git
cd prontuario

2️⃣ Back-end (NestJS)

Entre na pasta do back-end:

cd back-end


Instale as dependências:

npm install


Crie o container do PostgreSQL:

docker run --name database_prontuario \
  -e POSTGRES_USER=user_prontuario \
  -e POSTGRES_PASSWORD=password_prontuario \
  -e POSTGRES_DB=prontuario \
  -d -p 5432:5432 postgres


Crie um arquivo .env na pasta back-end/ baseado no .env.example.
Exemplo mínimo:

DATABASE_URL="postgresql://user_prontuario:password_prontuario@localhost:5432/prontuario"
PORT=3000
JWT_SECRET="sua_chave_super_secreta"
JWT_EXPIRES_IN="1d"


Aplique as migrações no banco de dados:

npx prisma migrate dev


Crie o usuário administrador:

npx ts-node prisma/seed.ts


Se precisar editar manualmente:

npx prisma studio


No Prisma Studio, edite o usuário e ative o campo isAdmin.

Inicie o servidor:

npm run start:dev


📌 Swagger disponível em:

http://localhost:3000/docs

3️⃣ Front-end (React + Vite)

Abra outro terminal e entre na pasta do front:

cd front-end


Instale as dependências:

npm install


Inicie o projeto:

npm run dev


A aplicação estará disponível em:

http://localhost:5173

📦 Estrutura do Projeto
prontuario/
├── back-end/      # API (NestJS + Prisma + Postgres)
│   ├── prisma/    # Definição do schema e migrações
│   ├── src/       # Código-fonte do back-end
│   └── .env       # Variáveis de ambiente (ignorado no git)
│
└── front-end/     # Interface (React + Vite)
    ├── src/       # Componentes React
    └── public/    # Arquivos estáticos

✅ Checklist para rodar local

 Clonar repositório

 Criar container Postgres com usuário, senha e DB corretos

 Configurar .env no back-end

 Rodar prisma migrate dev

 Criar usuário admin (seed.ts ou Prisma Studio)

 Iniciar back-end (npm run start:dev)

 Iniciar front-end (npm run dev)
>>>>>>> 78925c83 (Correção do repositório)
