"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/no-relative-import-paths");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

ruleTester.run("no-relative-import-paths", rule, {
  valid: [
    // Absolute imports are always valid
    {
      code: 'import { Button } from "@/components/Button";',
    },
    {
      code: 'import React from "react";',
    },
    {
      code: 'import { useState } from "react";',
    },
    // Same folder imports when allowSameFolder is true
    {
      code: 'import { helper } from "./helper";',
      options: [{ allowSameFolder: true }],
    },
    // Relative imports within allowed depth
    {
      code: 'import { foo } from "../foo";',
      options: [{ allowedDepth: 1 }],
    },
    {
      code: 'import { foo } from "../../foo";',
      options: [{ allowedDepth: 2 }],
    },
  ],

  invalid: [
    // Same folder imports when allowSameFolder is false (default)
    {
      code: 'import { helper } from "./helper";',
      errors: [{ messageId: "noRelativeImportPaths" }],
      output: 'import { helper } from "helper";',
    },
    // Parent folder imports without allowedDepth
    {
      code: 'import { foo } from "../foo";',
      errors: [{ messageId: "noRelativeImportPaths" }],
    },
    {
      code: 'import { foo } from "../../foo";',
      errors: [{ messageId: "noRelativeImportPaths" }],
    },
    // Parent folder imports exceeding allowedDepth
    {
      code: 'import { foo } from "../../../foo";',
      options: [{ allowedDepth: 2 }],
      errors: [{ messageId: "noRelativeImportPaths" }],
    },
    // With prefix option
    {
      code: 'import { helper } from "./helper";',
      options: [{ prefix: "@", rootDir: "src" }],
      errors: [{ messageId: "noRelativeImportPaths" }],
      output: 'import { helper } from "@/../helper";',
    },
  ],
});

console.log("All no-relative-import-paths tests passed!");
