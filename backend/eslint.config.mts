import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

    extends: [js.configs.recommended],

    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
    },

    rules: {
      "no-console": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },

  ...tseslint.configs.recommended,
]);
