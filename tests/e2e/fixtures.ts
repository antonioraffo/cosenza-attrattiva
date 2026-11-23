import { test as base } from "@playwright/test";

/** Test con il banner di consenso già gestito ("solo necessari"). */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: false })));
    await provide(page);
  },
});
export { expect } from "@playwright/test";

/** Passaporto e timbri: disattivati nella proposta di sintesi (NEXT_PUBLIC_FEATURE_PASSPORT, default false). */
export const passportOn = process.env.NEXT_PUBLIC_FEATURE_PASSPORT === "true";
