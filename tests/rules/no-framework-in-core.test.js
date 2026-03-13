"use strict";

const { RuleTester } = require("eslint");
const rule = require("../../lib/rules/no-framework-in-core");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

ruleTester.run("no-framework-in-core", rule, {
  valid: [
    // Not in core directory — framework imports allowed
    {
      code: 'import React from "react";',
      filename: "/project/src/adapters/ReactAdapter.ts",
    },
    {
      code: 'import { useState } from "react";',
      filename: "/project/src/components/Button.tsx",
    },
    // In core directory — non-framework imports allowed
    {
      code: 'import { UserRepository } from "./UserRepository";',
      filename: "/project/src/core/services/UserService.ts",
    },
    {
      code: 'import { validate } from "../utils/validate";',
      filename: "/project/src/core/validators/index.ts",
    },
    // Third-party non-framework
    {
      code: 'import { z } from "zod";',
      filename: "/project/src/core/schemas/user.ts",
    },
    // Custom frameworks list — unlisted framework allowed
    {
      code: 'import React from "react";',
      filename: "/project/src/core/service.ts",
      options: [{ frameworks: ["vue"] }],
    },
    // Custom core pattern — not matching
    {
      code: 'import React from "react";',
      filename: "/project/src/logic/service.ts",
      options: [{ corePatterns: ["/domain/"] }],
    },
  ],

  invalid: [
    // React in core
    {
      code: 'import React from "react";',
      filename: "/project/src/core/services/UserService.ts",
      errors: [{ messageId: "noFrameworkInCore" }],
    },
    // React hook in core
    {
      code: 'import { useState } from "react";',
      filename: "/project/src/core/hooks/useAuth.ts",
      errors: [{ messageId: "noFrameworkInCore" }],
    },
    // react-dom in core
    {
      code: 'import { createPortal } from "react-dom";',
      filename: "/project/src/core/utils/portal.ts",
      errors: [{ messageId: "noFrameworkInCore" }],
    },
    // Angular in core
    {
      code: 'import { Injectable } from "@angular/core";',
      filename: "/project/src/core/services/auth.ts",
      errors: [{ messageId: "noFrameworkInCore" }],
    },
    // Vue in core
    {
      code: 'import { ref } from "vue";',
      filename: "/project/src/core/state/counter.ts",
      errors: [{ messageId: "noFrameworkInCore" }],
    },
    // Next.js in core
    {
      code: 'import { useRouter } from "next/router";',
      filename: "/project/src/core/navigation.ts",
      errors: [{ messageId: "noFrameworkInCore" }],
    },
    // require() in core
    {
      code: 'const React = require("react");',
      filename: "/project/src/core/legacy.js",
      errors: [{ messageId: "noFrameworkInCore" }],
    },
    // Custom core pattern
    {
      code: 'import React from "react";',
      filename: "/project/src/domain/services/UserService.ts",
      options: [{ corePatterns: ["/domain/"] }],
      errors: [{ messageId: "noFrameworkInCore" }],
    },
  ],
});

console.log("All no-framework-in-core tests passed!");
