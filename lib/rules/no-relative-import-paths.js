"use strict";

const path = require("path");

/**
 * Checks if the relative path points to a parent folder within the rootDir scope.
 * @param {string} relativeFilePath - The relative import path.
 * @param {string} cwd - The current working directory.
 * @param {string} filename - The current file being linted.
 * @param {string} rootDir - The root directory for path resolution.
 * @returns {boolean} - Whether the path is a parent folder reference.
 */
function isParentFolder(relativeFilePath, cwd, filename, rootDir) {
  const absoluteRootPath = path.join(cwd, rootDir);
  const absoluteFilePath = path.join(
    path.dirname(filename),
    relativeFilePath,
  );

  return (
    relativeFilePath.startsWith("../") &&
    (rootDir === "" ||
      (absoluteFilePath.startsWith(absoluteRootPath) &&
        filename.startsWith(absoluteRootPath)))
  );
}

/**
 * Checks if the path starts with './' (same folder import).
 * @param {string} importPath - The import path.
 * @returns {boolean} - Whether the path is a same-folder import.
 */
function isSameFolder(importPath) {
  return importPath.startsWith("./");
}

/**
 * Calculates the depth of a relative path (number of '../' levels).
 * @param {string} importPath - The relative import path.
 * @returns {number} - The depth of parent traversals.
 */
function getRelativePathDepth(importPath) {
  let depth = 0;
  let remaining = importPath;
  while (remaining.startsWith("../")) {
    depth += 1;
    remaining = remaining.substring(3);
  }
  return depth;
}

/**
 * Converts a relative import path to an absolute path with prefix.
 * @param {string} relativePath - The relative import path.
 * @param {string} cwd - The current working directory.
 * @param {string} filename - The current file being linted.
 * @param {string} rootDir - The root directory for path resolution.
 * @param {string} prefix - The prefix to prepend (e.g. '@').
 * @returns {string} - The absolute import path.
 */
function getAbsolutePath(relativePath, cwd, filename, rootDir, prefix) {
  return [
    prefix,
    ...path
      .relative(
        path.join(cwd, rootDir),
        path.join(path.dirname(filename), relativePath),
      )
      .split(path.sep),
  ]
    .filter(String)
    .join("/");
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description:
        "Enforce absolute import paths instead of relative paths for better maintainability",
      category: "Best Practices",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/no-relative-import-paths.md",
    },
    messages: {
      noRelativeImportPaths:
        "Import statements should use absolute paths instead of relative paths.",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowSameFolder: {
            type: "boolean",
            description:
              "Allow relative imports from the same folder (e.g. './utils')",
          },
          rootDir: {
            type: "string",
            description:
              "Root directory for resolving absolute paths (e.g. 'src')",
          },
          prefix: {
            type: "string",
            description:
              "Prefix for absolute imports (e.g. '@' produces '@/components/...')",
          },
          allowedDepth: {
            type: "number",
            description:
              "Maximum allowed depth of relative imports (e.g. 2 allows '../../' but not '../../../')",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const allowSameFolder = options.allowSameFolder || false;
    const rootDir = options.rootDir || "";
    const prefix = options.prefix || "";
    const allowedDepth = options.allowedDepth;

    // ESLint 10 API: use context.cwd and context.filename
    const cwd = context.cwd || context.getCwd();
    const filename = context.filename || context.getFilename();

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (isParentFolder(importPath, cwd, filename, rootDir)) {
          if (
            typeof allowedDepth === "undefined" ||
            getRelativePathDepth(importPath) > allowedDepth
          ) {
            context.report({
              node,
              messageId: "noRelativeImportPaths",
              fix(fixer) {
                return fixer.replaceTextRange(
                  [node.source.range[0] + 1, node.source.range[1] - 1],
                  getAbsolutePath(importPath, cwd, filename, rootDir, prefix),
                );
              },
            });
          }
        }

        if (isSameFolder(importPath) && !allowSameFolder) {
          context.report({
            node,
            messageId: "noRelativeImportPaths",
            fix(fixer) {
              return fixer.replaceTextRange(
                [node.source.range[0] + 1, node.source.range[1] - 1],
                getAbsolutePath(importPath, cwd, filename, rootDir, prefix),
              );
            },
          });
        }
      },
    };
  },
};
