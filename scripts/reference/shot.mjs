// Screenshot di una sezione della home (per verifiche durante lo sviluppo).
// Uso: node scripts/reference/shot.mjs <selettore> [larghezze] [uscita]
import { chromium } from "@playwright/test";
const base = process.env.BASE_URL ?? "https://cosenzaattrattiva.test:8443";
const [sel = "main", w = "375,1440", out = "docs/reference/compare/tmp"] = process.argv.slice(2);
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const width of w.split(",").map(Number)) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 812 : 900 }, locale: "it-IT" });
  await ctx.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: false })));
  const page = await ctx.newPage();
  await page.goto(`${base}/it`, { waitUntil: "networkidle" });
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); window.scrollBy({ top: r.top - 80, behavior: "instant" }); }, sel);
  await page.waitForTimeout(900);
  const name = sel.replace(/[^a-z0-9]+/gi, "_");
  await page.screenshot({ path: `${out}/${name}-${width}.jpg`, type: "jpeg", quality: 70 });
  console.log(`✔ ${out}/${name}-${width}.jpg`, await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]));
  await ctx.close();
}
await browser.close();
