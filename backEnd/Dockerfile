# imagem do Node.js
FROM node:18-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install


COPY . .


EXPOSE 3001


CMD ["npm", "run", "dev"]