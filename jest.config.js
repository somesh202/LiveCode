module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text', 'html'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    }
  };
  