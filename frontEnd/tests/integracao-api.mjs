import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { setTimeout as esperar } from 'node:timers/promises';

const front = resolve(import.meta.dirname, '..');
const repo = resolve(front, '..');
const git = process.env.TEST_GIT || 'git';
const versaoGit = execFileSync(git, ['--version'], { encoding: 'utf8' }).match(/(\d+)\.(\d+)/);
assert.ok(versaoGit && (Number(versaoGit[1]) > 2 || Number(versaoGit[1]) === 2 && Number(versaoGit[2]) >= 17),
  'Use Git >= 2.17 para remover os worktrees descartáveis; TEST_GIT permite selecionar o executável.');
const temporario = mkdtempSync(join(tmpdir(), 'prontuario-compatibilidade-'));
const container = `prontuario-paginacao-${randomUUID()}`;
const senha = randomUUID();
const segredo = randomUUID();
const COMMIT_GIT_PR142 = '4b12ebf22e5cb3e420baef98976d2e4ea59d7c70';
const bases = [
  { nome: 'antiga', sha: process.env.TEST_BASE_SHA || '8531deef310c837cb3b0f346ad81e1dd4fe16ad1', formato: 'array' },
  { nome: 'pr142', sha: process.env.TEST_API142_SHA || COMMIT_GIT_PR142, formato: 'envelope' },
];
const worktrees = [];
const servidores = [];
let containerCriado = false;
let pool;

function executar(comando, argumentos, opcoes = {}) {
  return execFileSync(comando === 'git' ? git : comando, argumentos, { cwd: repo, encoding: 'utf8', ...opcoes });
}

async function portaLivre() {
  const servidor = createServer();
  await new Promise((resolve, reject) => {
    servidor.once('error', reject);
    servidor.listen(0, '127.0.0.1', resolve);
  });
  const porta = servidor.address().port;
  await new Promise((resolve) => servidor.close(resolve));
  return porta;
}

async function esperarApi(url, processo) {
  for (let tentativa = 0; tentativa < 100; tentativa++) {
    if (processo.exitCode !== null) throw new Error('API descartável encerrou antes de ficar pronta.');
    try { if ((await fetch(url + '/api/prontuarios')).status === 401) return; } catch { /* inicializando */ }
    await esperar(100);
  }
  throw new Error('API descartável não ficou pronta.');
}

async function inserirProntuarios(total, alunoId, pendente) {
  await pool.query(`
    INSERT INTO prontuario (
      nome, email, cpf, data_nascimento, cep, estado, cidade, estado_civil, genero, cor_raca,
      telefone, clinica_atendimento, area_atendimento, class_atendimento, atendimento_para_quem,
      acompanhamento_outro_lugar, sua_casa_e, renda_familiar, origem_renda, sua_casa_estuda,
      residencia_deficiencia, encaminhamento_medico, aluno_id, status
    )
    SELECT
      CASE WHEN n = 1 AND $3 THEN 'Paciente Última Página' ELSE 'Paciente Sintético ' || $2::integer || '-' || n END,
      'fixture' || $2 || '-' || n || '@example.invalid', lpad(($2 * 1000 + n)::text, 11, '0'),
      '2000-01-01', '00000-000', 'DF', 'Cidade Sintética', 'Solteiro', 'Outro', 'Não informado',
      '(00) 00000-0000', 'Clínica Escola Ceilândia', 'Psicologia', 'Não urgente', 'Você',
      'Não', 'Quitada', 'DeUmAteTres', 'Empregaticio', 'Nao', 'Nao', 'Nao', $2,
      CASE WHEN n = 1 AND $3 THEN 'Aguardando Validação' ELSE 'Aprovado' END
    FROM generate_series(1, $1::integer) n
  `, [total, alunoId, pendente]);
}

async function lerIds(url, token, formato) {
  const ids = [];
  let totalPaginas = 1;
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    const resposta = await fetch(`${url}/api/prontuarios?pagina=${pagina}&tamanho=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(resposta.status, 200);
    const corpo = await resposta.json();
    if (formato === 'array') {
      assert.ok(Array.isArray(corpo));
      return corpo.map((p) => p.id);
    }
    assert.equal(corpo.paginacao.pagina, pagina);
    assert.equal(corpo.paginacao.tamanho, 100);
    totalPaginas = corpo.paginacao.totalPaginas;
    ids.push(...corpo.dados.map((p) => p.id));
  }
  return ids;
}

try {
  for (const base of bases) {
    base.pasta = join(temporario, base.nome);
    executar('git', ['worktree', 'add', '--detach', base.pasta, base.sha]);
    worktrees.push(base.pasta);
    executar('npm', ['ci', '--no-audit', '--no-fund'], { cwd: join(base.pasta, 'backEnd'), stdio: 'pipe' });
    executar('npm', ['run', 'build'], { cwd: join(base.pasta, 'backEnd'), stdio: 'pipe' });
  }

  executar('docker', ['run', '--rm', '-d', '--name', container,
    '-p', '127.0.0.1::5432', '--tmpfs', '/var/lib/postgresql/data',
    '-e', 'POSTGRES_USER=prontuario_app', '-e', 'POSTGRES_DB=prontuario_teste',
    '-e', `POSTGRES_PASSWORD=${senha}`, 'postgres:16-alpine']);
  containerCriado = true;
  const portaBanco = Number(executar('docker', ['port', container, '5432']).trim().split(':').at(-1));
  for (let tentativa = 0; tentativa < 100; tentativa++) {
    try { executar('docker', ['exec', container, 'pg_isready', '-h', '127.0.0.1', '-U', 'prontuario_app']); break; }
    catch { if (tentativa === 99) throw new Error('PostgreSQL descartável não ficou pronto.'); await esperar(100); }
  }
  const requireApi = createRequire(join(bases[1].pasta, 'backEnd/package.json'));
  const { Pool } = requireApi('pg');
  const jwt = requireApi('jsonwebtoken');
  const bcrypt = requireApi('bcryptjs');
  pool = new Pool({ host: '127.0.0.1', port: portaBanco, database: 'prontuario_teste', user: 'prontuario_app', password: senha });
  await pool.query(readFileSync(join(bases[1].pasta, 'backEnd/src/config/init.sql'), 'utf8'));
  await pool.query(readFileSync(join(bases[1].pasta, 'backEnd/src/config/migrations/002_add_index_prontuario_aluno_id.sql'), 'utf8'));

  const sessoes = {};
  for (const perfil of ['ATE', 'COO', 'PRO', 'ATE2']) {
    const papel = perfil === 'ATE2' ? 'ATE' : perfil;
    const { rows: [usuario] } = await pool.query(`
      INSERT INTO usuarios (matricula,email,senha_hash,nome,perfil,primeiro_acesso)
      VALUES ($1,$2,$3,$4,$5,false) RETURNING id,matricula,email,nome,perfil
    `, [perfil, `${perfil}@example.invalid`, await bcrypt.hash(senha, 4), `Usuário Sintético ${perfil}`, papel]);
    sessoes[perfil] = { usuario, token: jwt.sign({ sub: usuario.id, matricula: usuario.matricula, perfil: papel }, segredo, { expiresIn: '15m' }) };
  }
  const arquivoSessoes = join(temporario, 'sessoes.json');
  writeFileSync(arquivoSessoes, JSON.stringify(sessoes), { mode: 0o600 });
  await inserirProntuarios(201, sessoes.ATE.usuario.id, true);

  for (const base of bases) {
    const portaApi = await portaLivre();
    const portaFront = await portaLivre();
    base.url = `http://127.0.0.1:${portaApi}`;
    const servidor = spawn(process.execPath, ['dist/server.js'], {
      cwd: join(base.pasta, 'backEnd'), stdio: 'ignore',
      env: { ...process.env, NODE_ENV: 'test', PORT: String(portaApi), DB_HOST: '127.0.0.1',
        DB_PORT: String(portaBanco), DB_NAME: 'prontuario_teste', DB_USER: 'prontuario_app',
        DB_PASSWORD: senha, DB_SSL: 'false', JWT_SECRET: segredo, CORS_ORIGINS: `http://127.0.0.1:${portaFront}` },
    });
    servidores.push(servidor);
    await esperarApi(base.url, servidor);
    console.log(`Smoke com 201 registros: ${base.nome} (${base.sha})`);
    executar('npm', ['run', 'test:browser', '--', 'compatibilidade.spec.ts'], {
      cwd: front, stdio: 'inherit',
      env: { ...process.env, TEST_API_URL: base.url + '/api', TEST_SESSOES: arquivoSessoes,
        TEST_FRONT_PORT: String(portaFront), TEST_FORMATO: base.formato },
    });
  }

  await inserirProntuarios(101, sessoes.ATE2.usuario.id, false);
  for (const base of bases) {
    const [primeiro, segundo] = await Promise.all([
      lerIds(base.url, sessoes.ATE.token, base.formato), lerIds(base.url, sessoes.ATE2.token, base.formato),
    ]);
    assert.equal(primeiro.length, 201);
    assert.equal(segundo.length, 101);
    assert.equal(new Set([...primeiro, ...segundo]).size, 302);
    const acessoCruzado = await fetch(`${base.url}/api/prontuarios/${segundo[0]}`, {
      headers: { Authorization: `Bearer ${sessoes.ATE.token}` },
    });
    // As duas APIs ocultam a existência de prontuário fora do escopo com 404.
    assert.equal(acessoCruzado.status, 404);
    console.log(`Escopo validado em ${base.nome}: ATE 201 + ATE 101, IDs disjuntos e acesso cruzado 404.`);
  }
} finally {
  for (const servidor of servidores) {
    servidor.kill('SIGTERM');
    await new Promise((resolve) => servidor.exitCode !== null ? resolve() : servidor.once('exit', resolve));
  }
  if (pool) await pool.end();
  if (containerCriado) executar('docker', ['rm', '-f', container]);
  for (const pasta of worktrees) executar('git', ['worktree', 'remove', '--force', pasta]);
  rmSync(temporario, { recursive: true, force: true });
}
