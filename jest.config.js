export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    // Ignore mcp-tools.test.js as it uses Node's built-in test runner (node:test)
    'tests/integration/tools/mcp-tools.test.js'
  ],
  collectCoverageFrom: [
    'core/**/*.js',
    'lib/**/*.js',
    'adapters/**/*.js',
    '!**/*.test.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 10000
};
