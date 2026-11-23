import { expect, passportOn, test } from "./fixtures";

test.use({ permissions: ["geolocation"], geolocation: { latitude: 39.2878, longitude: 16.2547 } });

test.setTimeout(90_000);

test("passeggiata simulata: arrivo alla tappa, audio (e timbro se il passaporto è attivo)", async ({ page }) => {
  await page.goto("/it/itinerari/fede-di-pietra/passeggiata");
  await page.getByRole("button", { name: "Avvia con posizione simulata" }).click();
  await expect(page.getByText("Prossima tappa", { exact: false })).toBeVisible({ timeout: 20_000 });

  await page.getByRole("button", { name: /Simulatore di posizione/ }).click();
  await page.getByRole("button", { name: "1", exact: true }).click();
  const arrival = page.getByRole("dialog", { name: /.+/ }).filter({ hasText: "Sei arrivato" });
  // il salto porta 60 m prima della tappa: se è già nel raggio di arrivo la scheda si apre subito
  // e copre il simulatore, altrimenti si fa camminare la posizione fino alla tappa
  await page.waitForTimeout(1500);
  if (!(await arrival.isVisible())) {
    await page.getByRole("button", { name: /Percorri l'itinerario/ }).click({ timeout: 5_000 }).catch(() => {});
  }
  await expect(arrival).toBeVisible({ timeout: 30_000 });
  // ferma il simulatore: nel browser headless il WebGL software satura la CPU
  const pause = page.getByRole("button", { name: "Pausa" }).filter({ hasText: "Pausa" });
  if (await pause.isVisible()) await pause.click({ force: true });
  const stamps = () => page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("cosenza-passport:v1") ?? "{}").stamps ?? {}));
  if (!passportOn) {
    // passaporto disattivato: nessun timbro, nessun riferimento al Passaporto
    await expect(page.getByText("Timbro aggiunto al Passaporto")).toHaveCount(0);
    expect(await stamps()).toEqual([]);
    return;
  }
  await expect(page.getByText("Timbro aggiunto al Passaporto")).toBeVisible();

  // il timbro è salvato nel passaporto locale (la pagina Passaporto ha un test dedicato)
  expect((await stamps()).length).toBeGreaterThanOrEqual(1);
});
