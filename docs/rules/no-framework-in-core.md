# kubit/no-framework-in-core

Disallow framework imports (React, Angular, Vue, etc.) inside core/domain directories to enforce framework-agnostic business logic.

## Rule Details

Core/domain logic must remain independent of any UI framework. This rule prevents accidental coupling by detecting framework imports inside directories that match configurable path patterns.

When a file is inside a core directory, imports from React, Angular, Vue, Svelte, Next.js, and other frameworks are reported as errors.

### Examples of **incorrect** code

```ts
/* eslint kubit/no-framework-in-core: "error" */

// File: src/core/services/AuthService.ts
import { useState } from "react";          // ❌
import { Injectable } from "@angular/core"; // ❌
import { ref } from "vue";                  // ❌
import { useRouter } from "next/router";    // ❌
const React = require("react");             // ❌
```

### Examples of **correct** code

```ts
/* eslint kubit/no-framework-in-core: "error" */

// File: src/core/services/AuthService.ts
import { validate } from "../utils/validate"; // ✅
import { z } from "zod";                      // ✅

// File: src/adapters/ReactAuthAdapter.tsx (not in core — allowed)
import { useState } from "react"; // ✅
```

## Options

```json
{
  "kubit/no-framework-in-core": ["error", {
    "corePatterns": ["/core/"],
    "frameworks": ["react", "react-dom", "vue", "@angular/core"]
  }]
}
```

### `corePatterns`

Type: `string[]`
Default: `["/core/"]`

Path substrings that identify core directories. A file is considered "in core" if its path contains any of these patterns.

```json
{
  "kubit/no-framework-in-core": ["error", {
    "corePatterns": ["/core/", "/domain/", "/business/"]
  }]
}
```

### `frameworks`

Type: `string[]`
Default: `["react", "react-dom", "react-dom/client", "react-dom/server", "react-native", "@angular/core", "@angular/common", "@angular/forms", "@angular/router", "vue", "svelte", "solid-js", "preact", "next", "next/router", "next/navigation", "next/link", "next/image"]`

Framework package names to disallow. Sub-path imports are also matched (e.g. `"react"` matches `"react/jsx-runtime"`).

## When Not To Use It

If your project does not follow a layered architecture or if your core modules intentionally use framework APIs.

## Architecture Pattern

```
src/
  core/          ← No framework imports allowed
  interfaces/    ← No framework imports allowed
  adapters/      ← Framework imports OK (React, Angular, etc.)
  utils/         ← No framework imports allowed
```
