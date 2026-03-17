# @kubit-ui-web/eslint-plugin-kubit

## 0.0.8

### Patch Changes

- add push trigger to release workflow for direct-to-main releases

  PR: #push-e615ddd0b1b63f83095a83b9a44d5b780d414879

## 0.0.7

### Patch Changes

- b4cd4a0: fix(ci): add typescript as devDependency and fix PR validation workflow

  - Added `typescript` to devDependencies to resolve `Cannot find module 'typescript'` errors in CI
  - Fixed `changeset status` by fetching `main` branch with full history in PR validation workflow

## 0.0.6

### Fixes

- OxLint configs now use relative path `../lib/index.js` instead of package specifier `@kubit-ui-web/eslint-plugin-kubit` for `jsPlugins`
- Fixes `Plugin 'kubit' not found` error in CI environments when using `extends` with oxlint presets
- Updated README with corrected OxLint integration examples

## 0.0.5

### New Custom Rules — Architecture (Phase 2)

- `kubit/no-public-field-interface` — Enforce behavior-only interfaces (methods, not fields)
- `kubit/no-framework-in-core` — Prohibit framework imports (React, Angular, Vue, etc.) inside `/core/` directories
- `kubit/enforce-named-exports` — Disallow default exports for better tree-shaking and refactoring safety
- `kubit/no-cross-boundary-import` — Enforce architectural layer boundaries (core, adapters, interfaces, utils)
- `kubit/no-inline-styles` — Disallow inline `style={{}}` in JSX elements

### Auto-fix (Phase 1)

- `kubit/jsx-sort-props` — Auto-fix now reorders JSX props (respects reservedFirst, shorthandFirst, callbacksLast)
- `kubit/no-index-import` — Auto-fix now strips `/index`, `/index.ts`, `/index.tsx`, `/index.js`, `/index.jsx` suffixes

### Tests (Phase 1)

- Added unit tests for `jsx-pascal-case` (16 tests), `no-multi-comp` (13 tests), `jsx-sort-props` (17 tests)
- Added unit tests for all 5 new architecture rules (62 tests)
- Total: 147 tests across 11 test files

### Documentation (Phase 1 + 2)

- Added full docs for all 8 rules: `jsx-pascal-case`, `no-multi-comp`, `jsx-sort-props`, `no-inline-styles`, `no-public-field-interface`, `no-framework-in-core`, `enforce-named-exports`, `no-cross-boundary-import`

### OxLint Integration

- All OxLint configs now include `jsPlugins: ["@kubit-ui-web/eslint-plugin-kubit"]` for native rule loading
- New `oxlint/architecture.json` preset with layer boundary and framework isolation rules
- `oxlint/base.json` — Added kubit import/export rules
- `oxlint/react.json` — Added `kubit/no-inline-styles`
- `oxlint/typescript.json` — Added `kubit/no-public-field-interface`
- `oxlint/recommended.json` — Now extends `architecture.json`
- Updated README with 3 integration options (preset, cherry-pick, manual jsPlugins)

## 0.0.4

### Removed

- Removed `biome` config and all Biome-related references
- The plugin no longer ships a Biome-compatible ESLint config
- Use `oxlint` config or `kubit-rules` for projects using alternative linters

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
