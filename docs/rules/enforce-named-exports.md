# kubit/enforce-named-exports

Disallow default exports in domain modules to improve tree-shaking, refactoring safety, and import consistency.

## Rule Details

Default exports create several problems:
- **Tree-shaking**: Bundlers cannot reliably tree-shake default exports
- **Refactoring**: Renaming is harder because the import name is arbitrary
- **Consistency**: The same module gets different names across the codebase
- **Discoverability**: IDEs cannot auto-suggest the correct name

This rule reports an error whenever `export default` is used.

### Examples of **incorrect** code

```js
/* eslint kubit/enforce-named-exports: "error" */

export default function createUser() {}

export default class UserManager {}

export default {};

export default () => {};
```

### Examples of **correct** code

```js
/* eslint kubit/enforce-named-exports: "error" */

export function createUser() {}

export class UserManager {}

export const config = {};

export { UserService } from "./UserService";
```

## Options

```json
{
  "kubit/enforce-named-exports": ["error", {
    "allowInFiles": []
  }]
}
```

### `allowInFiles`

Type: `string[]`
Default: `[]`

File path patterns where default exports are allowed. Useful for framework conventions that require default exports (Next.js pages, Storybook stories, config files).

```json
{
  "kubit/enforce-named-exports": ["error", {
    "allowInFiles": [
      "pages/",
      ".stories.",
      ".config.",
      "app/layout",
      "app/page"
    ]
  }]
}
```

```js
// File: src/pages/Home.tsx — OK (matches "pages/")
export default function Home() { return <div />; }

// File: src/Button.stories.tsx — OK (matches ".stories.")
export default { title: "Button" };

// File: src/components/Button.tsx — ERROR (no match)
export default function Button() { return <button />; }
```

## When Not To Use It

If your project relies heavily on default exports (e.g., Next.js pages without the `allowInFiles` exception), or if you prefer the flexibility of default exports.
