// https://jestjs.io/docs/en/configuration
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    bail: true,
    collectCoverageFrom: ['**/*.ts', '!src/index.ts'],
    // default: ["/node_modules/"]
    coveragePathIgnorePatterns: [
        '<rootDir>/.nyc_output/',
        '<rootDir>/.vscode/',
        '<rootDir>/build/',
        '<rootDir>/config/',
        '<rootDir>/coverage/',
        '<rootDir>/dist/',
        '<rootDir>/node_modules/',
        '<rootDir>/scripts/',
        '<rootDir>/temp/',
        '<rootDir>/src/auto/service/mock/',
        '<rootDir>/src/auto/graphql',
        '<rootDir>/src/auto/html',
    ],
    coverageReporters: ['text-summary', 'html'],
    errorOnDeprecated: true,
    verbose: true,
};
