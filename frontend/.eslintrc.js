/* eslint-env node */
module.exports = {
    extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    ignorePatterns: ['.eslintrc.js', 'node_modules/**', 'dist/**', 'next.config.js', 'postcss.config.js'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        semi: ['error', 'always'],
    },
};
