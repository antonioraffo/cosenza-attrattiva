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

test("volo 3D MapLibre: si apre senza chiavi esterne e vola tra le tappe", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "una sola volta");
  test.skip((process.env.NEXT_PUBLIC_FLY3D_PROVIDER ?? "google3d") !== "maplibre", "motore MapLibre non configurato");
  const google: string[] = [];
  page.on("request", (r) => /googleapis|gstatic|cesium/.test(r.url()) && google.push(r.url()));
  await page.goto("/it/itinerari/il-re-nel-fiume/racconto");
  await expect(page.locator(".maplibregl-canvas").first()).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: "Vista 3D" }).click();
  const dialog = page.getByRole("dialog", { name: /Volo 3D/ });
  await expect(dialog.locator(".maplibregl-canvas")).toBeVisible({ timeout: 20_000 });
  await dialog.getByRole("button", { name: "Tappa successiva" }).click();
  await expect(dialog.getByText(/^1\. /)).toBeVisible();
  await expect(dialog.getByText(/Terrain Tiles/)).toBeAttached();
  expect(google).toEqual([]);
});

test("volo 3D Google (3D Maps): resta dietro il consenso e non chiama Google prima", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "una sola volta");
  test.skip((process.env.NEXT_PUBLIC_FLY3D_PROVIDER ?? "google3d") !== "google3d", "motore google3d non configurato");
  // il fixture registra il consenso "solo necessari": nessuna richiesta a Google (e nessun costo nei test)
  const google: string[] = [];
  page.on("request", (r) => /googleapis|gstatic/.test(r.url()) && google.push(r.url()));
  await page.goto("/it/itinerari/il-re-nel-fiume/racconto");
  await expect(page.locator(".maplibregl-canvas").first()).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: "Vista 3D" }).click();
  const dialog = page.getByRole("dialog", { name: /Volo 3D/ });
  await expect(dialog.getByRole("button", { name: "Acconsento e attivo" })).toBeVisible();
  expect(google).toEqual([]);
});
