import { expect, passportOn, test } from "./fixtures";

/* Fase 3 della sintesi: «Il tuo tempo, il tuo giro» (fascia in home, pagina con linea del tempo). */

test("home: «Il tuo tempo» e «Il tuo giro» con il giro e il link alla pagina completa", async ({ page }) => {
  await page.goto("/it");
  await page.waitForLoadState("networkidle");
  const block = page.locator("#il-tuo-tempo");
  await block.scrollIntoViewIfNeeded();
  const options = block.getByRole("radiogroup", { name: /tempo/i });
  await expect(options.getByRole("radio", { name: "1 giorno" })).toHaveAttribute("aria-checked", "true");
  await expect(block.locator(".ca-hometime-card")).not.toHaveCount(0);
  await expect(block.locator(".ca-hometime-card").first()).toContainText("10:00");
  await options.getByRole("radio", { name: "Weekend" }).click();
  await expect(block.getByRole("heading", { level: 3, name: "Giorno 2" })).toBeVisible();
  await block.getByRole("link", { name: "Apri il giro con la mappa" }).click();
  await expect(page).toHaveURL(/\/it\/il-tuo-tempo\?t=weekend&ora=10$/);
  await expect(page.getByRole("heading", { level: 2, name: /^Giorno 2/ })).toBeVisible();
});

test("il tuo tempo: scelta, ora di partenza, orari e indirizzo condivisibile", async ({ page }) => {
  await page.goto("/it/il-tuo-tempo");
  await expect(page.getByRole("heading", { level: 1, name: "Il tuo tempo, il tuo giro" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^3 ore/ })).toHaveAttribute("aria-pressed", "true");
  const first = page.locator(".ca-tl-item--itinerary").first();
  await expect(first.locator(".ca-tl-time")).toHaveText("10:00");
  await expect(first.locator(".ca-tl-stops li")).not.toHaveCount(0);
  await expect(page.locator(".ca-tl-stops").first()).toContainText(/\d+ min a piedi/);

  await page.getByLabel("Partenza alle").selectOption("15");
  await expect(first.locator(".ca-tl-time")).toHaveText("15:00");
  await page.getByRole("button", { name: /^1 giorno/ }).click();
  await expect(page).toHaveURL(/\?t=1g&ora=15$/);
  await expect(page.getByText(/^Pausa/)).toBeVisible();

  const href = await page.getByRole("link", { name: "Condividi su WhatsApp" }).getAttribute("href");
  expect(decodeURIComponent(href!)).toContain("/it/il-tuo-tempo?t=1g&ora=15");

  // nessun itinerario ripetuto nel giro
  const titles = await page.locator(".ca-tl-item--itinerary h3").allTextContents();
  expect(new Set(titles).size).toBe(titles.length);
});

test("il tuo tempo: salva le tappe del giro nel mio itinerario", async ({ page }) => {
  test.skip(passportOn, "con il passaporto attivo «Il mio itinerario» non c'è");
  await page.goto("/it/il-tuo-tempo?t=3h");
  await page.getByRole("button", { name: "Salva le tappe nel mio itinerario" }).click();
  await expect(page.getByRole("status").filter({ hasText: /tappe aggiunte/ })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("cosenza-my-itinerary:v1") ?? "{}").places as string[]);
  expect(saved.length).toBeGreaterThan(3);
  expect(new Set(saved).size).toBe(saved.length);
});
