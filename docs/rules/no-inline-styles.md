# kubit/no-inline-styles

Disallow inline `style` attributes in JSX elements to enforce consistent styling via CSS modules, design tokens, or styling libraries.

## Rule Details

Inline styles bypass the styling system, making it harder to maintain visual consistency, apply theming, and leverage design tokens. This rule reports an error when a `style` attribute is used on any JSX element.

### Examples of **incorrect** code

```jsx
/* eslint kubit/no-inline-styles: "error" */

// Object literal style
<div style={{ color: 'red', padding: 10 }} />

// Variable reference style
<Button style={dynamicStyles} />

// Computed style
<span style={getStyles(theme)} />
```

### Examples of **correct** code

```jsx
/* eslint kubit/no-inline-styles: "error" */

// CSS class
<div className="container" />

// CSS module
<div className={styles.container} />

// Design token via className
<Button className={tokens.primaryButton} />
```

## Options

```json
{
  "kubit/no-inline-styles": ["error", {
    "allowDynamic": false,
    "ignore": []
  }]
}
```

### `allowDynamic`

Type: `boolean`
Default: `false`

When `true`, allows dynamic style expressions (variable references, function calls) while still disallowing object literals. This is useful for animation libraries that require computed styles.

```jsx
/* eslint kubit/no-inline-styles: ["error", { "allowDynamic": true }] */

// OK — dynamic expression
<div style={animatedStyle} />
<div style={getStyles()} />

// Still an error — object literal
<div style={{ opacity: 1 }} />
```

### `ignore`

Type: `string[]`
Default: `[]`

JSX element names to exclude from this rule. Useful for animation libraries like Framer Motion.

```jsx
/* eslint kubit/no-inline-styles: ["error", { "ignore": ["motion.div", "motion.span"] }] */

// OK — ignored element
<motion.div style={{ opacity: 1 }} />

// Still an error — not ignored
<div style={{ opacity: 1 }} />
```

## When Not To Use It

If your project intentionally uses inline styles (e.g., CSS-in-JS with the `style` prop pattern), or if you work with libraries that require inline style objects (e.g., React Native).
