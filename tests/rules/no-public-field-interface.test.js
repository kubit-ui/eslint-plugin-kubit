"use strict";

const { RuleTester } = require("eslint");
const tsParser = require("@typescript-eslint/parser");
const rule = require("../../lib/rules/no-public-field-interface");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: tsParser,
  },
});

ruleTester.run("no-public-field-interface", rule, {
  valid: [
    // Interface with methods only
    {
      code: `
        interface UserRepository {
          save(user: User): Promise<void>;
          findById(id: string): Promise<User | null>;
        }
      `,
    },
    // Interface with getter method
    {
      code: `
        interface Authoriser {
          getData(): string;
          isValid(): boolean;
        }
      `,
    },
    // Empty interface
    {
      code: "interface Empty {}",
    },
    // Readonly fields with allowReadonly
    {
      code: `
        interface Config {
          readonly name: string;
          readonly version: number;
        }
      `,
      options: [{ allowReadonly: true }],
    },
    // Ignored interface
    {
      code: `
        interface LegacyDTO {
          data: string;
          id: number;
        }
      `,
      options: [{ ignore: ["LegacyDTO"] }],
    },
    // Type alias (not interface) is not checked
    {
      code: `
        type Props = {
          name: string;
          age: number;
        };
      `,
    },
    // Index signature (not a property signature)
    {
      code: `
        interface StringMap {
          [key: string]: string;
        }
      `,
    },
  ],

  invalid: [
    // Interface with a public field
    {
      code: `
        interface Authoriser {
          data: string;
        }
      `,
      errors: [{ messageId: "noPublicField" }],
    },
    // Interface with multiple public fields
    {
      code: `
        interface User {
          name: string;
          age: number;
          isActive: boolean;
        }
      `,
      errors: [
        { messageId: "noPublicField" },
        { messageId: "noPublicField" },
        { messageId: "noPublicField" },
      ],
    },
    // Mix of fields and methods
    {
      code: `
        interface Service {
          name: string;
          execute(): void;
        }
      `,
      errors: [{ messageId: "noPublicField" }],
    },
    // Readonly field without allowReadonly
    {
      code: `
        interface Config {
          readonly name: string;
        }
      `,
      errors: [{ messageId: "noPublicField" }],
    },
  ],
});

console.log("All no-public-field-interface tests passed!");
