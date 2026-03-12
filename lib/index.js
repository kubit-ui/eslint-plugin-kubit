"use strict";

const noIndexImport = require("./rules/no-index-import");
const noRelativeImportPaths = require("./rules/no-relative-import-paths");
const baseConfig = require("./configs/base");
const typescriptConfig = require("./configs/typescript");
const reactConfig = require("./configs/react");
const compatConfig = require("./configs/compat");
const biomeConfig = require("./configs/biome");
const oxlintConfig = require("./configs/oxlint");

const plugin = {
  meta: {
    name: "@kubit-ui-web/eslint-plugin-kubit",
    version: require("../package.json").version,
  },
  rules: {
    "no-index-import": noIndexImport,
    "no-relative-import-paths": noRelativeImportPaths,
  },
  configs: {},
};

// --- Kubit custom rules only (ideal for Biome/OxLint projects) ---
plugin.configs["kubit-rules"] = {
  plugins: {
    kubit: plugin,
  },
  rules: {
    "kubit/no-index-import": "error",
    "kubit/no-relative-import-paths": [
      "error",
      {
        allowSameFolder: true,
        allowedDepth: 2,
      },
    ],
  },
};

// --- Base: languageOptions + settings + general JS/ES6 + import + perfectionist + jest rules ---
plugin.configs.base = {
  ...baseConfig,
};

// --- TypeScript rules ---
plugin.configs.typescript = {
  ...typescriptConfig,
};

// --- React + Accessibility rules ---
plugin.configs.react = {
  ...reactConfig,
};

// --- Browser compatibility rules (optional) ---
plugin.configs.compat = {
  ...compatConfig,
};

// --- Biome: only rules Biome doesn't cover + kubit custom rules ---
plugin.configs.biome = {
  plugins: {
    ...biomeConfig.plugins,
    kubit: plugin,
  },
  rules: {
    ...biomeConfig.rules,
    "kubit/no-index-import": "error",
    "kubit/no-relative-import-paths": [
      "error",
      {
        allowSameFolder: true,
        allowedDepth: 2,
      },
    ],
  },
};

// --- OxLint: only rules OxLint doesn't cover + kubit custom rules ---
plugin.configs.oxlint = {
  plugins: {
    ...oxlintConfig.plugins,
    kubit: plugin,
  },
  rules: {
    ...oxlintConfig.rules,
    "kubit/no-index-import": "error",
    "kubit/no-relative-import-paths": [
      "error",
      {
        allowSameFolder: true,
        allowedDepth: 2,
      },
    ],
  },
};

// --- Recommended: base + typescript + kubit custom rules (NO React) ---
plugin.configs.recommended = {
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
    "kubit/no-index-import": "error",
    "kubit/no-relative-import-paths": [
      "error",
      {
        allowSameFolder: true,
        allowedDepth: 2,
      },
    ],
  },
};

// --- Recommended React: recommended + react + a11y (replaces isReact: true) ---
plugin.configs["recommended-react"] = {
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
    "kubit/no-index-import": "error",
    "kubit/no-relative-import-paths": [
      "error",
      {
        allowSameFolder: true,
        allowedDepth: 2,
      },
    ],
  },
};

module.exports = plugin;
