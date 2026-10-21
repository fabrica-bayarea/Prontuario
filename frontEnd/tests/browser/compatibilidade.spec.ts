import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test.skip(!process.env.TEST_SESSOES, 'Executado por npm run test:integracao, com PostgreSQL descartável.');

const telas = [
  { nome: 'Painel', rota: '/', perfil: 'COO', busca: 'Buscar por nome do paciente', item: '.recente-item' },
  { nome: 'Pacientes', rota: '/pacientes', perfil: 'ATE', busca: 'Pesquisar por Nome', item: '.pacientes-table tbody tr' },
  { nome: 'Triagem', rota: '/triagem', perfil: 'ATE', busca: 'Buscar por paciente', item: '.acolhimento-card' },
  { nome: 'Validação', rota: '/validacao', perfil: 'PRO', busca: 'Buscar aluno', item: '.prontuario-card' },
];

for (const tela of telas) {
  test(`API real: ${tela.nome} alcança o registro 201 e preserva permissões`, async ({ page }) => {
    const sessoes = JSON.parse(readFileSync(process.env.TEST_SESSOES!, 'utf8'));
    await page.addInitScript((sessao) => {
      localStorage.setItem('usuario', JSON.stringify(sessao.usuario));
      localStorage.setItem('token', sessao.token);
    }, sessoes[tela.perfil]);
    const paginasConcluidas: number[] = [];
    page.on('requestfinished', (request) => {
      const url = new URL(request.url());
      if (url.pathname === '/api/prontuarios') paginasConcluidas.push(Number(url.searchParams.get('pagina')));
    });
    await page.goto(tela.rota);
    if (tela.nome === 'Painel') await expect(page.locator('.kpi-value')).toHaveText(['201', '201', '1']);
    else await expect(page.locator(tela.item)).toHaveCount(tela.nome === 'Validação' ? 1 : 201);
    await page.getByPlaceholder(new RegExp(tela.busca)).fill('Paciente Última Página');
    await expect(page.locator(tela.item)).toHaveCount(1);
    await expect(page.locator(tela.item)).toContainText('Paciente Última Página');
    await expect(page.getByRole('alert')).toHaveCount(0);
    expect([...new Set(paginasConcluidas)]).toEqual(process.env.TEST_FORMATO === 'array' ? [1] : [1, 2, 3]);
    if (tela.perfil === 'ATE') await expect(page.getByRole('link', { name: /Validação/ })).toHaveCount(0);
    if (tela.perfil === 'COO') await expect(page.getByRole('button', { name: /Agendar consulta/i })).toHaveCount(0);
  });
}
