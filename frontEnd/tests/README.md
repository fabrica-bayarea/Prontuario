# Testes da listagem completa (#146)

Execute em `frontEnd/`, com Node 22 e dependências do lockfile:

```sh
npm ci
npx playwright install chromium
npm test
npm run test:browser -- listagem.spec.ts
npm run lint
npm run typecheck
npm run build
```

- Serviço: array legado de 201 registros; envelopes de 0, 1, 100, 101 e 201;
  tamanho solicitado, metadados incoerentes, duplicatas, falha intermediária,
  reinício na página 1, cancelamento e conjuntos distintos.
- Navegador: Painel/Pacientes/Triagem/Validação com 201 registros nos dois formatos;
  busca da única pendência da última página, filtros, KPIs, erro sem vazio/resultado
  parcial, retry, desmontagem e troca de atendente com resposta antiga pendente.
- Typecheck inclui aplicação, testes TypeScript e configuração Playwright. O build
  Vite continua sendo uma verificação separada.
- Playwright inicia Vite em porta exclusiva (4176 por padrão; `TEST_FRONT_PORT`
  permite outra), sem reutilizar aplicação já em execução. Relatórios ficam
  ignorados pelo Git e pelo lint.

## Compatibilidade com APIs reais

Requisitos adicionais: Docker ativo, imagem `postgres:16-alpine`, Git >= 2.17 e
acesso ao registry npm. Os dois SHAs devem existir localmente. Se necessário:

```sh
git fetch origin develop
git fetch origin pull/142/head
npm run test:integracao
```

Nesta máquina, o `git` padrão é 2.15; o Git do sistema atende ao requisito:

```sh
TEST_GIT=/usr/bin/git npm run test:integracao
```

O roteiro usa snapshots explícitos, substituíveis por `TEST_BASE_SHA` e
`TEST_API142_SHA` ao reavaliar outra revisão:

| API | SHA padrão |
| --- | --- |
| develop após #162 (array) | `8531deef310c837cb3b0f346ad81e1dd4fe16ad1` |
| Head do #142 (envelope) | `4b12ebf22e5cb3e420baef98976d2e4ea59d7c70` |

O roteiro cria dois worktrees temporários sem branch, instala e compila seus
backends e inicia um PostgreSQL novo em tmpfs, com porta aleatória vinculada a
127.0.0.1. Aplica o init e o índice 002 apenas nesse banco. Usa contas e prontuários
sintéticos, JWTs temporários e variáveis geradas em memória, sem copiar `.env`.
Testa as quatro telas com 201 registros reais em cada API (1 chamada no legado;
3 páginas no #142), incluindo a única pendência no último registro.

Depois insere 101 registros para outro atendente e verifica nas duas APIs:
conjuntos de 201/101 IDs disjuntos e tentativa de leitura cruzada recusada com 404
(contrato atual que oculta a existência de registros fora do escopo).
A troca de sessão no mesmo navegador é coberta separadamente por `listagem.spec.ts`.
Ao terminar, inclusive em falha normal, encerra APIs, remove o container e seus
worktrees temporários. Não modifica branches nem integra o #142.

`compatibilidade.spec.ts` depende das sessões descartáveis criadas por esse roteiro;
fica explicitamente ignorado em uma execução avulsa de `test:browser`.
A suíte testa leitura/compatibilidade; não representa aprovação integral do #142.

## Contrato de transição

`listarProntuarios(tamanho = 100, signal?)` mantém a fachada existente. O serviço
recebe um transporte injetado e valida as respostas com Zod, já usado no projeto.
No envelope, `dados` contém toda a coleção, e `paginacao` conserva os metadados
da primeira página: tamanho de transporte <=100, total e total de páginas.
No array legado, há uma só resposta completa e metadados sintéticos (zero páginas
para vazio; uma resposta para uma coleção não vazia), sem truncamento.

Consultas usam usuário/perfil na chave, repassam o AbortSignal ao Axios existente
e descartam cache sem observadores. Validação filtra após agregação. Uma falha não
publica resultado parcial nem mantém ações sobre dados com erro de carregamento.

Paginação por offset não oferece snapshot transacional. As verificações detectam
inconsistências observáveis; alterações concorrentes podem exigir nova tentativa.
A solução mantém a coleção completa na memória, conforme a spec de transição.
Escopos, endpoints, permissões e cálculo da triagem permanecem os atuais.
