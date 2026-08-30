# repositories/

Único lugar do back-end que fala com o banco.

**Entra aqui:** `pool.query`, montagem de SQL, mapeamento de linha para objeto.

**Não entra aqui:** `req`, `res`, status HTTP, regra de negócio, hash de senha,
envio de e-mail.

Uma função por operação. O nome descreve o dado, não o caso de uso:
`buscarPorId`, `existePorMatriculaOuEmail`, `inserir`, `atualizarSenhaHash`.

Referência a copiar: `usuarioRepository.ts`.
