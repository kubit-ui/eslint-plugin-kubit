const plugin = require("../lib/index");

describe("eslint-plugin-kubit", () => {
  it("should export plugin meta information", () => {
    expect(plugin.meta).toBeDefined();
    expect(plugin.meta.name).toBe("eslint-plugin-kubit");
    expect(plugin.meta.version).toBeDefined();
  });

  it("should export all custom rules", () => {
    expect(plugin.rules).toBeDefined();
    expect(plugin.rules["no-index-import"]).toBeDefined();
    expect(plugin.rules["no-relative-import-paths"]).toBeDefined();
    expect(Object.keys(plugin.rules)).toHaveLength(2);
  });

  it("each rule should have proper meta information", () => {
    for (const [name, rule] of Object.entries(plugin.rules)) {
      expect(rule.meta, `Rule '${name}' should have meta`).toBeDefined();
      expect(
        rule.meta.type,
        `Rule '${name}' should have meta.type`,
      ).toBeDefined();
      expect(
        rule.meta.docs,
        `Rule '${name}' should have meta.docs`,
      ).toBeDefined();
      expect(
        rule.meta.docs.description,
        `Rule '${name}' should have meta.docs.description`,
      ).toBeDefined();
      expect(
        rule.meta.docs.url,
        `Rule '${name}' should have meta.docs.url`,
      ).toBeDefined();
      expect(
        rule.meta.schema,
        `Rule '${name}' should have meta.schema`,
      ).toBeDefined();
      expect(
        rule.meta.messages,
        `Rule '${name}' should have meta.messages`,
      ).toBeDefined();
      expect(
        rule.create,
        `Rule '${name}' should have create function`,
      ).toBeTypeOf("function");
    }
  });

  describe("configs", () => {
    it("should export all config presets", () => {
      expect(plugin.configs).toBeDefined();
      expect(plugin.configs["kubit-rules"]).toBeDefined();
      expect(plugin.configs.base).toBeDefined();
      expect(plugin.configs.typescript).toBeDefined();
      expect(plugin.configs.react).toBeDefined();
      expect(plugin.configs.recommended).toBeDefined();
      expect(plugin.configs["recommended-react"]).toBeDefined();
      expect(plugin.configs.compat).toBeDefined();
      expect(plugin.configs.biome).toBeDefined();
      expect(plugin.configs.oxlint).toBeDefined();
      expect(Object.keys(plugin.configs)).toHaveLength(9);
    });

    it("kubit-rules config should contain only custom kubit rules", () => {
      const config = plugin.configs["kubit-rules"];
      expect(config.plugins.kubit).toBe(plugin);
      expect(config.rules["kubit/no-index-import"]).toBe("error");
      expect(config.rules["kubit/no-relative-import-paths"]).toBeDefined();
      expect(Object.keys(config.rules)).toHaveLength(2);
    });

    it("base config should contain languageOptions and settings", () => {
      const config = plugin.configs.base;
      expect(config.languageOptions.ecmaVersion).toBe("latest");
      expect(config.languageOptions.sourceType).toBe("module");
      expect(config.languageOptions.globals.NodeJS).toBe("writable");
      expect(config.settings["import/resolver"].node.extensions).toEqual([
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
      ]);
    });

    it("base config should contain all general JS rules", () => {
      const config = plugin.configs.base;
      expect(config.rules["prettier/prettier"]).toBeDefined();
      expect(config.rules["no-console"]).toBe("error");
      expect(config.rules["no-alert"]).toBe("error");
      expect(config.rules["no-debugger"]).toBe("error");
      expect(config.rules["prefer-const"]).toBe("error");
      expect(config.rules["no-var"]).toBe("error");
      expect(config.rules["no-eval"]).toBe("error");
      expect(config.rules["complexity"]).toBeDefined();
      expect(config.rules["consistent-return"]).toBe("error");
      expect(config.rules["no-throw-literal"]).toBe("error");
      expect(config.rules["no-param-reassign"]).toBe("error");
      expect(config.rules["no-restricted-imports"]).toBeDefined();
      expect(config.rules["node/no-unpublished-import"]).toBe("off");
      expect(config.rules["unused-imports/no-unused-imports"]).toBe("error");
      expect(config.rules["import/no-cycle"]).toBeDefined();
      expect(config.rules["perfectionist/sort-objects"]).toBeDefined();
      expect(config.rules["perfectionist/sort-imports"]).toBeDefined();
      expect(config.rules["perfectionist/sort-exports"]).toBeDefined();
      expect(config.rules["jest/no-focused-tests"]).toBe("error");
    });

    it("typescript config should contain all TS rules", () => {
      const config = plugin.configs.typescript;
      expect(config.rules["@typescript-eslint/no-non-null-assertion"]).toBe(
        "error",
      );
      expect(config.rules["@typescript-eslint/no-explicit-any"]).toBe("error");
      expect(config.rules["@typescript-eslint/consistent-type-imports"]).toBe(
        "error",
      );
      expect(
        config.rules["@typescript-eslint/consistent-type-definitions"],
      ).toBeDefined();
      expect(
        config.rules["@typescript-eslint/explicit-module-boundary-types"],
      ).toBeDefined();
      expect(config.rules["@typescript-eslint/ban-ts-comment"]).toBeDefined();
      expect(config.rules["@typescript-eslint/no-empty-function"]).toBe(
        "error",
      );
      expect(config.rules["@typescript-eslint/no-duplicate-enum-values"]).toBe(
        "off",
      );
      expect(config.rules["@typescript-eslint/no-shadow"]).toBe("error");
      expect(
        config.rules["@typescript-eslint/no-use-before-define"],
      ).toBeDefined();
      expect(config.rules["@typescript-eslint/no-magic-numbers"]).toBeDefined();
      expect(Object.keys(config.rules)).toHaveLength(11);
    });

    it("react config should contain React and a11y rules", () => {
      const config = plugin.configs.react;
      expect(config.rules["react/jsx-key"]).toBe("error");
      expect(config.rules["react/self-closing-comp"]).toBe("error");
      expect(config.rules["react/jsx-pascal-case"]).toBe("error");
      expect(config.rules["jsx-a11y/alt-text"]).toBe("error");
      expect(config.rules["jsx-a11y/anchor-is-valid"]).toBe("error");
      expect(config.settings.react.version).toBe("detect");
    });

    it("compat config should contain browser compatibility rules", () => {
      const config = plugin.configs.compat;
      expect(config.rules["compat/compat"]).toBe("error");
      expect(config.settings.browsers).toBeDefined();
    });

    it("biome config should contain only rules Biome does not cover + kubit rules", () => {
      const config = plugin.configs.biome;
      expect(config.plugins.kubit).toBe(plugin);
      // kubit custom rules included
      expect(config.rules["kubit/no-index-import"]).toBe("error");
      expect(config.rules["kubit/no-relative-import-paths"]).toBeDefined();
      // rules Biome doesn't cover
      expect(config.rules["import/no-cycle"]).toBeDefined();
      expect(config.rules["complexity"]).toBeDefined();
      expect(config.rules["consistent-return"]).toBe("error");
      expect(config.rules["perfectionist/sort-objects"]).toBeDefined();
      expect(
        config.rules["@typescript-eslint/explicit-module-boundary-types"],
      ).toBeDefined();
      expect(config.rules["@typescript-eslint/no-shadow"]).toBe("error");
      // should NOT have rules Biome covers
      expect(config.rules["no-debugger"]).toBeUndefined();
      expect(config.rules["no-var"]).toBeUndefined();
      expect(config.rules["prefer-const"]).toBeUndefined();
      expect(config.rules["prettier/prettier"]).toBeUndefined();
    });

    it("oxlint config should contain only rules OxLint does not cover + kubit rules", () => {
      const config = plugin.configs.oxlint;
      expect(config.plugins.kubit).toBe(plugin);
      // kubit custom rules included
      expect(config.rules["kubit/no-index-import"]).toBe("error");
      expect(config.rules["kubit/no-relative-import-paths"]).toBeDefined();
      // rules OxLint doesn't cover
      expect(config.rules["prettier/prettier"]).toBeDefined();
      expect(config.rules["perfectionist/sort-objects"]).toBeDefined();
      expect(
        config.rules["@typescript-eslint/consistent-type-definitions"],
      ).toBeDefined();
      expect(
        config.rules["@typescript-eslint/explicit-module-boundary-types"],
      ).toBeDefined();
      // should NOT have rules OxLint covers
      expect(config.rules["no-debugger"]).toBeUndefined();
      expect(config.rules["import/no-cycle"]).toBeUndefined();
      expect(
        config.rules["@typescript-eslint/no-explicit-any"],
      ).toBeUndefined();
      // oxlint should have fewer rules than biome config
      const biomeRuleCount = Object.keys(plugin.configs.biome.rules).length;
      const oxlintRuleCount = Object.keys(config.rules).length;
      expect(oxlintRuleCount).toBeLessThan(biomeRuleCount);
    });

    it("recommended config should merge base + typescript + kubit rules with languageOptions", () => {
      const config = plugin.configs.recommended;
      expect(config.plugins.kubit).toBe(plugin);
      // languageOptions
      expect(config.languageOptions.ecmaVersion).toBe("latest");
      expect(config.languageOptions.sourceType).toBe("module");
      expect(config.languageOptions.globals.NodeJS).toBe("writable");
      expect(config.languageOptions.globals.JSX).toBeUndefined();
      // settings
      expect(config.settings["import/resolver"]).toBeDefined();
      // base rules
      expect(config.rules["no-console"]).toBe("error");
      expect(config.rules["prefer-const"]).toBe("error");
      expect(config.rules["no-restricted-imports"]).toBeDefined();
      // typescript rules
      expect(config.rules["@typescript-eslint/no-explicit-any"]).toBe("error");
      // kubit rules
      expect(config.rules["kubit/no-index-import"]).toBe("error");
      expect(config.rules["kubit/no-relative-import-paths"]).toBeDefined();
      // should NOT have react rules
      expect(config.rules["react/jsx-key"]).toBeUndefined();
    });

    it("recommended-react config should merge all rules with React globals", () => {
      const config = plugin.configs["recommended-react"];
      expect(config.plugins.kubit).toBe(plugin);
      // languageOptions with React globals
      expect(config.languageOptions.ecmaVersion).toBe("latest");
      expect(config.languageOptions.globals.NodeJS).toBe("writable");
      expect(config.languageOptions.globals.JSX).toBe(true);
      expect(config.languageOptions.globals.React).toBe("writable");
      // settings (base + react)
      expect(config.settings["import/resolver"]).toBeDefined();
      expect(config.settings.react.version).toBe("detect");
      // base rules
      expect(config.rules["no-console"]).toBe("error");
      // typescript rules
      expect(config.rules["@typescript-eslint/no-explicit-any"]).toBe("error");
      // react rules
      expect(config.rules["react/jsx-key"]).toBe("error");
      expect(config.rules["jsx-a11y/alt-text"]).toBe("error");
      // kubit rules
      expect(config.rules["kubit/no-index-import"]).toBe("error");
    });
  });
});
