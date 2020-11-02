module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.(test|spec).(ts|js)'],
  moduleFileExtensions: ['js', 'ts'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
      babelConfig: true,
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': '<rootDir>/node_modules/ts-jest',
  },
};
