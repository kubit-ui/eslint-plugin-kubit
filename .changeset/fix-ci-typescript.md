---
"@kubit-ui-web/eslint-plugin-kubit": patch
---

fix(ci): add typescript as devDependency and fix PR validation workflow

- Added `typescript` to devDependencies to resolve `Cannot find module 'typescript'` errors in CI
- Fixed `changeset status` by fetching `main` branch with full history in PR validation workflow
