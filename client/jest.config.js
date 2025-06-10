module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: ['**/src/**/*.test.{js,jsx}'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios|framer-motion)/)'
  ],
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  globals: {
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.test.{js,jsx}'
  ]
};
