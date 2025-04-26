// eslint.config.cjs
import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({});

export default [
  // Übernimm alle eslint:recommended-Regeln
  ...compat.extends('eslint:recommended'),

  {
    // Dateien/Ordner, die ESLint ignorieren soll
    ignores: ['node_modules/**', 'dist/**'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
      },
    },

    rules: {
      // Hier kannst du eigene Regeln eintragen, z.B.:
      // 'no-console': 'warn'
    },
  },
];
