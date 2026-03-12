"use strict";

/**
 * Biome-compatible configuration.
 *
 * Contains ONLY the rules that Biome does NOT cover.
 * Use this config when running ESLint alongside Biome to avoid duplicated checks.
 *
 * Biome handles: formatting, no-debugger, no-var, prefer-const, eqeqeq,
 * no-unreachable, no-duplicate-imports, useConst, noDoubleEquals,
 * noConsole (partial), noUnusedImports, import sorting, etc.
 *
 * ESLint still needed for: cycle detection, custom kubit rules,
 * some TypeScript rules, jest rules, and React-specific rules
 * that Biome doesn't support yet.
 *
 * Mapping reference:
 *   prettier/prettier         → Biome formatter
 *   curly                     → (partial) style.useSingleCaseStatement
 *   no-debugger               → suspicious.noDebugger
 *   no-var                    → style.noVar
 *   prefer-const              → style.useConst
 *   eqeqeq                   → suspicious.noDoubleEquals
 *   no-unreachable            → correctness.noUnreachable
 *   no-extra-boolean-cast     → complexity.noExtraBooleanCast
 *   no-case-declarations      → correctness.noSwitchDeclarations
 *   no-func-assign            → suspicious.noFunctionAssign
 *   no-cond-assign            → suspicious.noAssignInExpressions
 *   no-constant-condition     → suspicious.noConstantCondition
 *   no-eval                   → security.noGlobalEval
 *   no-param-reassign         → style.noParameterAssign
 *   no-useless-escape         → (partial) complexity.noUselessStringConcat
 *   no-else-return            → style.noUselessElse
 *   no-throw-literal          → style.useThrowOnlyError
 *   no-duplicate-imports      → (partial) suspicious.noDuplicateImports
 *   unused-imports/no-unused  → correctness.noUnusedImports
 *   quotes / semi             → Biome formatter
 *   sort-imports              → Biome organizeImports
 *   @ts/no-explicit-any       → suspicious.noExplicitAny
 *   @ts/consistent-type-imports → style.useImportType
 *   @ts/no-non-null-assertion → style.noNonNullAssertion
 *   react/self-closing-comp   → style.useSelfClosingElements
 *   react/jsx-boolean-value   → (partial)
 *   jsx-a11y/alt-text         → nursery.useAltText
 *   jsx-a11y/anchor-is-valid  → nursery.useValidAnchor
 *   ...and more (see Biome docs for full list)
 */
const importPlugin = require("eslint-plugin-import");
const jestPlugin = require("eslint-plugin-jest");
const perfectionistPlugin = require("eslint-plugin-perfectionist");

module.exports = {
  plugins: {
    import: importPlugin,
    jest: jestPlugin,
    perfectionist: perfectionistPlugin,
  },
  rules: {
    // ─── Rules Biome does NOT cover ───────────────────────────────

    // Import cycle detection (Biome has no equivalent)
    "import/no-cycle": ["error", { maxDepth: 4 }],

    // Complexity (Biome has cognitive complexity, not cyclomatic)
    complexity: ["error", { max: 5 }],

    // Block scoping (no Biome equivalent)
    "block-scoped-var": "error",

    // Consistent return (no Biome equivalent)
    "consistent-return": "error",

    // No lone blocks (no Biome equivalent)
    "no-lone-blocks": "error",

    // No alert (no Biome equivalent)
    "no-alert": "error",

    // No multi spaces (Biome formatter handles spacing but not this)
    "no-multi-spaces": ["error", { ignoreEOLComments: false }],

    // No useless return (no Biome equivalent)
    "no-useless-return": "error",

    // No unneeded ternary (no Biome equivalent)
    "no-unneeded-ternary": "error",

    // Restricted imports (Biome has noRestrictedImports in nursery)
    "no-restricted-imports": [
      "error",
      {
        paths: [],
      },
    ],

    // Jest rules (Biome has noFocusedTests but not no-test-prefixes)
    "jest/no-test-prefixes": "off",
    "jest/no-focused-tests": "error",

    // Perfectionist (Biome organizeImports is limited, no object sort)
    "perfectionist/sort-objects": ["error", { type: "natural" }],
    "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],

    // ─── TypeScript rules Biome does NOT cover ───────────────────

    // Consistent type definitions (no Biome equivalent)
    "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],

    // Explicit module boundary types (no Biome equivalent)
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      { allowArgumentsExplicitlyTypedAsAny: true },
    ],

    // Ban ts-comment with description (Biome has noTsComment but different)
    "@typescript-eslint/ban-ts-comment": [
      "error",
      { "ts-expect-error": "allow-with-description" },
    ],

    // No empty function (no Biome equivalent)
    "@typescript-eslint/no-empty-function": "error",

    // No duplicate enum values (no Biome equivalent)
    "@typescript-eslint/no-duplicate-enum-values": "off",

    // No shadow (Biome has noShadowRestrictedNames but not full no-shadow)
    "@typescript-eslint/no-shadow": "error",

    // No use before define (no Biome equivalent)
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],

    // No magic numbers (no Biome equivalent)
    "@typescript-eslint/no-magic-numbers": [
      "warn",
      { ignoreTypeIndexes: true },
    ],
  },
};
