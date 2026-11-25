import { expect, test } from "./fixtures";

const isMobile = (name: string) => name === "mobile";

test("hero: selettore Antica / Contemporanea e claim del masterplan", async ({ page }) => {
  await page.goto("/it");
  await expect(page.getByRole("heading", { level: 1, name: "Cosenza, città da vivere." })).toBeAttached();
  const nav = page.getByRole("group", { name: /Scegli la città/ });
  await expect(nav.getByRole("button", { name: "Antica" })).toHaveAttribute("aria-pressed", "true");
  await nav.getByRole("button", { name: "Contemporanea" }).click();
  await expect(nav.getByRole("button", { name: "Contemporanea" })).toHaveAttribute("aria-pressed", "true");
});

test("menu: sottovoci dei pilastri (megamenu Scopri) verso le nuove pagine", async ({ page }, info) => {
  await page.goto("/it");
  if (isMobile(info.project.name)) {
    await page.getByRole("button", { name: "Apri menu" }).click();
    const nav = page.getByRole("navigation", { name: "Navigazione mobile" });
    await nav.getByRole("button", { name: "Cosenza Crea" }).click();
    await expect(nav.getByRole("link", { name: "Bottega Cosenza" })).toBeVisible();
    await nav.getByRole("button", { name: "Cosenza Vive" }).click();
    await nav.getByRole("link", { name: "Calendario della città" }).click();
    await expect(page).toHaveURL(/\/it\/eventi#calendario$/);
    return;
  }
  const scopri = page.getByRole("button", { name: "Scopri", exact: true });
  await scopri.click();
  const pane = page.getByRole("navigation", { name: "Navigazione principale" }).getByRole("tabpanel");
  await expect(pane.getByRole("link", { name: "Grandi eventi" })).toBeVisible();
  await pane.getByRole("link", { name: "Calendario della città" }).click();
  await expect(page).toHaveURL(/\/it\/eventi#calendario$/);
});

test("eventi: grandi eventi, filtri del calendario e pagina dell'evento", async ({ page }) => {
  await page.goto("/it/eventi");
  await expect(page.getByRole("heading", { level: 1, name: "Eventi" })).toBeVisible();
  const majors = page.locator("#grandi-eventi .ca-major-card");
  await expect(majors).toHaveCount(4);

  const calendar = page.locator("#calendario");
  const cards = calendar.locator(".ca-events-grid").first().locator("article");
  const total = await cards.count();
  await calendar.getByRole("button", { name: "Tradizioni" }).click();
  await expect.poll(() => cards.count()).toBeLessThan(total);
  await calendar.getByRole("button", { name: "Tutti" }).click();
  await calendar.getByRole("button", { name: "Solo grandi eventi" }).click();
  await expect(calendar.getByRole("button", { name: "Solo grandi eventi" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => cards.count()).toBe(4);

  await majors.getByRole("link", { name: /Madonna del Pilerio/ }).click();
  await expect(page).toHaveURL(/\/it\/eventi\/madonna-del-pilerio$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Madonna del Pilerio");
  await expect(page.getByRole("link", { name: "Duomo di Cosenza" })).toHaveAttribute("href", "/it/luoghi/duomo");
  await expect(page.getByRole("heading", { name: "Cosa vedere vicino" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Itinerari nei dintorni" })).toBeVisible();
});

test("Bottega Cosenza: mestieri come schede accessibili, raggiungibile dalla fascia in home", async ({ page }) => {
  await page.goto("/it");
  const link = page.locator(".ca-crea-hero").getByRole("link").first();
  await expect(link).toHaveAttribute("href", "/it/fatto-a-cosenza");
  // in fondo alla home: il clic durante lo scorrimento a volte va a vuoto, si riprova
  await expect(async () => {
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(/\/it\/fatto-a-cosenza$/, { timeout: 10_000 });
  }).toPass({ timeout: 40_000 });
  const tabs = page.getByRole("tablist", { name: "Scegli un mestiere" });
  await expect(tabs.getByRole("tab", { name: "Ceramica" })).toHaveAttribute("aria-selected", "true");
  await tabs.getByRole("tab", { name: "Ceramica" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Legno" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Intaglio");
});

test("Ritorno a Cosenza: pagina in italiano, senza rimando all'inglese (sito monolingua)", async ({ page }) => {
  await page.goto("/it/ritorno-a-cosenza");
  await expect(page.getByRole("heading", { level: 1, name: "Ritorno a Cosenza" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read in English" })).toHaveCount(0);
});

test("itinerario tematico: niente mappa né passeggiata, la passeggiata rimanda al racconto", async ({ page }) => {
  await page.goto("/it/itinerari/ritorno-a-cosenza");
  await expect(page.getByText("Tematico", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Inizia la passeggiata" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: /Mappa/ })).toHaveCount(0);
  await page.goto("/it/itinerari/ritorno-a-cosenza/passeggiata");
  await expect(page).toHaveURL(/\/racconto$/);
  await expect(page.locator(".maplibregl-canvas")).toHaveCount(0);
});

test("itinerario misto: tappe su mappa e letture, passeggiata disponibile", async ({ page }) => {
  await page.goto("/it/itinerari/le-mani-di-cosenza");
  await expect(page.getByText("Misto", { exact: true })).toBeVisible();
  await expect(page.getByText(/Capitolo 2 · Lettura/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Inizia la passeggiata" })).toBeVisible();
  await page.goto("/it/itinerari/le-mani-di-cosenza/racconto");
  await expect(page.locator(".maplibregl-canvas")).toBeVisible({ timeout: 20_000 });
});
