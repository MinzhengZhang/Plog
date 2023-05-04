module.exports = {
  transformIgnorePatterns: ['node_modules/(?!\@?axios)'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/cssStub.js',
    '\\.(jpg)$': '<rootDir>/cssStub.js',
    '\\.(png)$': '<rootDir>/cssStub.js',
  },
};
