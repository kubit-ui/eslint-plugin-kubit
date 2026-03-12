# Kubit ESLint Plugin

<div align="center">

[![npm version](https://img.shields.io/npm/v/@kubit-ui-web/eslint-plugin-kubit.svg)](https://www.npmjs.com/package/@kubit-ui-web/eslint-plugin-kubit)
[![npm downloads](https://img.shields.io/npm/dm/@kubit-ui-web/eslint-plugin-kubit.svg)](https://www.npmjs.com/package/@kubit-ui-web/eslint-plugin-kubit)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**A lightweight, composable ESLint plugin for TypeScript and React projects**

Zero-config presets with all the rules from `eslint-config-kubit`, now as a proper ESLint plugin.
Compatible with Biome, OxLint, and ESLint flat config.

[Installation](#installation) | [Quick Start](#quick-start) | [Configs](#available-configs) | [Rules](#custom-rules) | [Migration](MIGRATION.md) | [Contributing](CONTRIBUTING.md)

</div>

---

## Why this plugin?

`@kubit-ui-web/eslint-plugin-kubit` replaces `eslint-config-kubit` with a better architecture:

| `eslint-config-kubit` (old)           | `@kubit-ui-web/eslint-plugin-kubit` (new)          |
| ------------------------------------- | -------------------------------------------------- |
| Opaque function that hides everything | Transparent, composable flat configs               |
| ~15 plugins bundled as dependencies   | All plugins bundled — one install, zero setup      |
| Incompatible with Biome/OxLint        | Use only what Biome/OxLint don't cover             |
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

For projects using Biome or OxLint for standard rules:

```js
// eslint.config.js
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [kubit.configs["kubit-rules"]];
```

## Available Configs

| Config                  | Description                     | Use case                         |
| ----------------------- | ------------------------------- | -------------------------------- |
| **`recommended`**       | All rules without React         | ESLint only                      |
| **`recommended-react`** | All rules with React + a11y     | ESLint only                      |
| **`biome`**             | Only rules Biome doesn't cover  | ESLint + Biome                   |
| **`oxlint`**            | Only rules OxLint doesn't cover | ESLint + OxLint                  |
| `kubit-rules`           | Only 2 Kubit custom rules       | Biome/OxLint with minimal ESLint |
| `base`                  | General JS/ES6 rules            | Cherry-pick                      |
| `typescript`            | TypeScript-specific rules       | Cherry-pick                      |
| `react`                 | React + a11y rules              | Cherry-pick                      |
| `compat`                | Browser compatibility           | Optional                         |

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

### `kubit/no-index-import`

Disallow imports from index/barrel files to improve tree-shaking.

```js
// Bad
import { Button } from "@/components/Button/index";
import { Button } from "@/components/Button"; // if contains index.ts

// Good
import { Button } from "@/components/Button/Button";
```

**Options**: `aliases`, `ignoreImports` | [Full docs](docs/rules/no-index-import.md)

### `kubit/no-relative-import-paths`

Enforce absolute import paths. Auto-fixable.

```js
// Bad
import { helper } from "../../utils/helper";

// Good
import { helper } from "@/utils/helper";
```

**Options**: `allowSameFolder`, `rootDir`, `prefix`, `allowedDepth` | [Full docs](docs/rules/no-relative-import-paths.md)

## Using with Biome

Use the `biome` config — only the rules Biome doesn't cover + kubit custom rules:

```js
// eslint.config.js
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [kubit.configs.biome];
```

Includes: `import/no-cycle`, `complexity`, `consistent-return`, perfectionist sorting, some `@typescript-eslint` rules, jest rules, and both kubit custom rules.

Biome handles the rest: formatting, `no-debugger`, `no-var`, `prefer-const`, `eqeqeq`, `no-eval`, `no-explicit-any`, `useImportType`, `noUnusedImports`, and more.

## Using with OxLint

Use the `oxlint` config — even smaller because OxLint covers more rules (~10 rules):

```js
// eslint.config.js
const kubit = require("@kubit-ui-web/eslint-plugin-kubit");

module.exports = [kubit.configs.oxlint];
```

Includes: `prettier/prettier`, perfectionist sorting, 3 niche `@typescript-eslint` rules, and both kubit custom rules.

OxLint handles everything else including `import/no-cycle`, `complexity`, jest, most TS rules, React, and a11y rules.

### Comparison: what each config includes

| Rule category       | `recommended` | `biome` | `oxlint` | `kubit-rules` |
| ------------------- | ------------- | ------- | -------- | ------------- |
| Kubit custom rules  | 2             | 2       | 2        | 2             |
| Prettier formatting | 1             | -       | 1        | -             |
| JS code quality     | ~25           | ~10     | -        | -             |
| Import rules        | 3             | 1       | -        | -             |
| Perfectionist       | 3             | 2       | 3        | -             |
| Jest                | 2             | 2       | -        | -             |
| TypeScript          | 11            | 8       | 3        | -             |
| React + a11y        | ~60           | -       | -        | -             |
| **Total rules**     | **~50+**      | **~25** | **~10**  | **2**         |

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
