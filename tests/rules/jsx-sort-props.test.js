"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/jsx-sort-props");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run("jsx-sort-props", rule, {
  valid: [
    // Already sorted alphabetically
    {
      code: '<Component alpha="1" beta="2" gamma="3" />',
    },
    // Single prop (nothing to sort)
    {
      code: '<Component alpha="1" />',
    },
    // No props
    {
      code: "<Component />",
    },
    // Reserved props first with reservedFirst
    {
      code: '<Component key="k" ref={r} alpha="1" beta="2" />',
      options: [{ reservedFirst: true }],
    },
    // Shorthand first with shorthandFirst
    {
      code: '<Component disabled visible alpha="1" beta="2" />',
      options: [{ shorthandFirst: true }],
    },
    // Callbacks last with callbacksLast
    {
      code: '<Component alpha="1" beta="2" onClick={fn} onHover={fn} />',
      options: [{ callbacksLast: true }],
    },
    // Combined: reserved first + shorthand + callbacks last
    {
      code: '<Component key="k" disabled alpha="1" onClick={fn} />',
      options: [
        { reservedFirst: true, shorthandFirst: true, callbacksLast: true },
      ],
    },
    // Ignore case
    {
      code: '<Component Alpha="1" beta="2" Gamma="3" />',
      options: [{ ignoreCase: true }],
    },
    // noSortAlphabetically allows any order within same rank
    {
      code: '<Component gamma="3" alpha="1" beta="2" />',
      options: [{ noSortAlphabetically: true }],
    },
    // Spread attributes reset sorting
    {
      code: '<Component beta="2" {...props} alpha="1" />',
    },
    // Namespaced props sorted
    {
      code: '<Component ns:alpha="1" ns:beta="2" />',
    },
  ],

  invalid: [
    // Unsorted alphabetically
    {
      code: '<Component beta="2" alpha="1" />',
      output: '<Component alpha="1" beta="2" />',
      errors: [{ messageId: "sortProps" }],
    },
    // Reserved prop not first
    {
      code: '<Component alpha="1" key="k" />',
      output: '<Component key="k" alpha="1" />',
      options: [{ reservedFirst: true }],
      errors: [{ messageId: "sortProps" }],
    },
    // Callback not last
    {
      code: '<Component onClick={fn} alpha="1" />',
      output: '<Component alpha="1" onClick={fn} />',
      options: [{ callbacksLast: true }],
      errors: [{ messageId: "sortProps" }],
    },
    // Shorthand not first
    {
      code: '<Component alpha="1" disabled />',
      output: '<Component disabled alpha="1" />',
      options: [{ shorthandFirst: true }],
      errors: [{ messageId: "sortProps" }],
    },
    // Multiple unsorted props
    {
      code: '<Component gamma="3" beta="2" alpha="1" />',
      output: '<Component alpha="1" beta="2" gamma="3" />',
      errors: [{ messageId: "sortProps" }, { messageId: "sortProps" }],
    },
    // Case-sensitive sort (default): lowercase before uppercase is wrong
    {
      code: '<Component beta="2" Alpha="1" />',
      output: '<Component Alpha="1" beta="2" />',
      errors: [{ messageId: "sortProps" }],
    },
  ],
});

console.log("All jsx-sort-props tests passed!");
