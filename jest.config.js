/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.spec.js'],
  // server/ has its own suite (npm --prefix server test).
  testPathIgnorePatterns: ['/node_modules/', '/server/', '/extracted/'],
};
