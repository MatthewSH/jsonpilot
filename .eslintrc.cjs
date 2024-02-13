module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'import', 'jsx-a11y'],
  ignorePatterns: ['node_modules', 'dist', '.eslintrc.cjs'],
  settings: {
    // For the import/order rule. Configures how it tells if an import is "internal" or not.
    // An "internal" import is basically just one that's aliased.
    //
    // See...
    // - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#groups-array
    // - https://github.com/import-js/eslint-plugin-import/blob/main/README.md#importinternal-regex
    'import/internal-regex': '^src/',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    // We use the most modern environment available. Then we rely on Babel to
    // transpile it to something that can run on all node versions we support
    es2022: true,
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-console': 'off',
    'prefer-object-spread': 'warn',
    'prefer-spread': 'warn',
    'no-unused-expressions': [
      'error',
      { allowShortCircuit: true, allowTernary: true },
    ],
    'no-useless-escape': 'off',
    camelcase: ['warn', { properties: 'never' }],
    'no-new': 'warn',
    'new-cap': ['error', { newIsCap: true, capIsNew: false }],
    'no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        // We set this to an empty array to override the default value, which is `['builtin', 'external', 'object']`.
        // Judging by the number of issues on the repo, this option seems to be notoriously tricky to understand.
        // From what I can tell, if the value of this is `['builtin']` that means it won't sort builtins.
        // But we have a rule for builtins below (react), so that's not what we want.
        //
        // See...
        // - https://github.com/import-js/eslint-plugin-import/pull/1570
        // - https://github.com/import-js/eslint-plugin-import/issues/1565
        pathGroupsExcludedImportTypes: [],
        // Only doing this to add internal. The order here maters.
        // See https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#groups-array
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-restricted-imports': ['error'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': 'warn',
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        camelcase: 'off',
        '@typescript-eslint/camelcase': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
      },
    },
    {
      files: ['*.test.*', '**/__mocks__/**'],
      env: {
        node: true,
        es6: true,
        commonjs: true,
        jest: true,
      },
    },
    {
      files: [
        '.babelrc.js',
        'babel.config.js',
        '.eslintrc.js',
        '*.config.js',
        'jest.setup.js',
      ],
      env: {
        node: true,
        commonjs: true,
        jest: true,
      },
    },
  ],
}
