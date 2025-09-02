import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin-js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    { ignores: ["dist/**"] },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsparser,
            parserOptions: { sourceType: "module", ecmaVersion: "latest" }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "@stylistic/js": stylistic
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...stylistic.configs["recommended-flat"].rules
        }
    }
];