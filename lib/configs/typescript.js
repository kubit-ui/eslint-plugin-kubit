"use strict";

/**
 * TypeScript-specific rules configuration.
 * Migrated from eslint-config-kubit getTypeScriptRules().
 */
const tseslintPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = {
  plugins: {
    "@typescript-eslint": tseslintPlugin,
  },
  rules: {
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      { allowArgumentsExplicitlyTypedAsAny: true },
    ],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      { "ts-expect-error": "allow-with-description" },
    ],
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-duplicate-enum-values": "off",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/no-magic-numbers": [
      "warn",
      { ignoreTypeIndexes: true },
    ],
  },
};
