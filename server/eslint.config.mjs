import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin-js";

export default tseslint.config(
    { ignores: ["dist/**", "node_modules/**"] },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        plugins: {
            "@stylistic/js": stylistic,
        },
        rules: {
            "@stylistic/js/max-statements-per-line": ["warn", { max: 1 }],
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
    }
);