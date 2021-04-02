module.exports = {
  // This is needed for making Jest respect Babel
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // This is needed to discover JavaScript tests in all folders
  testRegex: '.+\\.(test|spec)\\.jsx?$',

  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  // This is needed to mock css and scss modules
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$':
      '<rootDir>/src/__tests__/__mocks__/styleMock.js',
  },

  setupFilesAfterEnv: [
    './jest_configs/node_fetch.js',
    './jest_configs/react_testing_library.js',
  ],
  testTimeout: 10000,
};
