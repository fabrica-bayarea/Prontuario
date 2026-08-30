# services/

A regra de negócio. É onde vivem as decisões: quem pode, o que é válido,
o que acontece em qual ordem.

**Entra aqui:** validação de regra, orquestração de repositórios, hash de senha,
disparo de e-mail, decisão de erro de negócio.

**Não entra aqui:** `req`, `res`, status HTTP, SQL.

Um service não conhece o Express. Ele recebe dados simples e devolve dados
simples; quando a regra falha, lança `ErroDeNegocio`, que o controller traduz
para HTTP.

Referência a copiar: `usuarioService.ts`.
