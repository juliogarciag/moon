module.exports = {
  modulePaths: ["src"],
  moduleFileExtensions: ["js"],
  collectCoverageFrom: ["src/{lib,components,store}/**/*.js"],
  coverageDirectory: "src/coverage",
  testMatch: ["**/*.test.js"],
  moduleNameMapper: {
    "^./styles": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"]
};
