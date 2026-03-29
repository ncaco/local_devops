import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/admin/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/src/shared/api",
              message: "Use admin-specific API modules under '@/src/shared/api/admin-*' in admin pages.",
            },
            {
              name: "@/src/shared/api/organizations",
              message: "Admin pages must not use non-admin organization APIs.",
            },
            {
              name: "@/src/shared/api/users",
              message: "Admin pages must not use non-admin user APIs.",
            },
          ],
          patterns: ["@/src/shared/api/organizations/*", "@/src/shared/api/users/*"],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
