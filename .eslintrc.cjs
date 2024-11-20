module.exports = {
  extends: ["plugin:smile/ts"],
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  rules: {
    "@typescript-eslint/prefer-for-of": "off",
    "prefer-template": "off",
  },
};
