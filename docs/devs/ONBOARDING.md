# 🏥 Prontuário - Fábrica BayArea

Bem-vindos ao repositório oficial do projeto Prontuário! Este documento contém todas as instruções para você configurar seu ambiente e o nosso fluxo de trabalho.

## 🚀 Como Rodar o Projeto Localmente
- `npm install` 
- `docker-compose up`

---

## 📖 Como Trabalhamos (Nosso Fluxo Git)
Nós usamos um fluxo de trabalho profissional baseado em Pull Requests. **Nunca faça commits direto na `main` ou `develop`.**

**Passo a Passo para desenvolver:**
1. Veja sua Issue no nosso Kanban e veja o que foi colocado como responsavél
2. Vá para a branch `develop` e atualize: `git checkout develop` -> `git pull`
3. Crie sua branch com base na issue (ex: issue #12): `git checkout -b feature/12-tela-login`
4. Programe e faça commits padronizados (veja abaixo).
5. Envie para o GitHub: `git push origin feature/12-tela-login`
6. Abra um Pull Request para a branch `develop`.
7. Peça Code Review para um colega.

---

## 📝 Padrão de Commits (Conventional Commits)
Nossos commits devem contar uma história. Use sempre os prefixos abaixo:
* `feat:` Para novas funcionalidades. *(Ex: feat: adiciona validacao de email)*
* `fix:` Para correção de bugs. *(Ex: fix: corrige erro 404 no login)*
* `docs:` Para alterações na documentação/README.
* `chore:` Para tarefas de configuração, pacotes, etc. *(Ex: chore: atualiza pacote do react)*
* `style:` Para formatação de código (Lint, espaçamento).

---

## 📚 Documentação do Código (Política Mensal)
Para não deixarmos a documentação acumular, temos uma política de atualização mensal.
**Toda primeira semana do mês**, a equipe deve revisar o código recém-adicionado (Front e Back) e garantir que as funções complexas, rotas da API e componentes estão devidamente comentados e documentados na nossa base de conhecimento.