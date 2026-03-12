"use strict";

/**
 * Base JavaScript/ES6 rules configuration.
 * These are general code quality rules that apply to all JS/TS projects.
 * Migrated from eslint-config-kubit getGeneralRules() and getCustomRules().
 *
 * Includes: languageOptions defaults, import resolver settings,
 * and all non-TS, non-React rules from the original config.
 */

const prettierPlugin = require("eslint-plugin-prettier");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");
const importPlugin = require("eslint-plugin-import");
const jestPlugin = require("eslint-plugin-jest");
const perfectionistPlugin = require("eslint-plugin-perfectionist");

const SUPPORTED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

module.exports = {
  plugins: {
    prettier: prettierPlugin,
    "unused-imports": unusedImportsPlugin,
    import: importPlugin,
    jest: jestPlugin,
    perfectionist: perfectionistPlugin,
  },
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      NodeJS: "writable",
    },
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: SUPPORTED_EXTENSIONS,
      },
    },
  },
  rules: {
    // Code quality rules
    "prettier/prettier": ["error"],
    curly: ["error", "all"],
    "no-cond-assign": ["error", "always"],
    "no-constant-condition": "error",
    "no-debugger": "error",
    "no-useless-escape": "error",
    "no-case-declarations": "warn",
    "no-extra-boolean-cast": ["error", { enforceForLogicalOperands: true }],
    "no-extra-semi": "error",
    "no-func-assign": "error",
    "no-inner-declarations": "error",
    "no-use-before-define": "off",
    "no-undef": "error",
    "no-unreachable": "error",

    // Style rules
    quotes: [
      "error",
      "single",
      { avoidEscape: true, allowTemplateLiterals: false },
    ],
    semi: ["error", "always"],
    eqeqeq: ["error", "always", { null: "ignore" }],

    // Complexity and best practices
    complexity: ["error", { max: 5 }],
    "block-scoped-var": "error",
    "no-else-return": ["error", { allowElseIf: false }],
    "no-eval": "error",
    "no-lone-blocks": "error",
    "no-multi-spaces": ["error", { ignoreEOLComments: false }],
    "no-useless-return": "error",
    "no-var": "error",
    "no-console": "error",
    "no-alert": "error",
    "no-duplicate-imports": "error",
    "no-param-reassign": "error",
    "prefer-const": "error",
    "consistent-return": "error",
    "no-unneeded-ternary": "error",
    "no-throw-literal": "error",

    // Restricted imports (empty paths by default, consumer overrides)
    "no-restricted-imports": [
      "error",
      {
        paths: [],
      },
    ],

    // Disabled rules
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "node/no-unpublished-import": "off",

    // Import rules
    "unused-imports/no-unused-imports": "error",
    "import/no-cycle": ["error", { maxDepth: 4 }],
    "import/no-unresolved": "off",

    // Testing rules
    "jest/no-test-prefixes": "off",
    "jest/no-focused-tests": "error",

    // Code organization rules
    "perfectionist/sort-objects": ["error", { type: "natural" }],
    "perfectionist/sort-imports": [
      "error",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],
  },
};
