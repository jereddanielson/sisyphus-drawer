module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: [],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};
