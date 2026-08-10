import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "blob-report/**",
    "coverage/**",
    "dist/**",
    "playwright-report/**",
    "storybook-static/**",
    "test-results/**",
    "node_modules/**",
    "public/**",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/refs": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-refresh/only-export-components": "off",
      "prefer-const": "warn",
    },
  },
  {
    files: ["*.config.{js,cjs,mjs,ts}", ".storybook/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
      "react-refresh/only-export-components": "off",
    },
  },
]);
