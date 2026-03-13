"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/enforce-named-exports");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

ruleTester.run("enforce-named-exports", rule, {
  valid: [
    // Named export function
    {
      code: "export function createUser() {}",
    },
    // Named export const
    {
      code: "export const UserService = {};",
    },
    // Named export class
    {
      code: "export class UserManager {}",
    },
    // Re-export
    {
      code: 'export { UserService } from "./UserService";',
    },
    // Default export in allowed file pattern
    {
      code: "export default function Page() {}",
      options: [{ allowInFiles: ["pages/"] }],
      filename: "/project/src/pages/Home.tsx",
    },
    // Default export in config file
    {
      code: "export default {};",
      options: [{ allowInFiles: [".config."] }],
      filename: "/project/eslint.config.js",
    },
    // Default export in stories file
    {
      code: "export default { title: 'Button' };",
      options: [{ allowInFiles: [".stories."] }],
      filename: "/project/src/Button.stories.tsx",
    },
  ],

  invalid: [
    // Default export function
    {
      code: "export default function createUser() {}",
      errors: [{ messageId: "noDefaultExport" }],
    },
    // Default export class
    {
      code: "export default class UserManager {}",
      errors: [{ messageId: "noDefaultExport" }],
    },
    // Default export object
    {
      code: "export default {};",
      errors: [{ messageId: "noDefaultExport" }],
    },
    // Default export anonymous arrow
    {
      code: "export default () => {};",
      errors: [{ messageId: "noDefaultExport" }],
    },
    // Default export in non-matching file pattern
    {
      code: "export default function Page() {}",
      options: [{ allowInFiles: ["pages/"] }],
      filename: "/project/src/components/Button.tsx",
      errors: [{ messageId: "noDefaultExport" }],
    },
  ],
});

console.log("All enforce-named-exports tests passed!");
