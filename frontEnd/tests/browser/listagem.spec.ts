import { expect, test, type Page } from '@playwright/test';
import { criarPagina, criarProntuarios } from '../fixtures/prontuarios';

const telas = [
  { nome: 'Painel', rota: '/', perfil: 'COO', busca: 'Buscar por nome do paciente', item: '.recente-item' },
  { nome: 'Pacientes', rota: '/pacientes', perfil: 'ATE', busca: 'Pesquisar por Nome', item: '.pacientes-table tbody tr' },
  { nome: 'Triagem', rota: '/triagem', perfil: 'ATE', busca: 'Buscar por paciente', item: '.acolhimento-card' },
  { nome: 'Validação', rota: '/validacao', perfil: 'PRO', busca: 'Buscar aluno', item: '.prontuario-card' },
];

async function autenticar(page: Page, perfil: string) {
  const usuario = { id: 1, perfil, nome: 'Usuário Sintético', matricula: 'teste1', email: 'teste1@example.invalid' };
  await page.addInitScript((usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', 'sessao-sintetica-1');
  }, usuario);
  await page.route('**/api/auth/me', (route) => route.fulfill({ json: { usuario } }));
  await page.route('**/api/auth/logout', (route) => route.fulfill({ json: {} }));
}

for (const formato of ['array', 'envelope']) {
  for (const tela of telas) {
    test(`${tela.nome}: 201 registros e pendência na última página (${formato})`, async ({ page }) => {
      await autenticar(page, tela.perfil);
      const dados = criarProntuarios(201);
      await page.route('**/api/prontuarios?*', (route) => {
        const url = new URL(route.request().url());
        expect(url.searchParams.get('tamanho')).toBe('100');
        return route.fulfill({ json: formato === 'array' ? dados : criarPagina(dados, Number(url.searchParams.get('pagina'))) });
      });
      await page.goto(tela.rota);
      if (tela.nome === 'Painel') {
        await expect(page.locator('.kpi-value')).toHaveText(['201', '201', '1']);
      } else {
        await expect(page.locator(tela.item)).toHaveCount(tela.nome === 'Validação' ? 1 : 201);
      }
      await page.getByPlaceholder(new RegExp(tela.busca)).fill('Paciente Última Página');
      await expect(page.locator(tela.item)).toHaveCount(1);
      await expect(page.locator(tela.item)).toContainText('Paciente Última Página');
      if (tela.nome === 'Pacientes') {
        await page.getByRole('combobox').nth(0).selectOption('Aguardando Validação');
        await page.getByRole('combobox').nth(1).selectOption('Clínica Escola Ceilândia');
        await expect(page.locator(tela.item)).toContainText('Paciente Última Página');
      }
    });
  }
}

for (const tela of telas) {
  test(`${tela.nome}: falha intermediária mostra erro e permite recarregar tudo`, async ({ page }) => {
    await autenticar(page, tela.perfil);
    const dados = criarProntuarios(201);
    let falhar = true;
    const paginas: number[] = [];
    await page.route('**/api/prontuarios?*', (route) => {
      const pagina = Number(new URL(route.request().url()).searchParams.get('pagina'));
      paginas.push(pagina);
      return pagina === 2 && falhar
        ? route.fulfill({ status: 503, json: { error: 'Falha sintética' } })
        : route.fulfill({ json: criarPagina(dados, pagina) });
    });
    await page.goto(tela.rota);
    await expect(page.getByRole('alert')).toContainText('Não foi possível carregar a lista completa');
    await expect(page.locator(tela.item)).toHaveCount(0);
    await expect(page.getByText(/Nenhum (prontuário encontrado|paciente encontrado|acolhimento encontrado|acolhimento cadastrado)/)).toHaveCount(0);
    if (tela.nome === 'Painel') await expect(page.locator('.kpi-value')).toHaveText(['—', '—', '—']);
    falhar = false;
    paginas.length = 0;
    await page.getByRole('button', { name: 'Tentar novamente' }).click();
    await expect(page.locator(tela.item).filter({ hasText: 'Paciente Última Página' })).toHaveCount(tela.nome === 'Painel' ? 0 : 1);
    if (tela.nome === 'Painel') await expect(page.locator('.kpi-value')).toHaveText(['201', '201', '1']);
    await expect(page.getByRole('alert')).toHaveCount(0);
    expect(paginas).toEqual([1, 2, 3]);
  });
}

test('sair da tela cancela a página pendente e não solicita a seguinte', async ({ page }) => {
  await autenticar(page, 'ATE');
  const dados = criarProntuarios(201);
  let liberar!: () => void;
  const bloqueio = new Promise<void>((resolve) => { liberar = resolve; });
  let segundaIniciada = false;
  const paginas: number[] = [];
  await page.route('**/api/prontuarios?*', async (route) => {
    const pagina = Number(new URL(route.request().url()).searchParams.get('pagina'));
    paginas.push(pagina);
    if (pagina === 2) { segundaIniciada = true; await bloqueio; }
    await route.fulfill({ json: criarPagina(dados, pagina) });
  });
  await page.goto('/pacientes');
  await expect.poll(() => segundaIniciada).toBe(true);
  const cancelamento = page.waitForEvent('requestfailed', (req) => req.url().includes('pagina=2'));
  await page.getByRole('button', { name: 'Novo Acolhimento' }).click();
  await cancelamento;
  liberar();
  await expect(page).toHaveURL(/novoAcolhimento/);
  expect(paginas).not.toContain(3);
});

test('troca de atendente não reutiliza coleção nem resposta pendente da sessão anterior', async ({ page }) => {
  await autenticar(page, 'ATE');
  const primeiro = criarProntuarios(201).map((p) => ({ ...p, nome: `Somente Atendente Um ${p.id}` }));
  const segundo = criarProntuarios(2, 1001).map((p) => ({ ...p, nome: `Somente Atendente Dois ${p.id}` }));
  const usuario2 = { id: 2, perfil: 'ATE', nome: 'Atendente Dois', matricula: 'teste2', email: 'teste2@example.invalid' };
  await page.route('**/api/auth/login', (route) => route.fulfill({ json: { usuario: usuario2, token: 'sessao-sintetica-2' } }));
  await page.route('**/api/auth/me', (route) => route.fulfill({
    json: { usuario: route.request().headers().authorization?.endsWith('-2') ? usuario2 : { ...usuario2, id: 1 } },
  }));
  let bloquearSegunda = false;
  let segundaIniciada = false;
  let liberar!: () => void;
  const bloqueio = new Promise<void>((resolve) => { liberar = resolve; });
  await page.route('**/api/prontuarios?*', async (route) => {
    const pagina = Number(new URL(route.request().url()).searchParams.get('pagina'));
    const usuarioDois = route.request().headers().authorization?.endsWith('-2');
    if (!usuarioDois && pagina === 2 && bloquearSegunda) { segundaIniciada = true; await bloqueio; }
    await route.fulfill({ json: criarPagina(usuarioDois ? segundo : primeiro, pagina) });
  });
  await page.goto('/pacientes');
  await expect(page.locator('.pacientes-table tbody tr')).toHaveCount(201);
  // Uma nova consulta da sessão 1 fica pendente enquanto o usuário sai e entra como sessão 2.
  bloquearSegunda = true;
  await page.getByRole('link', { name: /Triagem/ }).click();
  await expect.poll(() => segundaIniciada).toBe(true);
  const cancelamento = page.waitForEvent('requestfailed', (req) => req.url().includes('pagina=2'));
  await page.getByRole('button', { name: /Sair/i }).click();
  await cancelamento;
  await page.getByLabel('Matrícula ou E-mail').fill('teste2');
  await page.getByLabel('Senha', { exact: true }).fill('Senha-Sintetica-123!');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.locator('.pacientes-table tbody tr')).toHaveCount(2);
  liberar();
  await expect(page.getByText(/Somente Atendente Um/)).toHaveCount(0);
  await expect(page.locator('.pacientes-table')).toContainText('Somente Atendente Dois 1002');
});

test('total zero é vazio válido, com contadores zerados e sem erro', async ({ page }) => {
  await autenticar(page, 'COO');
  await page.route('**/api/prontuarios?*', (route) => route.fulfill({ json: criarPagina([], 1) }));
  await page.goto('/');
  await expect(page.locator('.kpi-value')).toHaveText(['0', '0', '0']);
  await expect(page.getByText('Nenhum acolhimento encontrado.')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
});
