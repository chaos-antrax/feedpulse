import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  setupFiles: ["<rootDir>/tests/setupEnv.ts"],
  clearMocks: true,
  moduleFileExtensions: ["ts", "js", "json"],
};

export default config;
