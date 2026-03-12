# Migration Guide

## Migrating from `eslint-config-kubit` to `eslint-plugin-kubit`

This guide explains how to migrate from the monolithic `eslint-config-kubit` (function-based config) to `eslint-plugin-kubit` (proper ESLint plugin with composable configs).

### Why Migrate?

| `eslint-config-kubit` (old)           | `eslint-plugin-kubit` (new)                  |
| ------------------------------------- | -------------------------------------------- |
| Opaque function that hides everything | Transparent, composable flat configs         |
| All-or-nothing configuration          | Cherry-pick: `base`, `typescript`, `react`   |
| Incompatible with Biome/OxLint        | Use `kubit-rules` config alongside Biome     |
| `isReact` flag controls rule loading  | Pick `recommended` or `recommended-react`    |
| Hidden rule configurations            | All rules visible and overridable            |
| All plugins bundled as dependencies   | All plugins still bundled (zero extra setup) |

### Step 1: Install the new plugin

All ESLint plugins come **bundled** — one install, zero extra setup:

```bash
# Remove the old config
pnpm remove eslint-config-kubit

# Install the new plugin (all plugins included automatically)
pnpm add -D eslint-plugin-kubit
```

### Step 2: Update your `eslint.config.js`

**Before** (eslint-config-kubit):

```js
const eslintFlatConfig = require("eslint-config-kubit");
const path = require("path");

module.exports = eslintFlatConfig({
  isReact: false,
  tsConfigPath: path.resolve(__dirname, "./tsconfig.eslint.json"),
  noIndexImportConfig: {
    aliases: {
      "@/components": "./src/components/*",
      "@/utils": "./src/utils/*",
    },
  },
  globals: {
    console: "readonly",
    process: "readonly",
  },
  overrides: [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "off",
      },
    },
  ],
});
```

**After** (eslint-plugin-kubit):

```js
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const kubit = require("eslint-plugin-kubit");
const path = require("path");

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Kubit recommended config (base + typescript + kubit custom rules)
  kubit.configs.recommended,

  // Project-specific overrides
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
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

      // Your project-specific rules (previously in overrides)
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
];
```

### Step 3: Rule name mapping

| Old rule name (eslint-config-kubit)                 | New rule name (eslint-plugin-kubit) |
| --------------------------------------------------- | ----------------------------------- |
| `@kubit-ui-web/no-index-import/no-index-import`     | `kubit/no-index-import`             |
| `no-relative-import-paths/no-relative-import-paths` | `kubit/no-relative-import-paths`    |

### Step 4: Use React config (if needed)

If your project uses React, simply use `recommended-react` instead of `recommended`.
No extra installs needed — React, a11y, and hooks plugins are already bundled:

```js
const kubit = require("eslint-plugin-kubit");

module.exports = [
  // Use recommended-react instead of recommended
  kubit.configs["recommended-react"],
  // ... your project-specific overrides
];
```

### Step 5: Integrate with Biome (optional)

If you're also migrating to Biome, you can now remove from ESLint all the rules that Biome covers:

```jsonc
// biome.json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
    },
  },
  "formatter": {
    "enabled": true,
  },
  "organizeImports": {
    "enabled": true,
  },
}
```

Your `eslint.config.js` becomes minimal — only rules Biome doesn't cover:

```js
const kubit = require("eslint-plugin-kubit");

module.exports = [
  kubit.configs.recommended,
  {
    rules: {
      "kubit/no-index-import": [
        "error",
        {
          aliases: {
            "@/components": "./src/components/*",
          },
        },
      ],
    },
  },
];
```
