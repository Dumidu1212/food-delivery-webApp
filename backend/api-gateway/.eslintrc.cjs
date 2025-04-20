// backend/api-gateway/.eslintrc.cjs
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: ["eslint:recommended"],
  rules: {
    "no-console": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  ignorePatterns: ["node_modules/", "dist/"],
};
