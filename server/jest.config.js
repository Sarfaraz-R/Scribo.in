export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  transform: {},
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/tests/**'],
};
