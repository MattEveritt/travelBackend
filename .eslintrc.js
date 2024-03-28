module.exports = {
    root: true,
    env: {
        jest: true, // Add this line
    },
    extends: 'plugin:prettier/recommended',
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                bracketSpacing: true,
                tabWidth: 4,
                printWidth: 80,
            },
        ],
        semi: ['error', 'always'],
        quotes: [2, 'single'],
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'object-curly-spacing': ['error', 'always'],
        'no-trailing-spaces': ['error'],
    },
};
