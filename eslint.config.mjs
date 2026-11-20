import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "node_modules/**", "public/**", "drizzle/**", "next-env.d.ts", "playwright-report/**", "test-results/**", "docs/**"] },
  ...nextVitals,
  ...nextTs,
];

export default config;
