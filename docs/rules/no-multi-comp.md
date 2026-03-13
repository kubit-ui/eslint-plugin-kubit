# kubit/no-multi-comp

Enforce only one React component definition per file.

## Rule Details

Having multiple component definitions in a single file makes it harder to find, test, and maintain components. This rule enforces the single-responsibility principle at the file level by limiting each file to one React component.

A component is detected when a function, arrow function, or class:
- Has a PascalCase name
- Returns JSX (`<div />`, `<>...</>`, etc.)

### Examples of **incorrect** code

```jsx
/* eslint kubit/no-multi-comp: "error" */

// Two function components in one file
function Header() {
  return <header>Header</header>;
}

function Footer() {
  return <footer>Footer</footer>; // Error: multiple components
}
```

```jsx
/* eslint kubit/no-multi-comp: "error" */

// Mixed function + arrow components
function Card() {
  return <div className="card" />;
}

const Badge = () => <span className="badge" />; // Error
```

### Examples of **correct** code

```jsx
/* eslint kubit/no-multi-comp: "error" */

// Single component per file
function Header() {
  return <header>Header</header>;
}

// Helper functions (lowercase) are fine
function formatTitle(title) {
  return <span>{title}</span>;
}
```

```jsx
/* eslint kubit/no-multi-comp: "error" */

// Functions without JSX return are fine
function MyComponent() {
  return <div />;
}

function Formatter() {
  return 'formatted text';
}
```

## Options

```json
{
  "kubit/no-multi-comp": ["error", {
    "ignoreStateless": false
  }]
}
```

### `ignoreStateless`

Type: `boolean`
Default: `false`

When `true`, stateless functional components are not counted toward the component limit. Only class components will be enforced.

```jsx
/* eslint kubit/no-multi-comp: ["error", { "ignoreStateless": true }] */

// OK with ignoreStateless — both are stateless functional components
function ComponentA() {
  return <div />;
}

function ComponentB() {
  return <span />;
}
```

## When Not To Use It

If your project conventionally groups small related components together in one file (e.g., a `List` component alongside a `ListItem` component).

## OxLint Compatibility

This rule is available as a custom kubit rule for OxLint via `jsPlugins`. It is also included in the `oxlint/react.json` preset.
