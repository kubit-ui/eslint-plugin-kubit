"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce only one React component definition per file",
      category: "Stylistic Issues",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/no-multi-comp.md",
    },
    messages: {
      noMultiComp:
        "Only one React component per file is allowed. Found multiple component definitions.",
    },
    schema: [
      {
        type: "object",
        properties: {
          ignoreStateless: {
            type: "boolean",
            description: "If true, ignores stateless functional components",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoreStateless = options.ignoreStateless || false;
    let componentCount = 0;

    function hasJSXReturn(node) {
      if (!node.body) {
        return node.type === "JSXElement" || node.type === "JSXFragment";
      }
      const body = node.body;
      if (body.type === "JSXElement" || body.type === "JSXFragment") {
        return true;
      }
      if (body.type === "BlockStatement" && body.body) {
        return body.body.some(
          (stmt) =>
            stmt.type === "ReturnStatement" &&
            stmt.argument &&
            (stmt.argument.type === "JSXElement" ||
              stmt.argument.type === "JSXFragment" ||
              (stmt.argument.type === "ParenthesizedExpression" &&
                stmt.argument.expression &&
                (stmt.argument.expression.type === "JSXElement" ||
                  stmt.argument.expression.type === "JSXFragment"))),
        );
      }
      return false;
    }

    function isComponentName(name) {
      return name && name.charAt(0) === name.charAt(0).toUpperCase();
    }

    function checkFunction(node, name) {
      if (!isComponentName(name)) {
        return;
      }
      if (!hasJSXReturn(node)) {
        return;
      }
      if (ignoreStateless) {
        return;
      }
      componentCount += 1;
      if (componentCount > 1) {
        context.report({ node, messageId: "noMultiComp" });
      }
    }

    return {
      FunctionDeclaration(node) {
        const name = node.id && node.id.name;
        checkFunction(node, name);
      },

      VariableDeclarator(node) {
        const name = node.id && node.id.name;
        if (
          node.init &&
          (node.init.type === "ArrowFunctionExpression" ||
            node.init.type === "FunctionExpression")
        ) {
          checkFunction(node.init, name);
        }
      },

      ClassDeclaration(node) {
        const name = node.id && node.id.name;
        if (!isComponentName(name)) {
          return;
        }
        componentCount += 1;
        if (componentCount > 1) {
          context.report({ node, messageId: "noMultiComp" });
        }
      },
    };
  },
};
