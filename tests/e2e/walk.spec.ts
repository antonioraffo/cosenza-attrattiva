import { expect, test } from "./fixtures";

test.use({ permissions: ["geolocation"], geolocation: { latitude: 39.2878, longitude: 16.2547 } });

test.setTimeout(90_000);

test("passeggiata simulata: arrivo alla tappa, audio e timbro nel passaporto", async ({ page }) => {
  await page.goto("/it/itinerari/fede-di-pietra/passeggiata");
  await page.getByRole("button", { name: "Avvia con posizione simulata" }).click();
  await expect(page.getByText("Prossima tappa", { exact: false })).toBeVisible({ timeout: 20_000 });

  await page.getByRole("button", { name: /Simulatore di posizione/ }).click();
  await page.getByRole("button", { name: "1", exact: true }).click();
  await page.getByRole("button", { name: /Percorri l'itinerario/ }).click();

  const arrival = page.getByRole("dialog", { name: /.+/ }).filter({ hasText: "Sei arrivato" });
  await expect(arrival).toBeVisible({ timeout: 30_000 });
  // ferma il simulatore: nel browser headless il WebGL software satura la CPU
  await page.getByRole("button", { name: "Pausa" }).filter({ hasText: "Pausa" }).click();
  await expect(page.getByText("Timbro aggiunto al Passaporto")).toBeVisible();

  // il timbro è salvato nel passaporto locale (la pagina Passaporto ha un test dedicato)
  const stamps = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("cosenza-passport:v1") ?? "{}").stamps ?? {}));
  expect(stamps.length).toBeGreaterThanOrEqual(1);
});
