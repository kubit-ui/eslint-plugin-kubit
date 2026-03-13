"use strict";

const path = require("path");
const fs = require("fs");

const INDEX_FILES = ["index.js", "index.jsx", "index.ts", "index.tsx"];

/**
 * Checks if a path points to an index file or a directory containing an index file.
 * @param {string} fullPath - The full path to check.
 * @returns {boolean} - Returns true if the path points to an index file or a directory containing an index file.
 */
function isIndexOrDirectoryWithIndex(fullPath) {
  try {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      return INDEX_FILES.some((indexFile) =>
        fs.existsSync(path.join(fullPath, indexFile)),
      );
    }
    if (stat.isFile()) {
      return INDEX_FILES.includes(path.basename(fullPath));
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Resolves the full path of an import considering aliases.
 * @param {string} importPath - The import path.
 * @param {Object} aliases - The aliases configuration.
 * @param {string} contextFilename - The filename of the current context.
 * @returns {string} - The resolved full path.
 */
function resolveFullPath(importPath, aliases, contextFilename) {
  for (const [alias, aliasPath] of Object.entries(aliases)) {
    if (importPath.startsWith(alias)) {
      const relativePath = importPath.slice(alias.length);
      return path.resolve(aliasPath.replace(/\/\*$/, ""), `.${relativePath}`);
    }
  }
  return path.resolve(path.dirname(contextFilename), importPath);
}

/**
 * Checks if the import path ends with '/index' or an index file extension.
 * @param {string} importPath - The import path.
 * @returns {boolean} - Returns true if the import path ends with an index file pattern.
 */
const INDEX_SUFFIXES = [
  "/index.tsx",
  "/index.jsx",
  "/index.ts",
  "/index.js",
  "/index",
];

/**
 * Checks if the import path ends with '/index' or an index file extension.
 * @param {string} importPath - The import path.
 * @returns {boolean} - Returns true if the import path ends with an index file pattern.
 */
function endsWithIndex(importPath) {
  return INDEX_SUFFIXES.some((suffix) => importPath.endsWith(suffix));
}

/**
 * Strips the index suffix from an import path.
 * @param {string} importPath - The import path.
 * @returns {string|null} - The import path without the index suffix, or null if no suffix found.
 */
function stripIndexSuffix(importPath) {
  for (const suffix of INDEX_SUFFIXES) {
    if (importPath.endsWith(suffix)) {
      return importPath.slice(0, -suffix.length);
    }
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description:
        "Disallow imports from index files (barrel files) to improve tree-shaking and reduce bundle size",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/no-index-import.md",
    },
    messages: {
      noIndexImport:
        "Importing from index files is not allowed. Import directly from the specific module instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          aliases: {
            type: "object",
            additionalProperties: { type: "string" },
            description:
              "Path aliases mapping (e.g. { '@/components': './src/components/*' })",
          },
          ignoreImports: {
            type: "array",
            items: { type: "string" },
            description:
              "List of import paths to ignore (e.g. ['react', 'lodash'])",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const aliases = options.aliases || {};
    const ignoreImports = options.ignoreImports || [];

    // ESLint 10 API: use context.filename instead of context.getFilename()
    const filename = context.filename || context.getFilename();

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (ignoreImports.includes(importPath)) {
          return;
        }

        const fullPath = resolveFullPath(importPath, aliases, filename);

        const hasExplicitIndex = endsWithIndex(importPath);
        const isDirectoryIndex = isIndexOrDirectoryWithIndex(fullPath);

        if (hasExplicitIndex || isDirectoryIndex) {
          const report = {
            node,
            messageId: "noIndexImport",
          };

          if (hasExplicitIndex) {
            const stripped = stripIndexSuffix(importPath);
            if (stripped) {
              report.fix = function fix(fixer) {
                return fixer.replaceText(
                  node.source,
                  node.source.raw[0] + stripped + node.source.raw[0],
                );
              };
            }
          }

          context.report(report);
        }
      },
    };
  },
};
