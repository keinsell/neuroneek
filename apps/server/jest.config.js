// const MODULE_NAME_MAPPING = {
//     '^\\^/(.+)$': '<rootDir>/$1',
//     '^~/(.+)$': '<rootDir>/src/$1',
// };
//

module.exports = {
    displayName: 'server',
    transform: {
        "\\.[jt]sx?$": ["ts-jest", {useESM: true}],
    },
    moduleNameMapper: {
        "(.+)\\.js": "$1"
    },
    extensionsToTreatAsEsm: [".ts"],
    rootDir: '.',
    roots: ['<rootDir>'],
    testMatch: ['<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.js', '<rootDir>/**/*.spec.js', '<rootDir>/**/*.spec.ts'],
    // https://regex101.com/r/jTaxYS/1
    testEnvironment: 'node',
    // globalSetup: '<rootDir>/test/integration/global-setup.js',
    // globalTeardown: '<rootDir>/test/integration/global-teardown.js',
    // setupFilesAfterEnv: ['<rootDir>/test/integration/setup.js'],

    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    // moduleNameMapper: MODULE_NAME_MAPPING,

    setupFilesAfterEnv: ["<rootDir>/test/setup/prisma.ts"],
};

