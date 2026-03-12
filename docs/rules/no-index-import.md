# kubit/no-index-import

Disallow imports from index files (barrel files) to improve tree-shaking and reduce bundle size.

## Rule Details

Index files (also known as barrel files) re-export modules from a single entry point. While convenient, they can negatively impact build performance and bundle size by preventing effective tree-shaking.

This rule reports an error when an import resolves to an index file (`index.js`, `index.ts`, `index.jsx`, `index.tsx`) or a directory containing one.

### Examples of **incorrect** code

```js
/* eslint kubit/no-index-import: "error" */

// Importing from a path that ends with /index
import { Button } from "@/components/Button/index";
import { Button } from "@/components/Button/index.ts";

// Importing from a directory that contains an index file
import { Button } from "@/components/Button";
// ^ if Button/ contains index.ts, this is flagged
```

### Examples of **correct** code

```js
/* eslint kubit/no-index-import: "error" */

// Import directly from the specific module
import { Button } from "@/components/Button/Button";
import { ButtonProps } from "@/components/Button/types";

// Third-party imports are fine
import React from "react";
import { useState } from "react";
```

## Options

```json
{
  "kubit/no-index-import": ["error", {
    "aliases": {
      "@/components": "./src/components/*",
      "@/utils": "./src/utils/*"
    },
    "ignoreImports": ["react", "lodash"]
  }]
}
```

### `aliases`

Type: `Object`
Default: `{}`

Path aliases mapping used in your project. This helps the rule correctly resolve aliased import paths to their actual filesystem locations.

### `ignoreImports`

Type: `string[]`
Default: `[]`

List of import paths to exclude from this rule. Useful for third-party packages or specific paths that intentionally use barrel files.

## When Not To Use It

If your project intentionally uses barrel files as a public API pattern and you are not concerned about tree-shaking or bundle size impact.

## Compatibility

This rule provides the same functionality as `@kubit-ui-web/eslint-plugin-no-index-import` but updated for ESLint 10+ APIs and bundled as part of `eslint-plugin-kubit`.
