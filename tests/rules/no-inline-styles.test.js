"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/no-inline-styles");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run("no-inline-styles", rule, {
  valid: [
    // No style attribute
    {
      code: '<div className="container" />',
    },
    // className instead of style
    {
      code: '<Button className="primary" />',
    },
    // Ignored element
    {
      code: "<motion.div style={{ opacity: 1 }} />",
      options: [{ ignore: ["motion.div"] }],
    },
    // Dynamic style with allowDynamic (variable reference)
    {
      code: "<div style={dynamicStyles} />",
      options: [{ allowDynamic: true }],
    },
    // Dynamic style with allowDynamic (function call)
    {
      code: "<div style={getStyles()} />",
      options: [{ allowDynamic: true }],
    },
    // style prop with no value (shorthand boolean — unusual but valid JSX)
    {
      code: "<div style />",
    },
  ],

  invalid: [
    // Inline object literal style
    {
      code: "<div style={{ color: 'red' }} />",
      errors: [{ messageId: "noInlineStyle" }],
    },
    // Style on component
    {
      code: "<Button style={{ margin: 10 }} />",
      errors: [{ messageId: "noInlineStyle" }],
    },
    // Dynamic style without allowDynamic
    {
      code: "<div style={dynamicStyles} />",
      errors: [{ messageId: "noInlineStyle" }],
    },
    // Object literal with allowDynamic (still forbidden)
    {
      code: "<div style={{ padding: 5 }} />",
      options: [{ allowDynamic: true }],
      errors: [{ messageId: "noInlineStyle" }],
    },
    // Non-ignored element
    {
      code: "<div style={{ opacity: 1 }} />",
      options: [{ ignore: ["motion.div"] }],
      errors: [{ messageId: "noInlineStyle" }],
    },
  ],
});

console.log("All no-inline-styles tests passed!");
