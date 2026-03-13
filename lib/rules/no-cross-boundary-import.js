"use strict";

const path = require("path");

const DEFAULT_LAYERS = {
  core: [],
  interfaces: [],
  utils: [],
  adapters: ["core", "interfaces", "utils"],
};

/**
 * Detects which architectural layer a file belongs to based on its path.
 * @param {string} filePath - The absolute file path.
 * @param {Object} layers - The layer configuration.
 * @returns {string|null} - The layer name, or null if not in any layer.
 */
function detectLayer(filePath, layers) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  for (const layerName of Object.keys(layers)) {
    const pattern = "/" + layerName + "/";
    if (normalizedPath.includes(pattern)) {
      return layerName;
    }
  }
  return null;
}

/**
 * Detects the layer of an import target based on the import source.
 * @param {string} importSource - The import source string.
 * @param {Object} layers - The layer configuration.
 * @returns {string|null} - The layer name, or null if not in any layer.
 */
function detectImportLayer(importSource, layers) {
  for (const layerName of Object.keys(layers)) {
    const pattern = "/" + layerName + "/";
    const startPattern = layerName + "/";
    if (
      importSource.includes(pattern) ||
      importSource.startsWith(startPattern)
    ) {
      return layerName;
    }
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce architectural layer boundaries by preventing imports that violate the dependency direction (e.g. core cannot import from adapters)",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/no-cross-boundary-import.md",
    },
    messages: {
      crossBoundary:
        "Layer '{{from}}' cannot import from '{{to}}'. Allowed dependencies: {{allowed}}.",
    },
    schema: [
      {
        type: "object",
        properties: {
          layers: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: { type: "string" },
            },
            description:
              "Layer definitions mapping layer names to their allowed dependencies. E.g. { \"core\": [], \"adapters\": [\"core\", \"interfaces\"] }",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const layers = options.layers || DEFAULT_LAYERS;

    const filename = context.filename || context.getFilename();
    const currentLayer = detectLayer(filename, layers);

    if (!currentLayer) {
      return {};
    }

    const allowedDeps = layers[currentLayer];

    function checkImport(node, importSource) {
      if (!importSource || typeof importSource !== "string") {
        return;
      }

      let targetLayer = null;

      if (importSource.startsWith(".") || importSource.startsWith("/")) {
        const resolvedPath = path.resolve(
          path.dirname(filename),
          importSource,
        );
        targetLayer = detectLayer(resolvedPath, layers);
      } else {
        targetLayer = detectImportLayer(importSource, layers);
      }

      if (!targetLayer || targetLayer === currentLayer) {
        return;
      }

      if (!allowedDeps.includes(targetLayer)) {
        context.report({
          node,
          messageId: "crossBoundary",
          data: {
            from: currentLayer,
            to: targetLayer,
            allowed:
              allowedDeps.length > 0
                ? "[" + allowedDeps.join(", ") + "]"
                : "none (no external dependencies allowed)",
          },
        });
      }
    }

    return {
      ImportDeclaration(node) {
        checkImport(node, node.source.value);
      },
      CallExpression(node) {
        if (
          node.callee.name === "require" &&
          node.arguments.length > 0 &&
          node.arguments[0].type === "Literal" &&
          typeof node.arguments[0].value === "string"
        ) {
          checkImport(node, node.arguments[0].value);
        }
      },
    };
  },
};
