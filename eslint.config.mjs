import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The site is a deliberate MPA: each route's inline script must re-run on
      // entry and per-route CSS must not leak across navigations, so internal
      // links are plain <a> full-page loads — <Link/> would break both.
      "@next/next/no-html-link-for-pages": "off",
      // The v10 design specifies exact <img> markup (both axes in CSS, halftone
      // masks); next/image would rewrite dimensions and wrap markup.
      "@next/next/no-img-element": "off",
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
