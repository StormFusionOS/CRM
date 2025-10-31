import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "<rootDir>/test-style-mock.js",
  },
};

export default config;
