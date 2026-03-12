"use strict";

/**
 * OxLint-compatible configuration.
 *
 * Contains ONLY the rules that OxLint does NOT cover.
 * Use this config when running ESLint alongside OxLint.
 *
 * OxLint covers MORE rules than Biome because it is a dedicated linter
 * with support for: eslint core, @typescript-eslint, react, jsx-a11y,
 * import (including no-cycle!), jest, and unicorn rules.
 *
 * OxLint handles (not exhaustive):
 *   ── Core ──
 *   no-debugger, no-var, prefer-const, eqeqeq, no-eval,
 *   no-unreachable, no-cond-assign, no-constant-condition,
 *   no-case-declarations, no-func-assign, no-extra-boolean-cast,
 *   no-param-reassign, no-else-return, no-throw-literal,
 *   no-alert, no-console, no-lone-blocks, complexity,
 *   block-scoped-var, consistent-return, no-useless-return,
 *   no-unneeded-ternary, no-duplicate-imports, no-useless-escape
 *
 *   ── Import ──
 *   import/no-cycle, import/no-unresolved,
 *   unused-imports/no-unused-imports (via no-unused-vars)
 *
 *   ── TypeScript ──
 *   @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion,
 *   @typescript-eslint/consistent-type-imports, @typescript-eslint/ban-ts-comment,
 *   @typescript-eslint/no-empty-function, @typescript-eslint/no-shadow,
 *   @typescript-eslint/no-use-before-define, @typescript-eslint/no-magic-numbers
 *
 *   ── React ──
 *   react/jsx-key, react/jsx-no-duplicate-props, react/jsx-no-undef,
 *   react/self-closing-comp, react/no-danger, react/jsx-no-target-blank,
 *   react/no-unstable-nested-components
 *
 *   ── a11y ──
 *   jsx-a11y/alt-text, jsx-a11y/anchor-is-valid, jsx-a11y/aria-props,
 *   jsx-a11y/aria-role, jsx-a11y/click-events-have-key-events,
 *   jsx-a11y/heading-has-content, jsx-a11y/html-has-lang,
 *   jsx-a11y/no-access-key, jsx-a11y/no-autofocus,
 *   jsx-a11y/no-redundant-roles, jsx-a11y/tabindex-no-positive, ...
 *
 *   ── Jest ──
 *   jest/no-focused-tests
 *
 * ESLint still needed for: custom kubit rules, prettier formatting,
 * perfectionist sorting, and a few niche rules.
 */
const prettierPlugin = require("eslint-plugin-prettier");
const perfectionistPlugin = require("eslint-plugin-perfectionist");

module.exports = {
  plugins: {
    prettier: prettierPlugin,
    perfectionist: perfectionistPlugin,
  },
  rules: {
    // ─── Rules OxLint does NOT cover ─────────────────────────────

    // Prettier formatting (OxLint is not a formatter)
    "prettier/prettier": ["error"],

    // Restricted imports (OxLint supports basic version but not full config)
    "no-restricted-imports": [
      "error",
      {
        paths: [],
      },
    ],

    // Perfectionist (OxLint has no equivalent for object/export sorting)
    "perfectionist/sort-objects": ["error", { type: "natural" }],
    "perfectionist/sort-imports": [
      "error",
      {
        order: "asc",
        type: "natural",
      },
    ],
    "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],

    // ─── TypeScript rules OxLint does NOT cover ──────────────────

    // Consistent type definitions (no OxLint equivalent)
    "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],

    // Explicit module boundary types (no OxLint equivalent)
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      { allowArgumentsExplicitlyTypedAsAny: true },
    ],

    // No duplicate enum values (no OxLint equivalent)
    "@typescript-eslint/no-duplicate-enum-values": "off",
  },
};
