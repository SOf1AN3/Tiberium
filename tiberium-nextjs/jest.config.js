module.exports = {
   testEnvironment: 'node',
   coveragePathIgnorePatterns: ['/node_modules/'],
   testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
   collectCoverageFrom: [
      'src/pages/api/**/*.js',
      'src/lib/**/*.js',
      '!src/pages/api/socket.js', // Exclude Socket.IO handler
   ],
};
