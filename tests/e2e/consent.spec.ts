import { expect, test } from "@playwright/test";

test("banner di consenso: i servizi Google restano spenti con \"Solo necessari\"", async ({ page }) => {
  await page.goto("/it");
  const banner = page.getByRole("dialog", { name: "La tua privacy" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Solo necessari" }).click();
  await expect(banner).toBeHidden();
  const stored = await page.evaluate(() => localStorage.getItem("cosenza-consent:v1"));
  expect(JSON.parse(stored!)).toEqual({ decided: true, google: false });
  await page.reload();
  await expect(page.getByRole("dialog", { name: "La tua privacy" })).toBeHidden();
});
