# kubit/no-public-field-interface

Enforce behavior-only interfaces by disallowing public field declarations. Interfaces should expose methods, not data.

## Rule Details

Public fields in interfaces expose internal data structures and create tight coupling between consumers and implementations. This rule enforces the **Interface Segregation Principle** by requiring interfaces to define behavior (methods) rather than structure (fields).

This is a core principle of clean architecture: consumers should depend on what an object *does*, not what it *contains*.

### Examples of **incorrect** code

```ts
/* eslint kubit/no-public-field-interface: "error" */

// Exposing data directly
interface Authoriser {
  data: string;
}

// Multiple public fields
interface User {
  name: string;
  age: number;
  isActive: boolean;
}

// Mix of fields and methods
interface Service {
  name: string;       // ❌ field
  execute(): void;    // ✅ method
}
```

### Examples of **correct** code

```ts
/* eslint kubit/no-public-field-interface: "error" */

// Behavior-only interface
interface Authoriser {
  getData(): string;
  isValid(): boolean;
}

// Repository pattern
interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}

// Index signatures are allowed
interface StringMap {
  [key: string]: string;
}
```

## Options

```json
{
  "kubit/no-public-field-interface": ["error", {
    "allowReadonly": false,
    "ignore": []
  }]
}
```

### `allowReadonly`

Type: `boolean`
Default: `false`

When `true`, allows `readonly` fields in interfaces since they are immutable and safer.

```ts
/* eslint kubit/no-public-field-interface: ["error", { "allowReadonly": true }] */

// OK with allowReadonly
interface Config {
  readonly name: string;
  readonly version: number;
}

// Still an error (mutable field)
interface State {
  count: number; // ❌
}
```

### `ignore`

Type: `string[]`
Default: `[]`

Interface names to exclude from this rule. Useful for DTOs or legacy interfaces.

```ts
/* eslint kubit/no-public-field-interface: ["error", { "ignore": ["UserDTO"] }] */

// OK because it's ignored
interface UserDTO {
  name: string;
  email: string;
}
```

## When Not To Use It

If your project uses interfaces primarily as data shapes (DTOs, API responses) and you don't follow a behavior-driven interface design.

## Refactoring Guide

| Before (field) | After (method) |
|---|---|
| `data: string` | `getData(): string` |
| `isActive: boolean` | `isActive(): boolean` |
| `items: Item[]` | `getItems(): Item[]` |
| `count: number` | `getCount(): number` |
