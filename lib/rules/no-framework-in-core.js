"use strict";

const DEFAULT_FRAMEWORKS = [
  "react",
  "react-dom",
  "react-dom/client",
  "react-dom/server",
  "react-native",
  "@angular/core",
  "@angular/common",
  "@angular/forms",
  "@angular/router",
  "vue",
  "svelte",
  "solid-js",
  "preact",
  "next",
  "next/router",
  "next/navigation",
  "next/link",
  "next/image",
];

const DEFAULT_CORE_PATTERN = "/core/";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow framework imports (React, Angular, Vue, etc.) inside core/domain directories to enforce framework-agnostic business logic",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/no-framework-in-core.md",
    },
    messages: {
      noFrameworkInCore:
        "Framework import '{{source}}' is not allowed inside core directory. Core logic must remain framework-agnostic.",
    },
    schema: [
      {
        type: "object",
        properties: {
          corePatterns: {
            type: "array",
            items: { type: "string" },
            description:
              "Path patterns that identify core directories (e.g. ['/core/', '/domain/'])",
          },
          frameworks: {
            type: "array",
            items: { type: "string" },
            description:
              "Framework package names to disallow (e.g. ['react', 'vue'])",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const corePatterns = options.corePatterns || [DEFAULT_CORE_PATTERN];
    const frameworks = options.frameworks || DEFAULT_FRAMEWORKS;

    const filename = context.filename || context.getFilename();

    const isInCore = corePatterns.some((pattern) =>
      filename.includes(pattern),
    );

    if (!isInCore) {
      return {};
    }

    function isFrameworkImport(source) {
      return frameworks.some((fw) => {
        return source === fw || source.startsWith(fw + "/");
      });
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (isFrameworkImport(source)) {
          context.report({
            node,
            messageId: "noFrameworkInCore",
            data: { source },
          });
        }
      },
      CallExpression(node) {
        if (
          node.callee.name === "require" &&
          node.arguments.length > 0 &&
          node.arguments[0].type === "Literal" &&
          typeof node.arguments[0].value === "string"
        ) {
          const source = node.arguments[0].value;
          if (isFrameworkImport(source)) {
            context.report({
              node,
              messageId: "noFrameworkInCore",
              data: { source },
            });
          }
        }
      },
    };
  },
};
