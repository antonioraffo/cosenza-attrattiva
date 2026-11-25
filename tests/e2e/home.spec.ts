import { expect, test } from "./fixtures";

const isMobile = (name: string) => name === "mobile";

test("home: sezioni nell'ordine, niente sezioni tolte, niente scroll orizzontale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/it$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  // hero → esplora a piedi → il tuo tempo / il tuo giro → eventi → fatto a Cosenza (la mission non c'è più)
  const order = await page.evaluate(() =>
    [".ca-hero-draw", "#esplora", "#il-tuo-tempo", "#eventi", ".ca-crea-hero"].map(
      (s) => document.querySelector(s)?.getBoundingClientRect().top ?? -1,
    ),
  );
  expect(order.every((top, i) => top >= 0 && (i === 0 || top > order[i - 1]!))).toBe(true);
  for (const name of ["Esplora a piedi", "Il tuo tempo", "Il tuo giro", "Fatto a Cosenza"])
    await expect(page.getByRole("heading", { level: 2, name })).toHaveCount(1);
  await expect(page.locator("[data-hero-panel], .ca-timebar, #itinerari, [data-explore-stage], #mission, .ca-pillar-block")).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("hero: disegno intero nella prima schermata, animazione automatica in loop", async ({ page }) => {
  test.setTimeout(90_000);
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
  // parte senza scroll e ricomincia dopo la pausa a disegno completo (tempi larghi: nel container
  // il thread principale a volte si ferma e il ciclo di 10 s si allunga)
  await expect.poll(() => hero.getAttribute("data-drawing-state"), { timeout: 30_000, intervals: [250] }).toBe("complete");
  await expect.poll(() => hero.getAttribute("data-drawing-state"), { timeout: 15_000, intervals: [250] }).toBe("drawing");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("hero: card del luogo e curiosità seguono il loop, non coprono il disegno, pausa", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/it");
  const hero = page.locator(".ca-hero-draw");
  const place = hero.locator(".ca-hero-card--place");
  const fact = hero.locator(".ca-hero-card--fact");
  await expect(place.getByRole("heading", { level: 2, name: "Duomo di Cosenza" })).toBeAttached();
  await expect(place.getByRole("link", { name: "Scopri di più" })).toHaveAttribute("href", "/it/luoghi/duomo");
  await expect(fact.getByRole("heading", { level: 3, name: /1222/ })).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => hero.getAttribute("data-cards"), { timeout: 30_000, intervals: [250] }).toBe("in");
  // il disegno (SVG in "meet" nel suo riquadro) non sta sotto le card
  const boxes = await page.evaluate(() => {
    const art = document.querySelector(".ca-hero-draw-art")!;
    const vb = art.querySelector("svg")!.viewBox.baseVal;
    const a = art.getBoundingClientRect();
    const s = Math.min(a.width / vb.width, a.height / vb.height);
    const d = { x: a.x + (a.width - vb.width * s) / 2, y: a.y + (a.height - vb.height * s) / 2, w: vb.width * s, h: vb.height * s };
    return { d, cards: [...document.querySelectorAll(".ca-hero-card")].map((c) => c.getBoundingClientRect().toJSON()) };
  });
  for (const c of boxes.cards)
    expect(c.right <= boxes.d.x + 1 || c.left >= boxes.d.x + boxes.d.w - 1 || c.bottom <= boxes.d.y + 1 || c.top >= boxes.d.y + boxes.d.h - 1).toBe(true);
  // pausa (WCAG 2.2.2): il disegno si ferma
  await hero.getByRole("button", { name: "Metti in pausa l'animazione" }).click();
  await expect(hero).toHaveAttribute("data-drawing-paused", "true");
  const progress = await hero.getAttribute("data-drawing-progress");
  const state = await hero.getAttribute("data-drawing-state");
  await page.waitForTimeout(1500);
  expect(await hero.getAttribute("data-drawing-progress")).toBe(progress);
  expect(await hero.getAttribute("data-drawing-state")).toBe(state);
});

test("hero: con movimento ridotto il disegno è completo e fermo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/it");
  const hero = page.locator(".ca-hero-draw");
  await expect(hero).toHaveAttribute("data-drawing-state", "static");
  await expect(hero).toHaveAttribute("data-drawing-progress", "1.000");
  await expect(hero).toHaveAttribute("data-cards", "in");
  await expect(hero.locator(".ca-hero-card--place")).toHaveCSS("opacity", "1");
});

test("menu principale: Scopri, Eventi, Pianifica (solo testo) e megamenu dei pilastri", async ({ page }, info) => {
  await page.goto("/it");
  if (isMobile(info.project.name)) {
    await expect(page.getByRole("navigation", { name: "Navigazione principale" })).toBeHidden();
    await page.getByRole("button", { name: "Apri menu" }).click();
    const nav = page.getByRole("navigation", { name: "Navigazione mobile" });
    await expect(nav.getByText("Scopri", { exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Eventi", exact: true })).toHaveAttribute("href", "/it/eventi");
    await expect(nav.getByRole("link", { name: "Pianifica", exact: true })).toHaveAttribute("href", "/it/il-tuo-tempo");
    // accordion senza hover: tocco su Connect → spiegazione e sottovoci
    const connect = nav.getByRole("button", { name: "Cosenza Connect" });
    await expect(connect).toHaveAttribute("aria-expanded", "false");
    await connect.click();
    await expect(connect).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "Esplora" })).toBeVisible();
    await nav.getByRole("link", { name: "Ritorno a Cosenza" }).click();
    await expect(page).toHaveURL(/\/it\/ritorno-a-cosenza$/);
    return;
  }
  const nav = page.getByRole("navigation", { name: "Navigazione principale" });
  const scopri = nav.getByRole("button", { name: "Scopri", exact: true });
  await expect(nav.getByRole("link", { name: "Eventi", exact: true })).toHaveAttribute("href", "/it/eventi");
  await expect(nav.getByRole("link", { name: "Pianifica", exact: true })).toHaveAttribute("href", "/it/il-tuo-tempo");
  await expect(nav.getByRole("link", { name: /^(Eventi|Pianifica)$/ }).locator("svg")).toHaveCount(0);

  // clic: si apre, Vive di default; il mouse su Connect cambia il riquadro
  await expect(scopri).toHaveAttribute("aria-expanded", "false");
  await scopri.click();
  await expect(scopri).toHaveAttribute("aria-expanded", "true");
  const tabs = nav.getByRole("tablist");
  await expect(tabs.getByRole("tab", { name: "Cosenza Vive" })).toHaveAttribute("aria-selected", "true");
  await tabs.getByRole("tab", { name: "Cosenza Connect" }).hover();
  const pane = nav.getByRole("tabpanel");
  await expect(pane.getByRole("link", { name: "Esplora" })).toBeVisible();
  // clic fuori: si chiude
  await page.mouse.click(5, 600);
  await expect(scopri).toHaveAttribute("aria-expanded", "false");

  // tastiera: freccia giù apre e porta il focus sui pilastri, frecce per cambiare, Esc chiude
  await scopri.focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.getByRole("tab", { name: "Cosenza Vive" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect(tabs.getByRole("tab", { name: "Cosenza Crea" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Tab");
  await expect(pane.getByRole("link", { name: "Fatto a Cosenza" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(scopri).toHaveAttribute("aria-expanded", "false");
  await expect(scopri).toBeFocused();

  // il link del riquadro porta alla pagina del pilastro
  await scopri.click();
  await tabs.getByRole("tab", { name: "Cosenza Connect" }).click();
  await pane.getByRole("link", { name: "Vai a Cosenza Connect" }).click();
  await expect(page).toHaveURL(/\/it\/itinerari$/);
});

test("header: solo il marchio, voci Scopri · Eventi · Pianifica centrate a 16 px", async ({ page }, info) => {
  await page.goto("/it");
  const brand = page.locator(".site-brand img");
  await expect(brand).toHaveAttribute("src", "/brand/mark.svg");
  if (isMobile(info.project.name)) return;
  const nav = page.getByRole("navigation", { name: "Navigazione principale" });
  const header = (await page.locator(".site-header-inner").boundingBox())!;
  const box = (await nav.boundingBox())!;
  // centro delle voci entro 2 px dal centro dell'header
  expect(Math.abs(box.x + box.width / 2 - (header.x + header.width / 2))).toBeLessThanOrEqual(2);
  for (const name of ["Eventi", "Pianifica"])
    await expect(nav.getByRole("link", { name, exact: true })).toHaveCSS("font-size", "16px");
  await expect(nav.getByRole("button", { name: "Scopri", exact: true })).toHaveCSS("font-size", "16px");
});

test("esplora a piedi: mini card con la riga di sintesi, senza pilastro né descrizione", async ({ page }) => {
  await page.goto("/it");
  const cards = page.locator("#esplora .ca-place-card");
  await expect(cards).toHaveCount(35);
  await expect(page.locator("#esplora .ca-pillar-tag")).toHaveCount(0);
  const duomo = page.locator("#place-duomo");
  await expect(duomo.locator(".ca-place-summary")).toHaveText("Cattedrale consacrata nel 1222 alla presenza di Federico II, testimone UNESCO di pace");
  const texts = await cards.locator(".ca-place-summary").allTextContents();
  expect(texts.every((t) => t.length > 0 && t.length <= 90)).toBe(true);
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
  // grandi eventi senza foto
  await expect(page.locator("#eventi .ca-major-card")).not.toHaveCount(0);
  await expect(page.locator("#eventi .ca-major-card img")).toHaveCount(0);
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
