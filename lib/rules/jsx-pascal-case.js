"use strict";

const PASCAL_CASE_REGEX = /^[A-Z][a-zA-Z0-9]*$/;
const ALL_CAPS_REGEX = /^[A-Z][A-Z0-9_]*$/;

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce PascalCase for user-defined JSX components",
      category: "Stylistic Issues",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/jsx-pascal-case.md",
    },
    messages: {
      usePascalCase: "JSX component name '{{name}}' must be in PascalCase.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowAllCaps: {
            type: "boolean",
            description:
              "Allow SCREAMING_SNAKE_CASE component names (e.g. MY_COMPONENT)",
          },
          allowNamespace: {
            type: "boolean",
            description: "Allow namespace components (e.g. Foo.Bar)",
          },
          ignore: {
            type: "array",
            items: { type: "string" },
            description: "Component names to ignore",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowAllCaps = options.allowAllCaps || false;
    const allowNamespace = options.allowNamespace || false;
    const ignore = options.ignore || [];

    function isValid(name) {
      if (ignore.includes(name)) {
        return true;
      }
      if (PASCAL_CASE_REGEX.test(name)) {
        return true;
      }
      if (allowAllCaps && ALL_CAPS_REGEX.test(name)) {
        return true;
      }
      return false;
    }

    return {
      JSXOpeningElement(node) {
        const nameNode = node.name;

        if (nameNode.type === "JSXNamespacedName") {
          return;
        }

        if (nameNode.type === "JSXMemberExpression") {
          if (allowNamespace) {
            return;
          }
          const parts = [];
          let current = nameNode;
          while (current.type === "JSXMemberExpression") {
            parts.unshift(current.property.name);
            current = current.object;
          }
          parts.unshift(current.name);

          for (const part of parts) {
            if (!isValid(part)) {
              context.report({
                node: nameNode,
                messageId: "usePascalCase",
                data: { name: parts.join(".") },
              });
              return;
            }
          }
          return;
        }

        if (nameNode.type === "JSXIdentifier") {
          const name = nameNode.name;
          const firstChar = name.charAt(0);
          if (firstChar === firstChar.toLowerCase()) {
            return;
          }
          if (!isValid(name)) {
            context.report({
              node: nameNode,
              messageId: "usePascalCase",
              data: { name },
            });
          }
        }
      },
    };
  },
};
