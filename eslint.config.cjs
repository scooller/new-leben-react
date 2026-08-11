const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const hooks = require("eslint-plugin-react-hooks");
const refresh = require("eslint-plugin-react-refresh");

module.exports = [
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: require("globals").browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
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
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...hooks.configs.recommended.rules,
      ...refresh.configs.recommended.rules,
      "react-refresh/only-export-components": "off",
      "react/prop-types": "off",
      // ScrollAnim uses custom props (as, animation, delay, duration, stagger)
      "react/no-unknown-property": [
        "error",
        { ignore: ["animation", "delay", "duration", "stagger"] },
      ],
    },
  },
];
