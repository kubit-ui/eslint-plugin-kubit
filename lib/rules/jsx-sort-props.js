"use strict";

/**
 * Checks if an attribute name represents a callback (starts with 'on').
 * @param {string} name - The attribute name.
 * @returns {boolean}
 */
function isCallbackProp(name) {
  return /^on[A-Z]/.test(name);
}

/**
 * Checks if an attribute is a shorthand boolean (no value assigned).
 * @param {object} attr - The JSX attribute node.
 * @returns {boolean}
 */
function isShorthandProp(attr) {
  return attr.value === null || attr.value === undefined;
}

/**
 * Reserved props that should appear first (key, ref, etc.).
 */
const RESERVED_PROPS = ["key", "ref", "dangerouslySetInnerHTML"];

/**
 * Gets a comparable prop name from a JSX attribute node.
 * @param {object} attr - The JSX attribute node.
 * @returns {string|null}
 */
function getPropName(attr) {
  if (attr.type === "JSXSpreadAttribute") {
    return null;
  }
  if (attr.name.type === "JSXNamespacedName") {
    return attr.name.namespace.name + ":" + attr.name.name.name;
  }
  return attr.name.name;
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description:
        "Enforce sorted props in JSX elements for consistency and readability",
      category: "Stylistic Issues",
      recommended: true,
      url: "https://github.com/kubit-ui/eslint-plugin-kubit/blob/main/docs/rules/jsx-sort-props.md",
    },
    messages: {
      sortProps:
        "JSX props should be sorted: '{{current}}' should be before '{{previous}}'.",
    },
    schema: [
      {
        type: "object",
        properties: {
          callbacksLast: {
            type: "boolean",
            description: "Enforce callbacks (onX) to be listed last",
          },
          shorthandFirst: {
            type: "boolean",
            description: "Enforce shorthand props to be listed first",
          },
          reservedFirst: {
            type: "boolean",
            description: "Enforce reserved props (key, ref) to be listed first",
          },
          ignoreCase: {
            type: "boolean",
            description: "Ignore case when sorting",
          },
          noSortAlphabetically: {
            type: "boolean",
            description: "Do not enforce alphabetical sorting",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const callbacksLast = options.callbacksLast || false;
    const shorthandFirst = options.shorthandFirst || false;
    const reservedFirst = options.reservedFirst || false;
    const ignoreCase = options.ignoreCase || false;
    const noSortAlphabetically = options.noSortAlphabetically || false;

    function getSortRank(attr) {
      const name = getPropName(attr);
      if (name === null) {
        return 3;
      }
      if (reservedFirst && RESERVED_PROPS.includes(name)) {
        return 0;
      }
      if (shorthandFirst && isShorthandProp(attr)) {
        return 1;
      }
      if (callbacksLast && isCallbackProp(name)) {
        return 5;
      }
      return 3;
    }

    function comparePropNames(nameA, nameB) {
      if (ignoreCase) {
        return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
      }
      return nameA.localeCompare(nameB);
    }

    function compareAttrs(attrA, attrB) {
      const rankA = getSortRank(attrA);
      const rankB = getSortRank(attrB);
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      if (noSortAlphabetically) {
        return 0;
      }
      const nameA = getPropName(attrA);
      const nameB = getPropName(attrB);
      return comparePropNames(nameA, nameB);
    }

    function createFixer(node) {
      const sourceCode = context.sourceCode || context.getSourceCode();
      const attrs = node.attributes;
      return function fix(fixer) {
        // Split attributes into groups separated by spread attributes
        const groups = [];
        let currentGroup = [];
        for (const attr of attrs) {
          if (attr.type === "JSXSpreadAttribute") {
            if (currentGroup.length > 0) {
              groups.push({ type: "sortable", items: currentGroup });
              currentGroup = [];
            }
            groups.push({ type: "spread", items: [attr] });
          } else {
            currentGroup.push(attr);
          }
        }
        if (currentGroup.length > 0) {
          groups.push({ type: "sortable", items: currentGroup });
        }

        const fixes = [];
        for (const group of groups) {
          if (group.type !== "sortable" || group.items.length <= 1) {
            continue;
          }
          const original = group.items;
          const sorted = [...original].sort(compareAttrs);

          for (let i = 0; i < original.length; i++) {
            if (original[i] !== sorted[i]) {
              const originalText = sourceCode.getText(original[i]);
              const sortedText = sourceCode.getText(sorted[i]);
              if (originalText !== sortedText) {
                fixes.push(fixer.replaceText(original[i], sortedText));
              }
            }
          }
        }
        return fixes;
      };
    }

    return {
      JSXOpeningElement(node) {
        const attrs = node.attributes;
        if (attrs.length <= 1) {
          return;
        }

        let firstErrorReported = false;
        let previousName = null;
        let previousRank = -1;

        for (let i = 0; i < attrs.length; i++) {
          const currentAttr = attrs[i];
          const currentName = getPropName(currentAttr);

          if (currentName === null) {
            previousName = null;
            previousRank = -1;
            continue;
          }

          const currentRank = getSortRank(currentAttr);
          let isError = false;

          if (previousName !== null) {
            if (currentRank < previousRank) {
              isError = true;
            } else if (currentRank === previousRank && !noSortAlphabetically) {
              const comparison = comparePropNames(currentName, previousName);
              if (comparison < 0) {
                isError = true;
              }
            }
          }

          if (isError) {
            const report = {
              node: currentAttr,
              messageId: "sortProps",
              data: { current: currentName, previous: previousName },
            };
            if (!firstErrorReported) {
              report.fix = createFixer(node);
              firstErrorReported = true;
            }
            context.report(report);
          }

          previousName = currentName;
          previousRank = currentRank;
        }
      },
    };
  },
};
