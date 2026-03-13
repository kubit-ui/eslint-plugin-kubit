# Kubit ESLint Plugin

<div align="center">

[![npm version](https://img.shields.io/npm/v/@kubit-ui-web/eslint-plugin-kubit.svg)](https://www.npmjs.com/package/@kubit-ui-web/eslint-plugin-kubit)
[![npm downloads](https://img.shields.io/npm/dm/@kubit-ui-web/eslint-plugin-kubit.svg)](https://www.npmjs.com/package/@kubit-ui-web/eslint-plugin-kubit)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**A lightweight, composable ESLint plugin for TypeScript and React projects**

Zero-config presets with all the rules from `eslint-config-kubit`, now as a proper ESLint plugin.
Compatible with OxLint and ESLint flat config.

[Installation](#installation) | [Quick Start](#quick-start) | [Configs](#available-configs) | [Rules](#custom-rules) | [Migration](MIGRATION.md) | [Contributing](CONTRIBUTING.md)

</div>

---

## Why this plugin?

`@kubit-ui-web/eslint-plugin-kubit` replaces `eslint-config-kubit` with a better architecture:

| `eslint-config-kubit` (old)           | `@kubit-ui-web/eslint-plugin-kubit` (new)          |
| ------------------------------------- | -------------------------------------------------- |
| Opaque function that hides everything | Transparent, composable flat configs               |
| ~15 plugins bundled as dependencies   | All plugins bundled — one install, zero setup      |
| Incompatible with OxLint              | Use only what OxLint doesn't cover                 |
| `isReact` flag controls rule loading  | Pick `recommended` or `recommended-react`          |
| Must override to disable rules        | Cherry-pick configs: `base`, `typescript`, `react` |

## Requirements

- **Node.js**: >= 20.19.0
- **ESLint**: >= 9.0.0

## Installation

All ESLint plugins come **bundled** — one install, zero extra setup:

```bash
# Using pnpm (recommended)
pnpm add -D eslint @kubit-ui-web/eslint-plugin-kubit

# Using npm
npm install --save-dev eslint @kubit-ui-web/eslint-plugin-kubit
```

That's it. All plugins (TypeScript, React, a11y, Prettier, Perfectionist, Jest, etc.) are included as direct dependencies and installed automatically.

## Quick Start

### TypeScript project (no React)

```js
// eslint.config.js
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  kubit.configs.recommended,
];
```

### React + TypeScript project

```js
// eslint.config.js
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  kubit.configs["recommended-react"],
];
```

### Minimal (only Kubit custom rules)

For projects using OxLint for standard rules:

```js
// eslint.config.js
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [kubit.configs["kubit-rules"]];
```

## Available Configs

| Config                  | Description                     | Use case                   |
| ----------------------- | ------------------------------- | -------------------------- |
| **`recommended`**       | All rules without React         | ESLint only                |
| **`recommended-react`** | All rules with React + a11y     | ESLint only                |
| **`oxlint`**            | Only rules OxLint doesn't cover | ESLint + OxLint            |
| `kubit-rules`           | Only 2 Kubit custom rules       | OxLint with minimal ESLint |
| `base`                  | General JS/ES6 rules            | Cherry-pick                |
| `typescript`            | TypeScript-specific rules       | Cherry-pick                |
| `react`                 | React + a11y rules              | Cherry-pick                |
| `compat`                | Browser compatibility           | Optional                   |

### Composing configs

You can mix and match individual configs:

```js
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [
  // Only TypeScript + kubit custom rules (no base JS rules)
  kubit.configs.typescript,
  kubit.configs["kubit-rules"],
];
```

### Overriding rules

All rules are visible and overridable:

```js
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [
  kubit.configs.recommended,
  {
    rules: {
      // Override any rule from the preset
      complexity: ["warn", { max: 10 }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",

      // Configure kubit rules with your aliases
      "kubit/no-index-import": [
        "error",
        {
          aliases: {
            "@/components": "./src/components/*",
            "@/utils": "./src/utils/*",
          },
        },
      ],
    },
  },
];
```

## Custom Rules

### Import & Export Rules

| Rule                                                                       | Description                                      | Auto-fix |
| -------------------------------------------------------------------------- | ------------------------------------------------ | -------- |
| [`kubit/no-index-import`](docs/rules/no-index-import.md)                   | Disallow imports from index/barrel files         | ✅       |
| [`kubit/no-relative-import-paths`](docs/rules/no-relative-import-paths.md) | Enforce absolute import paths                    | ✅       |
| [`kubit/enforce-named-exports`](docs/rules/enforce-named-exports.md)       | Disallow default exports for better tree-shaking | -        |

### React / JSX Rules

| Rule                                                       | Description                           | Auto-fix |
| ---------------------------------------------------------- | ------------------------------------- | -------- |
| [`kubit/jsx-pascal-case`](docs/rules/jsx-pascal-case.md)   | Enforce PascalCase for JSX components | -        |
| [`kubit/no-multi-comp`](docs/rules/no-multi-comp.md)       | One component per file                | -        |
| [`kubit/jsx-sort-props`](docs/rules/jsx-sort-props.md)     | Enforce sorted JSX props              | ✅       |
| [`kubit/no-inline-styles`](docs/rules/no-inline-styles.md) | Disallow inline `style={{}}` in JSX   | -        |

### Architecture Rules

| Rule                                                                         | Description                                            | Auto-fix |
| ---------------------------------------------------------------------------- | ------------------------------------------------------ | -------- |
| [`kubit/no-public-field-interface`](docs/rules/no-public-field-interface.md) | Enforce behavior-only interfaces (methods, not fields) | -        |
| [`kubit/no-framework-in-core`](docs/rules/no-framework-in-core.md)           | Prohibit framework imports inside `/core/`             | -        |
| [`kubit/no-cross-boundary-import`](docs/rules/no-cross-boundary-import.md)   | Enforce architectural layer boundaries                 | -        |

## Using with OxLint

All 10 kubit rules work natively in OxLint via the [`jsPlugins`](https://oxc.rs/docs/guide/usage/linter/js-plugins) feature.

### Option A: ESLint config (only rules OxLint doesn't cover)

```js
// eslint.config.js
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [kubit.configs.oxlint];
```

### Option B: OxLint config (load kubit rules directly in OxLint)

Use the ready-made `.oxlintrc.json` presets from the `oxlint/` directory:

```jsonc
// .oxlintrc.json
{
  "extends": [
    "./node_modules/@kubit-ui-web/eslint-plugin-kubit/oxlint/recommended.json",
  ],
}
```

Or pick individual configs:

```jsonc
// .oxlintrc.json
{
  "extends": [
    "./node_modules/@kubit-ui-web/eslint-plugin-kubit/oxlint/base.json",
    "./node_modules/@kubit-ui-web/eslint-plugin-kubit/oxlint/typescript.json",
    "./node_modules/@kubit-ui-web/eslint-plugin-kubit/oxlint/architecture.json",
  ],
}
```

### Option C: Manual `jsPlugins` setup

Add the plugin directly to your `.oxlintrc.json`:

```jsonc
// .oxlintrc.json
{
  "jsPlugins": ["@kubit-ui-web/eslint-plugin-kubit"],
  "rules": {
    "kubit/no-index-import": "error",
    "kubit/enforce-named-exports": "error",
    "kubit/no-framework-in-core": "error",
    "kubit/no-cross-boundary-import": "error",
    "kubit/jsx-pascal-case": "error",
    "kubit/no-multi-comp": "error",
    "kubit/jsx-sort-props": [
      "error",
      { "callbacksLast": true, "shorthandFirst": true, "reservedFirst": true },
    ],
    "kubit/no-inline-styles": "error",
    "kubit/no-public-field-interface": "error",
  },
}
```

### OxLint presets

| Preset                     | Contents                                      |
| -------------------------- | --------------------------------------------- |
| `oxlint/recommended.json`  | Everything below combined                     |
| `oxlint/base.json`         | JS quality + import/jest + kubit import rules |
| `oxlint/typescript.json`   | TS rules + `no-public-field-interface`        |
| `oxlint/react.json`        | React + a11y + JSX kubit rules                |
| `oxlint/architecture.json` | Layer boundaries + framework isolation        |

### Comparison: what each config includes

| Rule category       | `recommended` | `oxlint` | `kubit-rules` |
| ------------------- | ------------- | -------- | ------------- |
| Kubit custom rules  | 10            | 10       | 2             |
| Prettier formatting | 1             | 1        | -             |
| JS code quality     | ~25           | -        | -             |
| Import rules        | 3             | -        | -             |
| Perfectionist       | 3             | 3        | -             |
| Jest                | 2             | -        | -             |
| TypeScript          | 11            | 3        | -             |
| React + a11y        | ~60           | -        | -             |
| **Total rules**     | **~60+**      | **~20**  | **2**         |

## Migrating from `eslint-config-kubit`

See the full [Migration Guide](MIGRATION.md) for step-by-step instructions.

**TL;DR:**

```diff
- const eslintFlatConfig = require("eslint-config-kubit");
- module.exports = eslintFlatConfig({ isReact: false, tsConfigPath: "..." });
+ const kubit = require("@kubit-ui-web/eslint-plugin-kubit");
+ module.exports = [kubit.configs.recommended];
```

## Development

```bash
pnpm install
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm lint
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This project uses [Changesets](https://github.com/changesets/changesets) for automatic version management and publishing.

## Documentation

- [Migration Guide](MIGRATION.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with care by the [Kubit Team](https://www.kubit-ui.com/)**

</div>
