// // module.exports = {
// //   env: {
// //     browser: true,
// //     es6: true,
// //   },
// //   extends: [
// //     'plugin:react/recommended',
// //     'airbnb',
// //     'plugin:@typescript-eslint/eslint-recommended',
// //     'plugin:@typescript-eslint/recommended'
// //   ],
// //   globals: {
// //     Atomics: 'readonly',
// //     SharedArrayBuffer: 'readonly',
// //   },
// //   parser: '@typescript-eslint/parser',
// //   parserOptions: {
// //     ecmaFeatures: {
// //       jsx: true,
// //     },
// //     ecmaVersion: 2018,
// //     sourceType: 'module',
// //   },
// //   plugins: [
// //     'react',
// //     '@typescript-eslint',
// //   ],
// //   rules: {

// //     'import/extensions': [
// //       'error',
// //       'ignorePackages',
// //       {
// //         'js': 'never',
// //         'jsx': 'never',
// //         'ts': 'never',
// //         'tsx': 'never'
// //       }
// //     ],
// //     "no-console": 0,
// //     // 'prettier/prettier': 'error',
// //     "@typescript-eslint/no-explicit-any": "off",
// //      "@typescript-eslint/explicit-member-accessibility": 0,
// //     '@typescript-eslint/indent': ['error', 2],
// //     '@typescript-eslint/explicit-function-return-type': 'off',
// //     '@typescript-eslint/no-unused-vars': 'off',
// //     "jsx-a11y/anchor-is-valid": 0,
// //     "jsx-a11y/label-has-associated-control": 0,
// //     'react/jsx-filename-extension': [
// //       1,
// //       { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }
// //     ],
// //     'max-len': [2, 120, 2, {
// //       'ignoreUrls': true,
// //       'ignoreComments': false
// //     }],
// //   },
// //   'settings': {
// //     'react': {
// //       'version': 'detect'
// //     },
// //     'import/resolver': {
// //       'node': {
// //         'extensions': ['.js', '.jsx', '.ts', '.tsx']
// //       }
// //     }
// //   }
// // };

// module.exports = {
//   // Other ESLint configurations...
//   rules: {
//     // Other ESLint rules...
//     '@typescript-eslint/no-non-null-assertion': [
//       'error',
//       {
//         ignoreRestRooms: true,
//         meta: {
//           hasSuggestions: true,
//         },
//       },
//     ],
//   },
// };

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    // Add other ESLint configurations as needed
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // Disable the rule
    "@typescript-eslint/no-use-before-define": "off", // Disable the rule
    "@typescript-eslint/no-empty-function": "off", // Disable the rule
    // Add other rules as needed
  },
};
