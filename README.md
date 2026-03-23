# 🏥 Prontuário - Fábrica BayArea

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-green)
![NodeJS](https://img.shields.io/badge/Node.js-20.x-success)
![License](https://img.shields.io/badge/License-Proprietária-blue)

Bem-vindo ao repositório oficial do sistema de **Prontuário** da Fábrica BayArea. 

Este projeto tem como objetivo centralizar, organizar e facilitar a gestão de dados de saúde e registros de pacientes, garantindo segurança, escalabilidade e uma interface amigável para os profissionais da área.

---

## 💻 Tecnologias Utilizadas

O projeto está dividido em duas frentes principais (Front-End e Back-End), utilizando as seguintes tecnologias:

**Back-End (`/backEnd`)**
* **Linguagem:** TypeScript
* **Framework:** Express
* **Banco de Dados:** MongoDB
* **Ferramentas:** Docker, Jest para testes

**Front-End (`/frontEnd`)**
* **Linguagem:** TypeScript
* **Framework:** React 
* **Estilização:** CSS
---

## ⚙️ Como Rodar o Projeto Localmente

Para rodar este projeto na sua máquina, você precisará do **Node.js (v20+)**, do **NPM/Yarn** e do **Git** instalados. 

### 1. Clonando o repositório
```bash
git clone [https://github.com/fabrica-bayarea/Prontuario.git](https://github.com/fabrica-bayarea/Prontuario.git)
cd Prontuario
```

### 2. Rodando o Back-End
Abra um terminal, acesse a pasta do servidor, instale as dependências e inicie o projeto:
```bash
cd backEnd
npm install
```
# Crie um arquivo .env baseado no .env.example
```bash
npm run start:dev
```
(O servidor Back-End estará rodando em http://localhost:3000)

### 3. Rodando o Front-End
Abra um novo terminal, acesse a pasta da interface, instale as dependências e inicie o projeto:
```bash
cd frontEnd
npm install
npm run start
```
- A aplicação Front-End estará disponível em http://localhost:3001 ou porta similar

- !! 🐳 Dica de Docker: Se você prefere rodar via containers, consulte o arquivo docker-compose.yml (se disponível) e rode docker-compose up -d.


### 🤝 Como Contribuir (Nosso Fluxo de Trabalho)
Nós levamos a organização muito a sério! Ninguém realiza commits diretos nas branches main ou develop. Todo código novo deve passar por um Pull Request e Code Review.

### Para entender exatamente como puxar uma tarefa, criar sua branch e interagir com o nosso quadro Kanban, leia obrigatoriamente o nosso manual de regras:
👉 Ler o Workflow e Regras do Kanban

### 📝 Padrão de Commits (Conventional Commits)
Nossos commits devem contar a história do projeto. Use sempre os prefixos abaixo antes da sua mensagem:

- feat: Novas funcionalidades
- fix: Correção de bugs
- docs: Mudanças na documentação
- style: "Formatação (espaços, lint)"
- chore: Tarefas de manutenção
- test: Adição ou ajuste de testes

### 📚 Política de Documentação
Temos um compromisso com a qualidade do código. Toda primeira semana do mês, a equipe deve dedicar um tempo para revisar o código recém-adicionado e garantir que as funções complexas e rotas da API estão devidamente documentadas.

📞 Suporte / Tech Leads
Em caso de dúvidas sobre a arquitetura, regras de negócio ou code review, procure os principais responsáveis técnicos:

Sofia Vaz (@sofidocx)
Luan (@Rinosifterino)
