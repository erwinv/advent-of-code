module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  rootDir: "build",
  testMatch: ['**/__tests__/**/*.[j]s?(x)', '**/?(*.)+(spec|test).[j]s?(x)'],
  globalSetup: '<rootDir>/test/globalSetup.js',
  verbose: true,
}
