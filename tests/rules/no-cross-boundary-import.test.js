"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/no-cross-boundary-import");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

ruleTester.run("no-cross-boundary-import", rule, {
  valid: [
    // File not in any layer — no restrictions
    {
      code: 'import { foo } from "./adapters/http";',
      filename: "/project/src/main.ts",
    },
    // Adapters can import from core (allowed dep)
    {
      code: 'import { UserService } from "../core/UserService";',
      filename: "/project/src/adapters/ReactAdapter.ts",
    },
    // Adapters can import from interfaces (allowed dep)
    {
      code: 'import { Repository } from "../interfaces/Repository";',
      filename: "/project/src/adapters/HttpAdapter.ts",
    },
    // Adapters can import from utils (allowed dep)
    {
      code: 'import { format } from "../utils/format";',
      filename: "/project/src/adapters/Formatter.ts",
    },
    // Core importing from same layer
    {
      code: 'import { validate } from "./validate";',
      filename: "/project/src/core/services/UserService.ts",
    },
    // Third-party imports (no layer detected)
    {
      code: 'import { z } from "zod";',
      filename: "/project/src/core/schemas/user.ts",
    },
    // Custom layers: domain can import from shared
    {
      code: 'import { helper } from "../shared/helper";',
      filename: "/project/src/domain/services/UserService.ts",
      options: [
        {
          layers: {
            domain: ["shared"],
            shared: [],
          },
        },
      ],
    },
  ],

  invalid: [
    // Core cannot import from adapters
    {
      code: 'import { ReactAdapter } from "../../adapters/ReactAdapter";',
      filename: "/project/src/core/services/UserService.ts",
      errors: [{ messageId: "crossBoundary" }],
    },
    // Core cannot import from interfaces (empty allowed deps)
    {
      code: 'import { Repository } from "../../interfaces/Repository";',
      filename: "/project/src/core/services/UserService.ts",
      errors: [{ messageId: "crossBoundary" }],
    },
    // Interfaces cannot import from adapters
    {
      code: 'import { HttpClient } from "../adapters/HttpClient";',
      filename: "/project/src/interfaces/Repository.ts",
      errors: [{ messageId: "crossBoundary" }],
    },
    // Utils cannot import from core
    {
      code: 'import { UserService } from "../core/UserService";',
      filename: "/project/src/utils/helpers.ts",
      errors: [{ messageId: "crossBoundary" }],
    },
    // Utils cannot import from adapters
    {
      code: 'import { HttpAdapter } from "../adapters/HttpAdapter";',
      filename: "/project/src/utils/http.ts",
      errors: [{ messageId: "crossBoundary" }],
    },
    // Custom layers: shared cannot import from domain
    {
      code: 'import { User } from "../domain/User";',
      filename: "/project/src/shared/utils.ts",
      options: [
        {
          layers: {
            domain: ["shared"],
            shared: [],
          },
        },
      ],
      errors: [{ messageId: "crossBoundary" }],
    },
  ],
});

console.log("All no-cross-boundary-import tests passed!");
