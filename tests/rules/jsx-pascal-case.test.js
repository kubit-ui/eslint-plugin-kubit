"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/jsx-pascal-case");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run("jsx-pascal-case", rule, {
  valid: [
    // PascalCase components
    {
      code: "<Button />",
    },
    {
      code: "<MyComponent />",
    },
    {
      code: "<A />",
    },
    // Native HTML elements (lowercase) should be ignored
    {
      code: "<div />",
    },
    {
      code: "<span>text</span>",
    },
    {
      code: "<input type='text' />",
    },
    // SCREAMING_SNAKE_CASE with allowAllCaps
    {
      code: "<MY_COMPONENT />",
      options: [{ allowAllCaps: true }],
    },
    {
      code: "<ICON_BUTTON />",
      options: [{ allowAllCaps: true }],
    },
    // Namespace components with allowNamespace
    {
      code: "<Foo.Bar />",
      options: [{ allowNamespace: true }],
    },
    {
      code: "<Menu.Item />",
      options: [{ allowNamespace: true }],
    },
    // Ignored components
    {
      code: "<notPascal />",
      options: [{ ignore: ["notPascal"] }],
    },
    // JSXNamespacedName (e.g. xml:space) should be ignored
    {
      code: "<xml:space />",
    },
  ],

  invalid: [
    // camelCase starting with uppercase but containing underscore
    {
      code: "<My_Component />",
      errors: [{ messageId: "usePascalCase" }],
    },
    // SCREAMING_SNAKE_CASE without allowAllCaps
    {
      code: "<MY_COMPONENT />",
      errors: [{ messageId: "usePascalCase" }],
    },
    // Member expression with invalid part (no allowNamespace)
    {
      code: "<Foo.bar_baz />",
      errors: [{ messageId: "usePascalCase" }],
    },
    // Component with numbers in wrong position
    {
      code: "<My_Comp2 />",
      errors: [{ messageId: "usePascalCase" }],
    },
  ],
});

console.log("All jsx-pascal-case tests passed!");
