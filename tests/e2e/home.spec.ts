import { expect, test } from "./fixtures";

const isMobile = (name: string) => name === "mobile";

test("home: sezioni nell'ordine, niente sezioni tolte, niente scroll orizzontale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/it$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  // hero → mission → eventi → esplora a piedi → il tuo tempo / il tuo giro → fatto a Cosenza
  const order = await page.evaluate(() =>
    [".ca-hero-draw", "#mission", "#eventi", "#esplora", "#il-tuo-tempo", ".ca-crea-hero"].map(
      (s) => document.querySelector(s)?.getBoundingClientRect().top ?? -1,
    ),
  );
  expect(order.every((top, i) => top >= 0 && (i === 0 || top > order[i - 1]!))).toBe(true);
  for (const name of ["Esplora a piedi", "Il tuo tempo", "Il tuo giro", "Fatto a Cosenza"])
    await expect(page.getByRole("heading", { level: 2, name })).toHaveCount(1);
  await expect(page.locator("[data-hero-panel], .ca-timebar, #itinerari, [data-explore-stage]")).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("hero: disegno intero nella prima schermata, animazione automatica in loop", async ({ page }) => {
  await page.goto("/it");
  const hero = page.locator(".ca-hero-draw");
  await expect(hero).toHaveAttribute("data-drawing-ready", "true");
  await expect(hero.locator("[data-silhouette-stroke]")).not.toHaveCount(0);
  const viewport = page.viewportSize()!;
  const box = (await hero.boundingBox())!;
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  // l'SVG intero (preserveAspectRatio meet) sta nel riquadro
  const art = (await hero.locator(".ca-hero-draw-art svg").boundingBox())!;
  expect(art.y + art.height).toBeLessThanOrEqual(viewport.height + 1);
  // parte senza scroll e ricomincia dopo la pausa a disegno completo
  await expect.poll(() => hero.getAttribute("data-drawing-state"), { timeout: 12_000 }).toBe("complete");
  await expect.poll(() => hero.getAttribute("data-drawing-state"), { timeout: 6_000 }).toBe("drawing");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("hero: con movimento ridotto il disegno è completo e fermo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/it");
  const hero = page.locator(".ca-hero-draw");
  await expect(hero).toHaveAttribute("data-drawing-state", "static");
  await expect(hero).toHaveAttribute("data-drawing-progress", "1.000");
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
  await expect(page).toHaveURL(/\/it\/itinerari$/);
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

test("itinerari: pagina con carosello alimentato dal database, filtro per tema", async ({ page, request }) => {
  await page.goto("/it/itinerari");
  await expect(page.getByRole("heading", { level: 1, name: /itinerari/i })).toBeVisible();
  const section = page.locator("#itinerari");
  const cards = section.locator("[data-itinerary-card]");
  await expect(cards).toHaveCount(9);
  const hrefs = await cards.getByRole("link").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs).toContain("/it/itinerari/il-re-nel-fiume");
  // ogni card porta a un itinerario esistente
  for (const href of hrefs) expect((await request.get(href!)).status()).toBe(200);
  await expect(cards.first()).toContainText(/\d tappe/);

  await section.getByRole("button", { name: "Fede" }).click();
  await expect(section.getByRole("button", { name: "Fede" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => cards.count()).toBeLessThan(9);
});

test("eventi: quattro card con dettagli apribili", async ({ page }) => {
  await page.goto("/it");
  const cards = page.locator("#eventi .ca-events-grid article");
  await expect(cards).toHaveCount(4);
  const toggle = cards.first().getByRole("button", { name: /Scopri di più/ });
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  await expect(cards.first().getByRole("button", { name: /Chiudi/ })).toHaveAttribute("aria-expanded", "true");
  await expect(cards.first().getByRole("link", { name: /Dettagli/ })).toBeVisible();
});

test("sito monolingua: niente selettore lingua, /en non esiste", async ({ page, request }, info) => {
  await page.goto("/it");
  if (isMobile(info.project.name)) await page.getByRole("button", { name: "Apri menu" }).click();
  await expect(page.getByRole("button", { name: /Lingua|Language/ })).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  expect((await request.get("/en", { maxRedirects: 0 })).status()).not.toBe(200);
});

test("dalla card di un itinerario la nuova pagina si apre in cima", async ({ page }) => {
  await page.goto("/it/itinerari");
  const card = page.locator("[data-itinerary-card] a").first();
  await expect(card).toBeInViewport();
  await card.click();
  await expect(page).toHaveURL(/\/it\/itinerari\/[^/#]+$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});
