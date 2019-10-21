const path = require("path");

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: path.resolve("./config/webpack/environment.js")
      },
      node: {
        paths: ["src"],
        extensions: [".js"]
      }
    },
    react: {
      version: "16.7.0"
    }
  },
  parser: "babel-eslint",
  plugins: ["import", "react", "prettier"],
  rules: {
    "no-dupe-keys": "error",
    "no-undef": "error",
    "no-unreachable": "error",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }
    ],
    "no-useless-constructor": "error",
    "no-var": "error",
    "no-duplicate-imports": "error",
    "no-duplicate-case": "error",
    "import/no-unresolved": "error",
    "import/default": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "error",
    "react/react-in-jsx-scope": "error",
    "react/no-string-refs": "error",
    "react/prop-types": ["error", { skipUndeclared: true }],
    "react/forbid-prop-types": "error",
    "react/prefer-stateless-function": [
      "error",
      { ignorePureComponents: true }
    ],
    "prettier/prettier": "error",
    "no-console": "error",
    "no-debugger": "error"
  }
};
