import { createSerwistRoute } from "@serwist/turbopack";

/** Service worker compilato con esbuild e servito da /serwist/sw.js (scope "/"). */
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "src/app/sw.ts",
  useNativeEsbuild: true,
});
