# Backend - Express + TypeScript
FROM node:20-alpine

WORKDIR /usr/app

# Copiar arquivos de dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci

# Copiar o restante do código fonte
COPY . .

EXPOSE 3001

# Rodar em modo de desenvolvimento com ts-node-dev
CMD ["npm", "run", "dev"]