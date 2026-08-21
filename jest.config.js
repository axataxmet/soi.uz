/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.spec.js'],
  // server/ has its own suite (npm --prefix server test).
  // tests/visual/ — снимки вёрстки, их гоняет Playwright (npm run test:visual):
  // под jsdom они бы просто падали, попадая сюда по общему шаблону *.spec.js.
  testPathIgnorePatterns: ['/node_modules/', '/server/', '/extracted/', '/tests/visual/'],
};
