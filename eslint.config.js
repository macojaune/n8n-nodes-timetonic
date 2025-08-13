const {
    defineConfig,
} = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const n8nNodesBase = require("eslint-plugin-n8n-nodes-base");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        sourceType: "module",
        ecmaVersion: 2019,

        parserOptions: {
            project: "tsconfig.json",
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "n8n-nodes-base": n8nNodesBase,
    },

    extends: compat.extends(
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "plugin:n8n-nodes-base/nodes",
    ),

    rules: {
        "n8n-nodes-base/node-dirname-against-convention": "error",
        "n8n-nodes-base/node-class-description-inputs-wrong-regular-node": "error",
        "n8n-nodes-base/node-class-description-outputs-wrong": "error",
        "n8n-nodes-base/node-filename-against-convention": "error",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-explicit-any": "warn",
    },
}]);