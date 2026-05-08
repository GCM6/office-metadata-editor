import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'react-refresh/only-export-components': 'off',
      'prefer-arrow-callback': 'off',
      'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
      'no-else-return': ['error', { allowElseIf: false }],
      'no-lonely-if': 'error',
      'max-depth': ['error', 2],
      'max-lines-per-function': [
        'warn',
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
      'max-params': ['error', 3],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: { array: false, object: true },
          AssignmentExpression: { array: false, object: false },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'object-shorthand': ['error', 'always'],
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          pathGroups: [
            { pattern: 'node:*', group: 'builtin', position: 'before' },
            { pattern: '@*/**', group: 'external', position: 'before' },
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom', group: 'external', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['react', 'type'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'VariableDeclarator > ArrowFunctionExpression',
          message:
            'Use function declarations instead of arrow functions to keep main logic stable for future diffs.',
        },
        {
          selector: 'Property[value.type="ArrowFunctionExpression"]',
          message:
            'Use method shorthand or function declarations instead of arrow functions on object properties.',
        },
        {
          selector: 'ExportDefaultDeclaration > ArrowFunctionExpression',
          message: 'Use named function declarations instead of default-export arrow functions.',
        },
        {
          selector: 'ChainExpression',
          message:
            'Avoid optional chaining. Prefer local variables and early returns for readability and predictable behavior.',
        },
        {
          selector: "LogicalExpression[operator='??']",
          message:
            'Avoid nullish coalescing. Prefer explicit defaults via early return or local variables.',
        },
      ],
    },
  },
])
