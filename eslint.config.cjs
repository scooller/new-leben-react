const react = require("eslint-plugin-react");
const hooks = require("eslint-plugin-react-hooks");
const refresh = require("eslint-plugin-react-refresh");

module.exports = [
  require("eslint/conf/eslint-recommended"),
  react.configs.recommended,
  react.configs["jsx-runtime"],
  hooks.configs.recommended,
  refresh.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      env: {
        browser: true,
        es2021: true,
      },
    },
    plugins: {
      react,
      "react-hooks": hooks,
      "react-refresh": refresh,
    },
    settings: {
      react: { version: "19.0" },
    },
    rules: {
      "react-refresh/only-export-components": "off",
      "react/prop-types": "off",
    },
  },
];
