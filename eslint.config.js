import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
    // 1. Base ESLint recommended rules for ALL files
    js.configs.recommended,

    // 2. TypeScript ESLint recommended rules for ALL .ts files
    ...tseslint.configs.recommended,

    // 3. Global TypeScript configuration
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            // Single quotes by default, backticks when needed, double quotes to avoid escaping
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },

    // 4. Playwright-specific rules for test files ONLY
    {
        files: ['tests/**/*.ts', '**/*.spec.ts', 'e2e/**/*.ts'],
        ...playwright.configs['flat/recommended'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            // Override or add Playwright rules
            'playwright/no-wait-for-timeout': 'warn',
            'playwright/expect-expect': 'error',
            'playwright/no-element-handle': 'error',
            'playwright/no-eval': 'error',
            'playwright/no-focused-test': 'error',
            'playwright/no-skipped-test': 'warn',
        },
    },

    // 5. Node.js configuration for JavaScript files
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
            },
        },
        rules: {
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
        },
    },
];