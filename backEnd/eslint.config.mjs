import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // O código atual usa `any` em catch e nas conversões de payload.
      // Manter desligado agora, como no frontEnd, para não transformar este
      // card em refatoração de tipos.
      '@typescript-eslint/no-explicit-any': 'off',
      // Warn, não error: os achados existentes não são corrigidos neste card.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
