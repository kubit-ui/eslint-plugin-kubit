# kubit/jsx-pascal-case

Enforce PascalCase for user-defined JSX components.

## Rule Details

React components must use PascalCase naming to distinguish them from native HTML elements. This rule checks that all user-defined JSX component names follow PascalCase convention.

Native HTML elements (lowercase tags like `<div>`, `<span>`) and JSX namespaced names (like `<xml:space>`) are ignored.

### Examples of **incorrect** code

```jsx
/* eslint kubit/jsx-pascal-case: "error" */

// Underscore in component name
<My_Component />

// SCREAMING_SNAKE_CASE without allowAllCaps
<MY_COMPONENT />

// Member expression with invalid part
<Foo.bar_baz />
```

### Examples of **correct** code

```jsx
/* eslint kubit/jsx-pascal-case: "error" */

// PascalCase components
<Button />
<MyComponent />
<DataTable />

// Native HTML elements are fine
<div />
<span>text</span>
<input type="text" />
```

## Options

```json
{
  "kubit/jsx-pascal-case": ["error", {
    "allowAllCaps": false,
    "allowNamespace": false,
    "ignore": []
  }]
}
```

### `allowAllCaps`

Type: `boolean`
Default: `false`

When `true`, allows SCREAMING_SNAKE_CASE component names (e.g. `MY_COMPONENT`, `ICON_BUTTON`).

```jsx
/* eslint kubit/jsx-pascal-case: ["error", { "allowAllCaps": true }] */

// OK with allowAllCaps
<MY_COMPONENT />
<ICON_BUTTON />
```

### `allowNamespace`

Type: `boolean`
Default: `false`

When `true`, allows namespace/member expression components without validating each part (e.g. `<Foo.Bar />`).

```jsx
/* eslint kubit/jsx-pascal-case: ["error", { "allowNamespace": true }] */

// OK with allowNamespace
<Menu.Item />
<Form.Input />
```

### `ignore`

Type: `string[]`
Default: `[]`

List of component names to exclude from this rule.

```jsx
/* eslint kubit/jsx-pascal-case: ["error", { "ignore": ["legacy_widget"] }] */

// OK because it's in the ignore list
<legacy_widget />
```

## When Not To Use It

If your project uses a naming convention other than PascalCase for components, or if you have many legacy components that cannot be renamed.

## OxLint Compatibility

This rule is available as a custom kubit rule for OxLint via `jsPlugins`. It is also included in the `oxlint/react.json` preset.
