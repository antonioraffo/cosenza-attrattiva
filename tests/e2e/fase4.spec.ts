import { expect, passportOn, test } from "./fixtures";

/* Fase 4 della sintesi: mappa del giro, percorso pedonale reale per «Il mio itinerario». */

test("il tuo tempo: mappa del giro con gli itinerari numerati", async ({ page }) => {
  await page.goto("/it/il-tuo-tempo?t=1g");
  const region = page.getByRole("region", { name: "Mappa del giro" });
  // la mappa si inizializza quando entra nello schermo
  await region.scrollIntoViewIfNeeded();
  await expect(region).toBeVisible();
  await expect(page.locator(".ca-time-map canvas")).toBeVisible({ timeout: 20_000 });
  const badges = await page.locator(".ca-tl-n").allTextContents();
  expect(badges).toEqual(badges.map((_, i) => String(i + 1)));
});

test("percorso pedonale tra le tappe: API e pagina del mio itinerario", async ({ page, request }) => {
  test.skip(passportOn, "«Il mio itinerario» c'è solo con il passaporto spento");
  const res = await request.get("/api/walking-route?p=duomo,castello-svevo");
  expect(res.ok()).toBe(true);
  const route = (await res.json()) as { coordinates: [number, number][]; distanceM: number; source: string };
  expect(["osrm", "straight"]).toContain(route.source);
  expect(route.distanceM).toBeGreaterThan(300);
  // con il servizio raggiungibile il percorso segue le strade (più punti delle due tappe)
  if (route.source === "osrm") expect(route.coordinates.length).toBeGreaterThan(2);

  await page.goto("/it/mio-itinerario?p=duomo,castello-svevo");
  await expect(page.getByText(/min a piedi tra le tappe/)).toBeVisible();
  const walk = await page.goto("/it/mio-itinerario/passeggiata?p=duomo,castello-svevo");
  expect(walk?.status()).toBe(200);
});
