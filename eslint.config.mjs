import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    pluginJs.configs.recommended,
    eslintConfigPrettier,
    {
        languageOptions: { globals: globals.browser },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
        },
    },
];
