module.exports = {
  rootDir: __dirname,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  coverageReporters: ['text', 'text-summary', 'cobertura'],
  coveragePathIgnorePatterns: ['<rootDir>/src/clients'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  globalSetup: '<rootDir>/tests/setup.ts',
  globalTeardown: '<rootDir>/tests/teardown.ts',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!node-fetch|fetch-blob)'],
};
