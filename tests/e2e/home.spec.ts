import { expect, test } from "./fixtures";

const isMobile = (name: string) => name === "mobile";

test("home: struttura delle sezioni, nessuna sezione «Crea il tuo itinerario», niente scroll orizzontale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/it$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  for (const id of ["mission", "esplora", "itinerari", "eventi"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator("[data-hero-panel]")).toHaveCount(3);
  // il disegno al tratto dell'hero si carica e si analizza correttamente (SVG valido)
  await expect(page.locator("[data-silhouette-art] svg [data-silhouette-stroke]")).not.toHaveCount(0);
  await expect(page.getByText(/Crea il tuo itinerario/i)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Tre modi di vivere un itinerario" })).toBeAttached();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("menu principale: solo Vive, Connect, Crea con icona e etichetta", async ({ page }, info) => {
  await page.goto("/it");
  let nav = page.getByRole("navigation", { name: "Navigazione principale" });
  if (isMobile(info.project.name)) {
    await expect(nav).toBeHidden();
    await page.getByRole("button", { name: "Apri menu" }).click();
    nav = page.getByRole("navigation", { name: "Navigazione mobile" });
    await expect(nav).toBeVisible();
  }
  const links = nav.getByRole("link").filter({ hasText: /^Cosenza (Vive|Connect|Crea)$/ });
  await expect(links).toHaveText(["Cosenza Vive", "Cosenza Connect", "Cosenza Crea"]);
  for (const link of await links.all()) await expect(link.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await expect(links.nth(1)).toHaveAttribute("href", "/it#connect");

  // Connect porta all'area turismo della mission, che dà accesso agli itinerari
  await links.nth(1).click();
  await expect(page).toHaveURL(/#connect$/);
  await expect(page.locator("#connect")).toBeInViewport();
  await page.locator("#connect").getByRole("link", { name: "Scopri gli itinerari" }).click();
  await expect(page).toHaveURL(/#itinerari$/);
  // gli itinerari stanno sotto il foglio "Tre modi": l'ancora arriva quando il foglio è uscito
  await expect(page.locator("#itinerari").getByRole("button", { name: "Tutti" })).toBeInViewport();

  if (isMobile(info.project.name)) {
    await page.getByRole("button", { name: "Apri menu" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Navigazione mobile" })).toBeHidden();
  }
});

test("carosello mission: frecce, tastiera, swipe e indicatori", async ({ page }, info) => {
  await page.goto("/it");
  const carousel = page.getByRole("region", { name: "Le tre aree di Cosenza attrattiva" });
  await carousel.scrollIntoViewIfNeeded();
  await expect(carousel.locator('[aria-roledescription="slide"]')).toHaveCount(3);
  const dot = (n: number) => carousel.getByRole("button", { name: `Vai a Cosenza ${["Vive", "Connect", "Crea"][n]}` });
  await expect(dot(0)).toHaveAttribute("aria-current", "true");

  if (!isMobile(info.project.name)) {
    const next = carousel.getByRole("button", { name: "Area successiva" });
    await expect(carousel.getByRole("button", { name: "Area precedente" })).toBeDisabled();
    await next.click();
    await expect(dot(1)).toHaveAttribute("aria-current", "true");
  } else {
    // swipe: lo scroll orizzontale della traccia con scroll-snap
    const track = carousel.locator(".ca-carousel-track");
    await track.evaluate((el: HTMLElement) => {
      const second = el.children[1] as HTMLElement;
      el.scrollTo({ left: second.offsetLeft - el.offsetLeft - 20, behavior: "instant" });
    });
    await expect(dot(1)).toHaveAttribute("aria-current", "true");
  }

  const track = carousel.locator(".ca-carousel-track");
  await track.focus();
  await page.keyboard.press("ArrowRight");
  await expect(dot(2)).toHaveAttribute("aria-current", "true");
  await page.keyboard.press("Home");
  await expect(dot(0)).toHaveAttribute("aria-current", "true");
  await dot(2).click();
  await expect(dot(2)).toHaveAttribute("aria-current", "true");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("pannelli MAB, Duomo e San Domenico collegati alle schede luogo", async ({ page }) => {
  await page.goto("/it");
  const panels = page.locator("[data-hero-panel]");
  const hrefs = await panels.locator(".cs-scroll-action").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs).toEqual(["/it/luoghi/mab-ettore-e-andromaca", "/it/luoghi/duomo", "/it/luoghi/san-domenico"]);
  await expect(panels.nth(1).getByRole("heading", { level: 2, name: "Duomo di Cosenza" })).toHaveCount(1);
  await expect(panels.nth(1).locator("img")).toHaveCount(1);

  await page.getByRole("button", { name: "Mostra Chiesa di San Domenico" }).click();
  const action = panels.nth(2).getByRole("link", { name: "Scopri di più" });
  await expect(action).toBeInViewport();
  await action.click();
  await expect(page).toHaveURL(/\/it\/luoghi\/san-domenico$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("San Domenico");
});

test("itinerari: carosello alimentato dal database, con filtro per tema", async ({ page, request }) => {
  await page.goto("/it");
  const section = page.locator("#itinerari");
  const cards = section.locator("[data-itinerary-card]");
  await expect(cards).toHaveCount(7);
  const hrefs = await cards.getByRole("link").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs).toContain("/it/itinerari/il-re-nel-fiume");
  // ogni card porta a un itinerario esistente
  for (const href of hrefs) expect((await request.get(href!)).status()).toBe(200);
  await expect(cards.first()).toContainText(/\d tappe/);

  await page.goto("/it#itinerari");
  await expect(section.getByRole("button", { name: "Tutti" })).toBeInViewport();
  await section.getByRole("button", { name: "Fede" }).click();
  await expect(section.getByRole("button", { name: "Fede" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => cards.count()).toBeLessThan(7);
});

test("eventi: quattro card con dettagli apribili", async ({ page }) => {
  await page.goto("/it");
  const cards = page.locator("#eventi article");
  await expect(cards).toHaveCount(4);
  const toggle = cards.first().getByRole("button", { name: /Scopri di più/ });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  await expect(cards.first().getByRole("button", { name: /Chiudi/ })).toHaveAttribute("aria-expanded", "true");
  await expect(cards.first().getByRole("link", { name: /Sito dell'evento/ })).toBeVisible();
});

test("cambio lingua IT → EN", async ({ page }, info) => {
  await page.goto("/it");
  if (isMobile(info.project.name)) await page.getByRole("button", { name: "Apri menu" }).click();
  await page.getByRole("button", { name: /Lingua|Language/ }).locator("visible=true").click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "It welcomes, creates, connects" })).toBeAttached();
});

test("dalla card di un itinerario la nuova pagina si apre in cima", async ({ page }) => {
  await page.goto("/it#itinerari");
  const card = page.locator("[data-itinerary-card] a").first();
  await expect(card).toBeInViewport();
  await card.click();
  await expect(page).toHaveURL(/\/it\/itinerari\/[^/#]+$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});
