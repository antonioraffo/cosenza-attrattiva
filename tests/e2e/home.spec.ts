import { expect, test } from "@playwright/test";

test("home editoriale con itinerari e filtri per tema", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/it$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const all = page.locator("#itinerari li article");
  await expect(all.first()).toBeVisible();
  const total = await all.count();
  expect(total).toBeGreaterThanOrEqual(6);

  await page.locator("#itinerari").getByRole("button", { name: "Fede" }).click();
  await expect(page.locator("#itinerari").getByRole("button", { name: "Fede" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => all.count()).toBeLessThan(total);
});

test("cambio lingua IT → EN", async ({ page }) => {
  await page.goto("/it");
  await page.getByRole("button", { name: /Lingua|Language/ }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
