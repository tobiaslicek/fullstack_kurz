import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import css from '@eslint/css';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      js,
      '@stylistic': stylistic,
    },
    rules: {
      ...js.configs.recommended.rules,
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quote-props': ['error', 'as-needed'],
    },
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.css'],
    language: 'css',
    plugins: {
      css,
    },
    rules: {
      ...css.configs.recommended.rules,
    },
  },
]);