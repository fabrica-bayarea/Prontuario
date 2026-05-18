# 🛠️ Workflow e Kanban - Prontuário BayArea

Bem-vindo ao fluxo oficial de desenvolvimento do Prontuário! Este documento explica como usamos o nosso quadro Kanban e qual é o passo a passo exato que cada desenvolvedor deve seguir.

**⚠️ Regra de Ouro:** Por enquanto, os desenvolvedores **não** realizam merges diretos na `develop` ou na `main`. Vocês são responsáveis por codar, abrir os Pull Requests e testar. O TechLead (Luan) ira fazer os Code Reviews e os merges em develop.

---

## 📌 Visão Geral do Nosso Kanban

Nosso quadro representa o ciclo de vida exato de uma funcionalidade. Entenda o que cada coluna significa:

* **A ser feito (Pendentes):** O backlog. Tarefas prontas para serem iniciadas.
* **Em análise:** O dev assumiu a tarefa, mas está estudando a melhor forma de implementar ou tirando dúvidas antes de codar.
* **Em desenvolvimento:** Mão na massa! O código está sendo escrito na branch individual do dev.
* **Ready for Code Review:** O dev terminou o código, abriu o Pull Request para a `develop` e aguarda aprovação da Sofia ou do Luan.
* **In Develop:** O Code Review foi aprovado e os Tech Leads fizeram o merge na `develop`. O dev criador deve testar a tarefa neste ambiente integrado.
* **Ready for Main:** O teste na `develop` foi um sucesso. A tarefa aguarda o próximo deploy para produção (`main`).
* **Prod Validation (In Prod):** Os Tech Leads fizeram o merge para a `main`. O código está no ambiente real e o dev deve fazer o teste final.
* **Done:** Sucesso absoluto! Tarefa validada em produção e finalizada.

---

## 🚀 Passo a Passo do Desenvolvedor

Siga este roteiro para cada nova tarefa que você assumir:

### 1. Preparação e Desenvolvimento
1. Vá na coluna **A ser feito** e atribua a tarefa a você (Assignee).
2. Mova o card para **Em análise** ou direto para **Em desenvolvimento**.
3. No seu terminal, atualize seu repositório local:
   `git checkout develop`
   `git pull origin develop`
4. Crie sua branch a partir da develop:
   `git checkout -b feature/nome-da-sua-tarefa`
5. Programe e faça seus commits padronizados na sua branch.

### 2. Pedindo Code Review
1. Envie seu código para o GitHub:
   `git push origin feature/nome-da-sua-tarefa`
2. Abra um **Pull Request (PR)** apontando para a branch **`develop`**.
3. Mova seu card no Kanban para **Ready for Code Review**.
4. Avise a Sofia ou o Luan para avaliarem o seu código.

### 3. Validação em Develop (A integração)
1. Assim que os Tech Leads aprovarem o PR e fizerem o merge, seu card irá para **In Develop**.
2. Puxe a `develop` atualizada para a sua máquina (ou acesse o ambiente de dev) e **teste a sua funcionalidade**.
3. Se tudo funcionar perfeitamente junto com o código dos colegas, mova seu card para **Ready for Main**.

### 4. Validação em Produção (O teste final)
1. Quando houver o deploy oficial, os Tech Leads farão o merge para a `main` e avisarão a equipe.
2. Mova seu card para **Prod Validation** e teste a funcionalidade no ambiente real (Main).
3. Validou e está tudo certo? Mova o card para **Done** e comemore! 🎉