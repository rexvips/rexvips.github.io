// ESLint Configuration for Portfolio Project
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Code Quality
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    
    // Best Practices
    'eqeqeq': 'error',
    'curly': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    
    // Style
    'indent': ['error', 4],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    
    // Variables
    'no-global-assign': 'error',
    'no-redeclare': 'error',
    
    // Functions
    'no-empty-function': 'warn',
    'consistent-return': 'error',
  },
  globals: {
    // Browser globals
    'document': 'readonly',
    'window': 'readonly',
    'console': 'readonly',
    'navigator': 'readonly',
    
    // Crypto API
    'crypto': 'readonly',
    'TextEncoder': 'readonly',
    
    // Functions from tools.js
    'encodeBase64': 'readonly',
    'decodeBase64': 'readonly',
    'encodeURL': 'readonly',
    'decodeURL': 'readonly',
    'generateSHA256': 'readonly',
    'encodeJWTToken': 'readonly',
    'decodeJWTToken': 'readonly',
    'convertCase': 'readonly',
    'copyToClipboard': 'readonly',
    'clearJWTEncoder': 'readonly',
    'clearJWTDecoder': 'readonly',
    'clearTextConverter': 'readonly',
    'clearJWTEncodedOutput': 'readonly',
    'clearCaseOutput': 'readonly',
  },
};