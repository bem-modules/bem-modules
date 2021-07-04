import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    projects: [
        '<rootDir>/packages/*/jest.config.ts',
    ],
};

export default config;
