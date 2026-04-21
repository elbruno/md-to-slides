export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/test/**/*.test.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js' // Entry point, tested via E2E
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  testTimeout: 10000,
  verbose: true,
  resetModules: true
};
