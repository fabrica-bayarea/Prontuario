# =============================================
# Estágio 1: Build da aplicação React/Vite
# =============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci

# Copiar o restante do código
COPY . .

# Variáveis de build do Vite
# No Docker, o frontend usa /api como base URL (nginx faz proxy)
ARG VITE_API_URL=/api
ARG VITE_BASE=/
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE=$VITE_BASE

# Build de produção
RUN npm run build

# =============================================
# Estágio 2: Servir com Nginx
# =============================================
FROM nginx:alpine

# Copiar build do React para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx (com proxy para API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
