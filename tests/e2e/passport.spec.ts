import { expect, test } from "./fixtures";

test("passaporto: timbri e avanzamento dei sigilli", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "cosenza-passport:v1",
      JSON.stringify({ version: 1, stamps: { duomo: { at: "2026-11-20T10:00:00.000Z" } }, badges: {} }),
    ),
  );
  await page.goto("/it/passaporto");
  await expect(page.getByRole("heading", { name: "1 timbro" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Duomo|Cattedrale/ }).first()).toBeVisible();
  await expect(page.getByText(/1 di \d+ tappe/).first()).toBeVisible();
});
