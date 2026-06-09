# 🏥 Prontuário — Fábrica BayArea

**Back-End (`/backEnd`)**
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

**Front-End (`/frontEnd`)**
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?logo=vite&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)

Sistema de **Prontuário** da Fábrica BayArea para centralizar e gerenciar dados de acolhimento e registros de pacientes.

---

## 💻 Tecnologias Utilizadas

### Back-End (`/backEnd`)
| Tecnologia | Versão | Uso |
|---|---|---|
| **TypeScript** | 5.x | Linguagem principal |
| **Express** | 5.x | Framework HTTP / API REST |
| **PostgreSQL** | 16 | Banco de dados relacional |
| **node-postgres (pg)** | 8.x | Driver de conexão com o banco |
| **Docker** | — | Containerização |

### Front-End (`/frontEnd`)
| Tecnologia | Versão | Uso |
|---|---|---|
| **TypeScript** | 6.x | Linguagem principal |
| **React** | 19 | Biblioteca de UI |
| **Vite** | 7.x | Bundler e dev server |
| **React Hook Form + Zod** | — | Gerenciamento e validação de formulários |
| **TanStack React Query** | 5.x | Estado assíncrono e cache |
| **Axios** | — | Cliente HTTP |
| **Lucide React** | — | Ícones SVG |
| **React IMask** | — | Máscaras de input (CPF, telefone, CEP) |
| **Nginx** | Alpine | Servidor web + proxy reverso (Docker) |

---

## 📁 Estrutura do Projeto

```
Prontuario/
├── docker-compose.yml          # Orquestra os 3 containers
├── .gitignore
├── README.md
│
├── frontEnd/                   # Aplicação React (SPA)
│   ├── Dockerfile              # Build multi-stage: Node → Nginx
│   ├── nginx.conf              # Proxy reverso /api → backend
│   ├── .env.example            # Template de variáveis de ambiente
│   ├── package.json
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── components/         # Componentes compartilhados (Sidebar)
│       ├── features/           # Módulos de funcionalidade
│       │   ├── questionario/   # Formulário de acolhimento (4 etapas)
│       │   └── pacientes/      # Gestão de pacientes
│       └── libs/               # API client (Axios)
│
└── backEnd/                    # API Express
    ├── Dockerfile
    ├── .env.example            # Template de variáveis de ambiente
    ├── package.json
    └── src/
        ├── server.ts           # Entrypoint
        ├── app.ts              # Configuração Express + rotas
        ├── config/
        │   ├── Database.ts     # Pool de conexão PostgreSQL
        │   └── init.sql        # Schema SQL (executado pelo Docker)
        ├── controllers/        # Lógica de negócio
        └── routes/             # Definição das rotas REST
```

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

Você precisa ter instalado:
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (inclui Docker Compose)
- **[Git](https://git-scm.com/)**

> 💡 Não é necessário instalar Node.js, PostgreSQL ou qualquer outra dependência — tudo roda dentro dos containers Docker.

### 1. Clonar o repositório

```bash
git clone -b prototipo https://github.com/fabrica-bayarea/Prontuario.git
cd Prontuario
```

### 2. Configurar variáveis de ambiente

Copie os arquivos `.env.example` para `.env` em cada pasta:

```bash
# Backend
cp backEnd/.env.example backEnd/.env

# Frontend
cp frontEnd/.env.example frontEnd/.env
```

Edite o `backEnd/.env` e defina sua senha do banco:
```
DB_PASSWORD=sua_senha_aqui
```

> ⚠️ Use a **mesma senha** no `backEnd/.env` e no campo `POSTGRES_PASSWORD` do `docker-compose.yml`.

### 3. Subir os containers

```bash
docker compose up --build -d
```

Isso criará **3 containers**:

| Container | Porta | Descrição |
|---|---|---|
| `prontuario_frontend` | `80` | Interface React servida pelo Nginx |
| `prontuario_api` | `3001` | API Express |
| `prontuario_db` | `5432` | PostgreSQL (schema criado automaticamente) |

### 4. Acessar a aplicação

- 🌐 **Site:** http://localhost
- 📝 **Formulário:** http://localhost/novoAcolhimento
- 👥 **Pacientes:** http://localhost/pacientes
- ⚙️ **API direta:** http://localhost:3001/api/prontuarios

### 5. Comandos úteis

```bash
# Ver logs de todos os containers
docker compose logs -f

# Ver logs de um container específico
docker compose logs -f api

# Parar todos os containers
docker compose down

# Parar e apagar dados do banco (reset completo)
docker compose down -v
```

---

## 🤝 Como Contribuir

Ninguém realiza commits diretos nas branches `main` ou `develop`. Todo código novo deve passar por um **Pull Request** e **Code Review**.

### Padrão de Commits (Conventional Commits)

Use sempre os prefixos abaixo:

| Prefixo | Uso |
|---|---|
| `feat:` | Novas funcionalidades |
| `fix:` | Correção de bugs |
| `docs:` | Mudanças na documentação |
| `style:` | Formatação (espaços, lint) |
| `chore:` | Tarefas de manutenção |
| `refactor:` | Refatoração de código |

---

## 📞 Tech Leads

Em caso de dúvidas sobre a arquitetura ou code review:

- Sofia Vaz ([@sofidocx](https://github.com/sofidocx))
- Luan ([@Rinosifterino](https://github.com/Rinosifterino))
