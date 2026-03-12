# @kubit-ui-web/eslint-plugin-kubit

## 0.0.3

### New Custom Rules

- `kubit/jsx-pascal-case` — Enforce PascalCase for user-defined JSX components
- `kubit/no-multi-comp` — Enforce only one React component definition per file
- `kubit/jsx-sort-props` — Enforce sorted props in JSX elements (reservedFirst, shorthandFirst, callbacksLast)

### OxLint Configs

- `oxlint/react.json` — React, React Hooks, and JSX a11y rules for OxLint (includes the 3 new kubit rules)
- `oxlint/recommended.json` — Now extends `react.json` for full React coverage

## 0.0.2

### Fixes

- Lazy-load ESLint configs to support OxLint `jsPlugins` without ESLint installed
- Configs are only resolved when accessed, allowing OxLint to load only the custom rules

## 0.0.1

### Initial Release

Full migration from `eslint-config-kubit` to `@kubit-ui-web/eslint-plugin-kubit`.

### Custom Rules

- `kubit/no-index-import` — Disallow imports from index/barrel files
- `kubit/no-relative-import-paths` — Enforce absolute import paths (auto-fixable)

### ESLint Configs

- `recommended` — Base + TypeScript + kubit custom rules (no React)
- `recommended-react` — Recommended + React + JSX a11y rules
- `base` — General JS/ES6 rules (prettier, import, jest, perfectionist)
- `typescript` — TypeScript-specific rules
- `react` — React + JSX accessibility rules
- `compat` — Browser compatibility rules
- `kubit-rules` — Only the 2 custom kubit rules
- `biome` — Rules Biome doesn't cover + kubit custom rules
- `oxlint` — Rules OxLint doesn't cover + kubit custom rules

### OxLint Configs (JSON)

- `oxlint/recommended.json` — Base + TypeScript rules for OxLint
- `oxlint/base.json` — Core JS, import, jest rules for OxLint
- `oxlint/typescript.json` — TypeScript rules for OxLint

Compatible with OxLint `jsPlugins` for loading kubit custom rules natively.

### Bundled Dependencies

All third-party ESLint plugins are bundled as direct dependencies.
Users only need to install `eslint-plugin-kubit` — no manual plugin installs required.

### CI/CD

- PR validation workflow (Node 20 + 22)
- Automated release workflow with Changesets
