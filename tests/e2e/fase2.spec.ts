import { expect, passportOn, test } from "./fixtures";

/* Fase 2 della sintesi: Esplora, "Il mio itinerario" (cuore, pannello, condivisione, passeggiata), passaporto spento. */

test.skip(passportOn, "fase 2: verifiche con il passaporto disattivato");

const isMobile = (name: string) => name === "mobile";

test("esplora: filtri, tempi a piedi e cuore che salva la tappa", async ({ page }) => {
  await page.goto("/it/esplora");
  await expect(page.getByRole("heading", { level: 1, name: "Esplora" })).toBeVisible();
  const cards = page.locator(".ca-xp-list > li");
  const all = await cards.count();
  expect(all).toBeGreaterThan(20);
  await expect(cards.first()).toContainText(/\d+ min a piedi/);

  await page.getByRole("button", { name: "Gusto" }).click();
  await expect(page.getByRole("button", { name: "Gusto" })).toHaveAttribute("aria-pressed", "true");
  await expect(cards).not.toHaveCount(all);
  await page.getByRole("button", { name: "Tutti" }).click();
  await expect(cards).toHaveCount(all);

  const heart = page.getByRole("button", { name: /^Salva nel mio itinerario: Duomo/ });
  await heart.click();
  await expect(heart).toHaveAttribute("aria-pressed", "true");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("cosenza-my-itinerary:v1") ?? "{}").places);
  expect(saved).toEqual(["duomo"]);
});

test("scheda luogo: salva nel mio itinerario, nessun check-in", async ({ page }) => {
  await page.goto("/it/luoghi/castello-svevo");
  const save = page.locator(".ca-save-pill");
  await expect(save).toHaveText("Salva nel mio itinerario");
  await save.click();
  await expect(save).toHaveText("Nel mio itinerario");
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Fai check-in" })).toHaveCount(0);
});

test("pannello Il mio itinerario: ordine, rimozione e link WhatsApp", async ({ page }, info) => {
  await page.addInitScript(() =>
    localStorage.setItem("cosenza-my-itinerary:v1", JSON.stringify({ version: 1, places: ["duomo", "castello-svevo", "san-domenico"] })),
  );
  await page.goto("/it/esplora");
  if (isMobile(info.project.name)) await page.getByRole("button", { name: "Apri menu" }).click();
  await page.getByRole("button", { name: /Il mio itinerario/ }).filter({ visible: true }).first().click();
  const drawer = page.getByRole("dialog", { name: "Il mio itinerario" });
  await expect(drawer.getByRole("listitem")).toHaveCount(3);

  await drawer.getByRole("button", { name: /^Sposta dopo: Duomo/ }).click();
  await expect(drawer.getByRole("listitem").first()).toContainText("Castello");
  await drawer.getByRole("button", { name: /^Rimuovi: Chiesa di San Domenico/ }).click();
  await expect(drawer.getByRole("listitem")).toHaveCount(2);

  const href = await drawer.getByRole("link", { name: "Condividi su WhatsApp" }).getAttribute("href");
  const text = decodeURIComponent(href!.replace("https://wa.me/?text=", ""));
  expect(text).toContain("/it/mio-itinerario?p=castello-svevo,duomo");

  await drawer.getByRole("button", { name: "Svuota l'itinerario" }).click();
  await expect(drawer.getByText(/Tocca il cuore/)).toBeVisible();
});

test("itinerario condiviso: tappe dal link, salvataggio e passeggiata", async ({ page }) => {
  await page.goto("/it/mio-itinerario?p=duomo,inesistente,castello-svevo");
  await expect(page.getByRole("heading", { level: 1, name: "Itinerario condiviso" })).toBeVisible();
  await expect(page.locator(".ca-xp-list > li")).toHaveCount(2);
  await page.getByRole("button", { name: "Salva nel mio itinerario" }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("cosenza-my-itinerary:v1") ?? "{}").places);
  expect(saved).toEqual(["duomo", "castello-svevo"]);

  await page.getByRole("link", { name: "Inizia la passeggiata" }).click();
  await expect(page).toHaveURL(/\/it\/mio-itinerario\/passeggiata\?p=duomo,castello-svevo$/);
  await expect(page.getByRole("button", { name: "Avvia con posizione simulata" })).toBeVisible({ timeout: 20_000 });
});

test("passeggiata personale con una sola tappa torna alla pagina dell'itinerario", async ({ page }) => {
  await page.goto("/it/mio-itinerario/passeggiata?p=duomo");
  await expect(page).toHaveURL(/\/it\/mio-itinerario\?p=duomo$/);
  await expect(page.getByText("Servono almeno due tappe per la passeggiata.")).toBeVisible();
});

test("passaporto disattivato: pagina 404 e nessun link", async ({ page }) => {
  const res = await page.goto("/it/passaporto");
  expect(res?.status()).toBe(404);
  await page.goto("/it");
  await expect(page.locator('a[href="/it/passaporto"]')).toHaveCount(0);
});
