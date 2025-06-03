
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    '\\.(css|scss)$': 'identity-obj-proxy',

    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',

    '^next/link$': '<rootDir>/__mocks__/nextLink.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: ['/node_modules/'],
}
