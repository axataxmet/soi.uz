/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  // The generated Prisma clients are large and never under test.
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/prisma/etender/generated/'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.module.ts', '!src/main.ts'],
};
