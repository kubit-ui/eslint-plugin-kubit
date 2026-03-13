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
    // Explicit /index imports (auto-fixable)
    {
      code: 'import { Button } from "@/components/Button/index";',
      output: 'import { Button } from "@/components/Button";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.ts";',
      output: 'import { Button } from "@/components/Button";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.tsx";',
      output: 'import { Button } from "@/components/Button";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.js";',
      output: 'import { Button } from "@/components/Button";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { Button } from "@/components/Button/index.jsx";',
      output: 'import { Button } from "@/components/Button";',
      errors: [{ messageId: "noIndexImport" }],
    },
    // Relative imports ending with index (auto-fixable)
    {
      code: 'import { foo } from "./foo/index";',
      output: 'import { foo } from "./foo";',
      errors: [{ messageId: "noIndexImport" }],
    },
    {
      code: 'import { foo } from "../foo/index.ts";',
      output: 'import { foo } from "../foo";',
      errors: [{ messageId: "noIndexImport" }],
    },
    // Single quotes
    {
      code: "import { Bar } from '../bar/index';",
      output: "import { Bar } from '../bar';",
      errors: [{ messageId: "noIndexImport" }],
    },
  ],
});

console.log("All no-index-import tests passed!");
