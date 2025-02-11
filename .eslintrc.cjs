module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'eslint:recommended',
        'plugin:perfectionist/recommended-natural-legacy',
        'plugin:testing-library/react',
    ],
    globals: {
        ImportMetaEnv: true,
        JSX: true,
    },
    overrides: [
        {
            extends: ['plugin:testing-library/react'],
            // 3) Now we enable eslint-plugin-testing-library rules or preset only for matching testing files!
            files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['jsx-a11y', 'prettier', 'import', 'react', 'react-hooks', '@typescript-eslint', 'perfectionist'],
    rules: {
        '@typescript-eslint/no-use-before-define': ['error'],
        'import/extensions': [
            'error',
            'never',
            { gql: 'always', jpg: 'always', json: 'always', png: 'always', routes: 'always', svg: 'always' },
        ],
        'import/order': [
            'warn',
            {
                alphabetize: {
                    order: 'asc',
                },
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'always',
            },
        ],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-undef': 'off',
        'no-unexpected-multiline': 'error',
        'no-unused-vars': 'off',
        // note you must disable the base rule as it can report incorrect errors
        'no-use-before-define': 'off',
        'perfectionist/sort-imports': 'off',
        'perfectionist/sort-union-types': ['error'],
        'prefer-const': 'error',
        'prettier/prettier': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react/jsx-uses-react': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
    },
};
