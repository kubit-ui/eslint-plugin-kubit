# kubit/no-relative-import-paths

Enforce absolute import paths instead of relative paths for better maintainability and readability.

## Rule Details

Relative import paths (`../`, `./`) become harder to maintain as the project grows and files are moved between directories. This rule enforces the use of absolute imports with configurable path prefixes.

This rule is **auto-fixable** — ESLint can automatically convert relative imports to absolute imports.

### Examples of **incorrect** code

```js
/* eslint kubit/no-relative-import-paths: "error" */

import { helper } from "./helper";
import { utils } from "../utils/format";
import { config } from "../../config/settings";
```

### Examples of **correct** code

```js
/* eslint kubit/no-relative-import-paths: ["error", { "prefix": "@", "rootDir": "src" }] */

import { helper } from "@/utils/helper";
import { utils } from "@/utils/format";
import { config } from "@/config/settings";

// Third-party imports are not affected
import React from "react";
```

## Options

```json
{
  "kubit/no-relative-import-paths": ["error", {
    "allowSameFolder": true,
    "rootDir": "src",
    "prefix": "@",
    "allowedDepth": 2
  }]
}
```

### `allowSameFolder`

Type: `boolean`
Default: `false`

When `true`, allows relative imports from the same directory (paths starting with `./`).

```js
/* eslint kubit/no-relative-import-paths: ["error", { "allowSameFolder": true }] */

// OK when allowSameFolder is true
import { helper } from "./helper";

// Still an error (parent directory)
import { utils } from "../utils";
```

### `rootDir`

Type: `string`
Default: `""`

The root directory from which absolute paths are calculated. Typically set to your source directory (e.g., `"src"` or `"app/src"`).

### `prefix`

Type: `string`
Default: `""`

A prefix to prepend to absolute import paths. Common values are `"@"` (producing `@/components/...`) or `"~"`.

### `allowedDepth`

Type: `number`
Default: `undefined` (no relative imports allowed)

Maximum allowed depth of parent-relative imports. For example, setting `allowedDepth: 2` allows `../../foo` but not `../../../foo`.

## When Not To Use It

If your project does not use path aliases or you prefer relative imports for simplicity.

## Auto-fix

This rule provides automatic fixes. Running `eslint --fix` will convert relative imports to absolute imports based on your configuration.

## Compatibility

This rule is an ESLint 10-compatible version of `eslint-plugin-no-relative-import-paths`, using the modern `context.cwd` and `context.filename` APIs instead of the deprecated `context.getCwd()` and `context.getFilename()`.
