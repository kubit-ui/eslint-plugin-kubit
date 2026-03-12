"use strict";

/**
 * Browser compatibility rules configuration.
 * Migrated from eslint-config-kubit checkBrowserCompatibility option.
 *
 * Usage: Add this config when you need browser compatibility checks.
 * Requires: eslint-plugin-compat
 */

const DEFAULT_BROWSER_LIST = ["> 1%", "last 2 versions", "not ie <= 11"];

const compatPlugin = require("eslint-plugin-compat");

module.exports = {
  plugins: {
    compat: compatPlugin,
  },
  settings: {
    browsers: DEFAULT_BROWSER_LIST,
  },
  rules: {
    "compat/compat": "error",
  },
};
