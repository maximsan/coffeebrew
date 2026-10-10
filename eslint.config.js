const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      // Theme typing extends styled-components' DefaultTheme by declaration merging.
      "@typescript-eslint/no-empty-object-type": [
        "warn",
        { allowInterfaces: "with-single-extends" },
      ],
    },
  },
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "dist/",
      "web-build/",
      "ios/",
      "android/",
      "coverage/",
    ],
  },
]);
