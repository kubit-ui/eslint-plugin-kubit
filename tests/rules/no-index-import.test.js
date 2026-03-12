"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/no-index-import");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

ruleTester.run("no-index-import", rule, {
  valid: [
    // Direct module imports (not index files)
    {
      code: 'import { Button } from "@/components/Button/Button";',
    },
    {
      code: 'import { utils } from "@/utils/helpers";',
    },
    // Third-party imports
    {
      code: 'import React from "react";',
    },
    {
      code: 'import { useState } from "react";',
    },
    // Ignored imports
    {
      code: 'import { something } from "@/components/index";',
      options: [{ ignoreImports: ["@/components/index"] }],
    },
    // Relative imports that don't end with index
    {
      code: 'import { foo } from "./foo";',
    },
    {
      code: 'import { bar } from "../bar/baz";',
    },
  ],

  invalid: [
    // Explicit /index imports
    {
      code: 'import { Button } from "@/components/Button/index";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.ts";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.tsx";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.js";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.jsx";',
      errors: [{ messageId: "noIndexImport" }],
    },
    // Relative imports ending with index
    {
      code: 'import { foo } from "./foo/index";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { foo } from "../foo/index.ts";',
      errors: [{ messageId: "noIndexImport" }],
    },
  ],
});

console.log("All no-index-import tests passed!");
