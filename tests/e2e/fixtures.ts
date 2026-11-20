import { test as base } from "@playwright/test";

/** Test con il banner di consenso già gestito ("solo necessari"). */
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: false })));
    await provide(page);
  },
});
export { expect } from "@playwright/test";
