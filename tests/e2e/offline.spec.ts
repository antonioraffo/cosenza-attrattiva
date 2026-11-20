import { expect, test } from "./fixtures";

// Il service worker è attivo solo nella build di produzione: make prod-local && make e2e-prod
test.skip(!process.env.E2E_PROD, "richiede la build di produzione");

test("itinerario scaricato consultabile offline", async ({ page, context }) => {
  test.skip(test.info().project.name !== "mobile", "una sola volta");
  await page.goto("/it/itinerari/fede-di-pietra");
  // attende che il service worker controlli la pagina
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, null, { timeout: 20_000 }).catch(async () => {
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  });
  await page.getByRole("button", { name: "Scarica per l'offline" }).click();
  await expect(page.getByRole("button", { name: "Disponibile offline" })).toBeVisible({ timeout: 60_000 });

  await context.setOffline(true);
  await page.goto("/it/itinerari/fede-di-pietra/racconto");
  await expect(page.getByRole("heading", { level: 1, name: "Fede di pietra" })).toBeVisible();
  await page.goto("/it/luoghi/duomo");
  await expect(page.getByRole("heading", { name: "Il racconto" })).toBeVisible({ timeout: 20_000 });
  await context.setOffline(false);
});
