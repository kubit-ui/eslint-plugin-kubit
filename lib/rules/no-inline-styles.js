"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow inline style attributes in JSX elements to enforce consistent styling via CSS modules, design tokens, or styling libraries",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/no-inline-styles.md",
    },
    messages: {
      noInlineStyle:
        "Inline styles are not allowed. Use CSS modules, design tokens, or a styling library instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowDynamic: {
            type: "boolean",
            description:
              "Allow dynamic style expressions (variables/function calls) while still disallowing object literals",
          },
          ignore: {
            type: "array",
            items: { type: "string" },
            description:
              "JSX element names to exclude from this rule (e.g. ['motion.div'])",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowDynamic = options.allowDynamic || false;
    const ignore = options.ignore || [];

    function getElementName(node) {
      const opening = node.parent;
      if (!opening || opening.type !== "JSXOpeningElement") {
        return null;
      }
      const nameNode = opening.name;
      if (nameNode.type === "JSXIdentifier") {
        return nameNode.name;
      }
      if (nameNode.type === "JSXMemberExpression") {
        const parts = [];
        let current = nameNode;
        while (current.type === "JSXMemberExpression") {
          parts.unshift(current.property.name);
          current = current.object;
        }
        parts.unshift(current.name);
        return parts.join(".");
      }
      return null;
    }

    return {
      JSXAttribute(node) {
        if (
          node.name.type !== "JSXIdentifier" ||
          node.name.name !== "style"
        ) {
          return;
        }

        const elementName = getElementName(node);
        if (elementName && ignore.includes(elementName)) {
          return;
        }

        if (!node.value) {
          return;
        }

        if (allowDynamic && node.value.type === "JSXExpressionContainer") {
          const expr = node.value.expression;
          if (expr.type !== "ObjectExpression") {
            return;
          }
        }

        context.report({
          node,
          messageId: "noInlineStyle",
        });
      },
    };
  },
};
