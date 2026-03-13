"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce behavior-only interfaces by disallowing public field declarations. Interfaces should expose methods, not data.",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/no-public-field-interface.md",
    },
    messages: {
      noPublicField:
        "Interface '{{name}}' should not expose public field '{{field}}'. Use a getter method instead (e.g. get{{capitalField}}(): {{type}}).",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowReadonly: {
            type: "boolean",
            description:
              "Allow readonly fields in interfaces (they are immutable and safer)",
          },
          ignore: {
            type: "array",
            items: { type: "string" },
            description: "Interface names to exclude from this rule",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowReadonly = options.allowReadonly || false;
    const ignore = options.ignore || [];

    function capitalize(str) {
      if (!str) {
        return str;
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getTypeName(member) {
      if (member.typeAnnotation && member.typeAnnotation.typeAnnotation) {
        const sourceCode = context.sourceCode || context.getSourceCode();
        return sourceCode.getText(member.typeAnnotation.typeAnnotation);
      }
      return "unknown";
    }

    return {
      TSInterfaceDeclaration(node) {
        const interfaceName = node.id.name;

        if (ignore.includes(interfaceName)) {
          return;
        }

        for (const member of node.body.body) {
          if (member.type !== "TSPropertySignature") {
            continue;
          }

          if (allowReadonly && member.readonly) {
            continue;
          }

          const fieldName =
            member.key.type === "Identifier"
              ? member.key.name
              : member.key.value;

          context.report({
            node: member,
            messageId: "noPublicField",
            data: {
              name: interfaceName,
              field: fieldName,
              capitalField: capitalize(String(fieldName)),
              type: getTypeName(member),
            },
          });
        }
      },
    };
  },
};
