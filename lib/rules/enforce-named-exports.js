"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow default exports in domain modules to improve tree-shaking, refactoring safety, and import consistency",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/enforce-named-exports.md",
    },
    messages: {
      noDefaultExport:
        "Default exports are not allowed. Use named exports instead for better tree-shaking and refactoring safety.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowInFiles: {
            type: "array",
            items: { type: "string" },
            description:
              "File path patterns where default exports are allowed (e.g. ['*.config.*', '*.stories.*', 'pages/'])",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowInFiles = options.allowInFiles || [];

    const filename = context.filename || context.getFilename();

    const isAllowed = allowInFiles.some((pattern) =>
      filename.includes(pattern),
    );

    if (isAllowed) {
      return {};
    }

    return {
      ExportDefaultDeclaration(node) {
        context.report({
          node,
          messageId: "noDefaultExport",
        });
      },
    };
  },
};
