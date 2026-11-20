import { expect, test } from "./fixtures";

test("racconto: lo scroll attiva i capitoli e la mappa", async ({ page }) => {
  await page.goto("/it/itinerari/il-re-nel-fiume/racconto");
  await expect(page.locator(".maplibregl-canvas")).toBeVisible({ timeout: 20_000 });
  const chapters = page.locator("section[data-index]");
  expect(await chapters.count()).toBeGreaterThanOrEqual(4);

  await chapters.nth(1).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  await expect(page.getByText(/Capitolo \d+ di \d+/)).toBeVisible();
});
