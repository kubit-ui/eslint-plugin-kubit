# kubit/no-cross-boundary-import

Enforce architectural layer boundaries by preventing imports that violate the dependency direction.

## Rule Details

In a layered architecture, dependencies must flow in one direction. For example, `core` should never import from `adapters`, and `utils` should not depend on `core`. This rule detects imports that cross architectural boundaries based on configurable layer definitions.

### Default Layer Configuration

| Layer | Allowed Dependencies |
|---|---|
| `core` | none |
| `interfaces` | none |
| `utils` | none |
| `adapters` | `core`, `interfaces`, `utils` |

### Examples of **incorrect** code

```ts
/* eslint kubit/no-cross-boundary-import: "error" */

// File: src/core/services/UserService.ts
import { ReactAdapter } from "../adapters/ReactAdapter"; // ❌ core → adapters
import { Repository } from "../interfaces/Repository";   // ❌ core → interfaces

// File: src/utils/helpers.ts
import { UserService } from "../core/UserService";       // ❌ utils → core
import { HttpAdapter } from "../adapters/HttpAdapter";    // ❌ utils → adapters

// File: src/interfaces/Repository.ts
import { HttpClient } from "../adapters/HttpClient";      // ❌ interfaces → adapters
```

### Examples of **correct** code

```ts
/* eslint kubit/no-cross-boundary-import: "error" */

// File: src/adapters/ReactAdapter.ts
import { UserService } from "../core/UserService";       // ✅ adapters → core
import { Repository } from "../interfaces/Repository";   // ✅ adapters → interfaces
import { format } from "../utils/format";                 // ✅ adapters → utils

// File: src/core/services/UserService.ts
import { validate } from "./validate";                    // ✅ core → core (same layer)
import { z } from "zod";                                  // ✅ third-party (no layer)
```

## Options

```json
{
  "kubit/no-cross-boundary-import": ["error", {
    "layers": {
      "core": [],
      "interfaces": [],
      "utils": [],
      "adapters": ["core", "interfaces", "utils"]
    }
  }]
}
```

### `layers`

Type: `Object`
Default: `{ core: [], interfaces: [], utils: [], adapters: ["core", "interfaces", "utils"] }`

A map of layer names to their allowed dependencies. Each key is a layer name, and the value is an array of layer names that this layer is allowed to import from.

A layer is detected by checking if the file path contains `/<layerName>/`.

```json
{
  "kubit/no-cross-boundary-import": ["error", {
    "layers": {
      "domain": [],
      "application": ["domain"],
      "infrastructure": ["domain", "application"],
      "presentation": ["application"]
    }
  }]
}
```

## When Not To Use It

If your project does not follow a layered or hexagonal architecture, or if you allow bidirectional dependencies between modules.

## Architecture Diagram

```
  adapters ──→ core
     │  ╲
     │   ╲──→ interfaces
     │
     └──────→ utils

  core ──✗──→ adapters (BLOCKED)
  utils ──✗──→ core    (BLOCKED)
```
