import { defineConfig } from '@playwright/test';

const porta = Number(process.env.TEST_FRONT_PORT || 4176);
const baseURL = `http://127.0.0.1:${porta}`;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL, browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${porta} --strictPort`,
    url: baseURL,
    reuseExistingServer: false,
    env: { VITE_API_URL: process.env.TEST_API_URL || '/api', VITE_BASE: '/' },
  },
});
