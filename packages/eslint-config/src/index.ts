import type {Linter} from 'eslint';
import type {Options} from 'prettier';

const prettierConfig: Options = {
    arrowParens: 'always',
    bracketSpacing: false,
    endOfLine: 'lf',
    jsxSingleQuote: true,
    printWidth: 80,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    semi: true,
};

const eslintConfig: Linter.Config = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: false,
        commonjs: false,
        es6: true,
        node: false,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    rules: {
        'prettier/prettier': ['error', prettierConfig],
    },
};

export = eslintConfig;
