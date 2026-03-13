"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/no-multi-comp");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run("no-multi-comp", rule, {
  valid: [
    // Single function component
    {
      code: "function MyComponent() { return <div />; }",
    },
    // Single arrow component
    {
      code: "const MyComponent = () => { return <div />; };",
    },
    // Single arrow component with implicit return
    {
      code: "const MyComponent = () => <div />;",
    },
    // Single class component
    {
      code: "class MyComponent { render() { return <div />; } }",
    },
    // Non-component functions (lowercase name)
    {
      code: `
        function MyComponent() { return <div />; }
        function helper() { return <div />; }
      `,
    },
    // Functions without JSX return
    {
      code: `
        function MyComponent() { return <div />; }
        function Formatter() { return 'text'; }
      `,
    },
    // Multiple stateless components with ignoreStateless
    {
      code: `
        function ComponentA() { return <div />; }
        function ComponentB() { return <span />; }
      `,
      options: [{ ignoreStateless: true }],
    },
  ],

  invalid: [
    // Two function components
    {
      code: `
        function ComponentA() { return <div />; }
        function ComponentB() { return <span />; }
      `,
      errors: [{ messageId: "noMultiComp" }],
    },
    // Two arrow components
    {
      code: `
        const ComponentA = () => { return <div />; };
        const ComponentB = () => { return <span />; };
      `,
      errors: [{ messageId: "noMultiComp" }],
    },
    // Mixed: function + arrow
    {
      code: `
        function ComponentA() { return <div />; }
        const ComponentB = () => { return <span />; };
      `,
      errors: [{ messageId: "noMultiComp" }],
    },
    // Two class components
    {
      code: `
        class ComponentA {}
        class ComponentB {}
      `,
      errors: [{ messageId: "noMultiComp" }],
    },
    // Arrow with implicit return + function
    {
      code: `
        const ComponentA = () => <div />;
        function ComponentB() { return <span />; }
      `,
      errors: [{ messageId: "noMultiComp" }],
    },
    // Three components (two errors)
    {
      code: `
        function ComponentA() { return <div />; }
        function ComponentB() { return <span />; }
        function ComponentC() { return <p />; }
      `,
      errors: [
        { messageId: "noMultiComp" },
        { messageId: "noMultiComp" },
      ],
    },
  ],
});

console.log("All no-multi-comp tests passed!");
