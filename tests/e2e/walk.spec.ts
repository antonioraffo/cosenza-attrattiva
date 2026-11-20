import { expect, test } from "@playwright/test";

test.use({ permissions: ["geolocation"], geolocation: { latitude: 39.2878, longitude: 16.2547 } });

test("passeggiata simulata: arrivo alla tappa, audio e timbro nel passaporto", async ({ page }) => {
  await page.goto("/it/itinerari/fede-di-pietra/passeggiata");
  await page.getByRole("button", { name: "Avvia con posizione simulata" }).click();
  await expect(page.locator(".maplibregl-canvas")).toBeVisible({ timeout: 20_000 });

  await page.getByRole("button", { name: /Simulatore di posizione/ }).click();
  await page.getByRole("button", { name: "1", exact: true }).click();
  await page.getByRole("button", { name: /Percorri l'itinerario/ }).click();

  const arrival = page.getByRole("dialog", { name: /.+/ }).filter({ hasText: "Sei arrivato" });
  await expect(arrival).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Timbro aggiunto al Passaporto")).toBeVisible();

  await page.goto("/it/passaporto");
  await expect(page.getByRole("heading", { name: /\d+ timbr/ })).toBeVisible();
});
