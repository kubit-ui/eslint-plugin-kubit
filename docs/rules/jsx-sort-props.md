# kubit/jsx-sort-props

Enforce sorted props in JSX elements for consistency and readability.

This rule is **auto-fixable** — ESLint can automatically reorder JSX props.

## Rule Details

Consistently ordered props make components easier to scan and review. This rule enforces alphabetical ordering of JSX props with support for grouping reserved props first, shorthand props first, and callback props last.

Spread attributes (`{...props}`) act as sorting boundaries — props are only compared within the same group between spreads.

### Examples of **incorrect** code

```jsx
/* eslint kubit/jsx-sort-props: "error" */

// Unsorted alphabetically
<Component zebra="z" alpha="a" />

// Callback not last (with callbacksLast)
<Component onClick={fn} className="btn" />

// Reserved prop not first (with reservedFirst)
<Component className="btn" key="k" />
```

### Examples of **correct** code

```jsx
/* eslint kubit/jsx-sort-props: "error" */

// Sorted alphabetically
<Component alpha="a" beta="b" gamma="g" />

// Single prop
<Component alpha="a" />

// No props
<Component />
```

```jsx
/* eslint kubit/jsx-sort-props: ["error", {
  "reservedFirst": true,
  "shorthandFirst": true,
  "callbacksLast": true
}] */

// Full grouping: reserved → shorthand → regular → callbacks
<Component
  key="k"
  ref={myRef}
  disabled
  visible
  className="btn"
  label="Click me"
  onClick={handleClick}
  onHover={handleHover}
/>
```

## Options

```json
{
  "kubit/jsx-sort-props": ["error", {
    "callbacksLast": false,
    "shorthandFirst": false,
    "reservedFirst": false,
    "ignoreCase": false,
    "noSortAlphabetically": false
  }]
}
```

### `callbacksLast`

Type: `boolean`
Default: `false`

When `true`, enforces that callback props (names starting with `on` followed by an uppercase letter, e.g. `onClick`, `onHover`) appear last.

### `shorthandFirst`

Type: `boolean`
Default: `false`

When `true`, enforces that shorthand boolean props (props with no value, e.g. `<Component disabled />`) appear before other props.

### `reservedFirst`

Type: `boolean`
Default: `false`

When `true`, enforces that reserved props (`key`, `ref`, `dangerouslySetInnerHTML`) appear before all other props.

### `ignoreCase`

Type: `boolean`
Default: `false`

When `true`, prop name comparisons are case-insensitive.

```jsx
/* eslint kubit/jsx-sort-props: ["error", { "ignoreCase": true }] */

// OK — case-insensitive sort
<Component Alpha="1" beta="2" Gamma="3" />
```

### `noSortAlphabetically`

Type: `boolean`
Default: `false`

When `true`, disables alphabetical sorting within the same rank group. Only group ordering (reserved, shorthand, callbacks) is enforced.

## Auto-fix

This rule provides automatic fixes. Running `eslint --fix` will reorder JSX props according to the configured sorting rules.

## When Not To Use It

If your team does not enforce a specific prop ordering convention, or if you rely on a different sorting strategy (e.g., by prop importance rather than alphabetical).

## OxLint Compatibility

This rule is available as a custom kubit rule for OxLint via `jsPlugins`. It is also included in the `oxlint/react.json` preset with `callbacksLast`, `shorthandFirst`, and `reservedFirst` enabled.
