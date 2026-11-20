import { test as base } from "@playwright/test";

/** Test con il banner di consenso già gestito ("solo necessari"). */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: false })));
    await use(page);
  },
});
export { expect } from "@playwright/test";
