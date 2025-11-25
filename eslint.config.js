import eslintJs from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import prettier from "eslint-config-prettier";
import globals from "globals";

const STUDENT_LIMITS = {
  MAX_LINES: 30, // Forces focused functions
  MAX_PARAMS: 2, // Forces good design decisions
  MAX_DEPTH: 2, // Prevents nested spaghetti
  MAX_STATEMENTS: 10, // Forces decomposition
};

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      ...eslintJs.configs.recommended.rules,

      // Functions should do one thing
      "max-lines-per-function": [
        "error",
        {
          max: STUDENT_LIMITS.MAX_LINES,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      "max-statements": ["error", STUDENT_LIMITS.MAX_STATEMENTS],
      "max-params": ["error", STUDENT_LIMITS.MAX_PARAMS],

      // Keep logic simple
      "max-depth": ["error", STUDENT_LIMITS.MAX_DEPTH],
      "no-nested-ternary": "error",

      camelcase: "error",

      // Modern JavaScript
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      eqeqeq: ["error", "always"],
      "dot-notation": "error",

      // Single Responsibility
      "max-classes-per-file": ["error", 1],
      "one-var": ["error", "never"],

      // Immutability
      "no-param-reassign": "error",
      "no-multi-assign": "error",
      "no-return-assign": "error",

      // Early returns
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",

      // Error handling
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error",
      "consistent-return": "error", // Functions should always return or never return
      "no-fallthrough": "error", // Prevent accidental switch fallthrough
      "no-shadow": "error", // Prevent variable shadowing bugs

      // No sloppy code
      "no-unused-vars": "error",
      "no-debugger": "error",
      "no-console": [
        "error",
        {
          allow: ["info", "warn", "error", "table", "time", "timeEnd"],
        },
      ],
    },
  },
  {
    files: ["**/*.json", "**/*.jsonc"],
    language: "json/json",
    ...json.configs.recommended,
  },
  {
    files: ["**/*.md"],
    language: "markdown/gfm",
    ...markdown.configs.recommended,
  },
  prettier,
];
