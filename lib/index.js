"use strict";

const noIndexImport = require("./rules/no-index-import");
const noRelativeImportPaths = require("./rules/no-relative-import-paths");
const jsxPascalCase = require("./rules/jsx-pascal-case");
const noMultiComp = require("./rules/no-multi-comp");
const jsxSortProps = require("./rules/jsx-sort-props");

// Kubit custom rule defaults (shared across configs)
const kubitRuleDefaults = {
  "kubit/no-index-import": "error",
  "kubit/no-relative-import-paths": [
    "error",
    {
      allowSameFolder: true,
      allowedDepth: 2,
    },
  ],
};

const plugin = {
  meta: {
    name: "@kubit-ui-web/eslint-plugin-kubit",
    version: require("../package.json").version,
  },
  rules: {
    "no-index-import": noIndexImport,
    "no-relative-import-paths": noRelativeImportPaths,
    "jsx-pascal-case": jsxPascalCase,
    "no-multi-comp": noMultiComp,
    "jsx-sort-props": jsxSortProps,
  },
  configs: {},
};

// --- Lazy config loader ---
// Configs depend on third-party ESLint plugins that require('eslint').
// When OxLint loads this plugin via jsPlugins, it only needs plugin.rules.
// Lazy loading prevents crashes in environments where ESLint is not installed.
function lazyRequire(path) {
  let cached;
  return () => {
    if (!cached) cached = require(path);
    return cached;
  };
}

const getBaseConfig = lazyRequire("./configs/base");
const getTypescriptConfig = lazyRequire("./configs/typescript");
const getReactConfig = lazyRequire("./configs/react");
const getCompatConfig = lazyRequire("./configs/compat");
const getBiomeConfig = lazyRequire("./configs/biome");
const getOxlintConfig = lazyRequire("./configs/oxlint");

// --- Kubit custom rules only (ideal for Biome/OxLint projects) ---
plugin.configs["kubit-rules"] = {
  plugins: {
    kubit: plugin,
  },
  rules: {
    ...kubitRuleDefaults,
  },
};

// --- Lazy config getters ---
// Each config is only loaded when first accessed, avoiding eager require() of ESLint plugins.
Object.defineProperties(plugin.configs, {
  base: {
    get() {
      return { ...getBaseConfig() };
    },
    enumerable: true,
  },
  typescript: {
    get() {
      return { ...getTypescriptConfig() };
    },
    enumerable: true,
  },
  react: {
    get() {
      return { ...getReactConfig() };
    },
    enumerable: true,
  },
  compat: {
    get() {
      return { ...getCompatConfig() };
    },
    enumerable: true,
  },
  biome: {
    get() {
      const biomeConfig = getBiomeConfig();
      return {
        plugins: {
          ...biomeConfig.plugins,
          kubit: plugin,
        },
        rules: {
          ...biomeConfig.rules,
          ...kubitRuleDefaults,
        },
      };
    },
    enumerable: true,
  },
  oxlint: {
    get() {
      const oxlintConfig = getOxlintConfig();
      return {
        plugins: {
          ...oxlintConfig.plugins,
          kubit: plugin,
        },
        rules: {
          ...oxlintConfig.rules,
          ...kubitRuleDefaults,
        },
      };
    },
    enumerable: true,
  },
  recommended: {
    get() {
      const baseConfig = getBaseConfig();
      const typescriptConfig = getTypescriptConfig();
      return {
        plugins: {
          ...baseConfig.plugins,
          ...typescriptConfig.plugins,
          kubit: plugin,
        },
        languageOptions: {
          ...baseConfig.languageOptions,
        },
        settings: {
          ...baseConfig.settings,
        },
        rules: {
          ...baseConfig.rules,
          ...typescriptConfig.rules,
          ...kubitRuleDefaults,
        },
      };
    },
    enumerable: true,
  },
  "recommended-react": {
    get() {
      const baseConfig = getBaseConfig();
      const typescriptConfig = getTypescriptConfig();
      const reactConfig = getReactConfig();
      return {
        plugins: {
          ...baseConfig.plugins,
          ...typescriptConfig.plugins,
          ...reactConfig.plugins,
          kubit: plugin,
        },
        languageOptions: {
          ...baseConfig.languageOptions,
          globals: {
            ...baseConfig.languageOptions.globals,
            JSX: true,
            React: "writable",
          },
        },
        settings: {
          ...baseConfig.settings,
          ...reactConfig.settings,
        },
        rules: {
          ...baseConfig.rules,
          ...typescriptConfig.rules,
          ...reactConfig.rules,
          ...kubitRuleDefaults,
        },
      };
    },
    enumerable: true,
  },
});

module.exports = plugin;
