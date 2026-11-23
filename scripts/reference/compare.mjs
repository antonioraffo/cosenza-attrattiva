// Cattura la home di Cosenza attrattiva alle stesse larghezze e posizioni di scroll del riferimento
// vivicosenza (scripts/reference/vivicosenza.mjs), per il confronto visivo in docs/reference/compare/.
// Uso: docker compose --profile tests run --rm e2e node scripts/reference/compare.mjs [larghezze] [--frames-only]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "https://cosenzaattrattiva.test:8443";
const out = "docs/reference/compare/cosenza";
const widths = (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "375,768,1440").split(",").map(Number);
const framesOnly = process.argv.includes("--frames-only");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, deviceScaleFactor: 1, locale: "it-IT" });
  await ctx.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: false })));
  const page = await ctx.newPage();
  await page.goto(`${base}/it`, { waitUntil: "networkidle" });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  const step = Math.round(vh * 0.6);
  await mkdir(`${out}/frames-${width}`, { recursive: true });
  for (let y = 0, n = 0; y < h; y += step, n++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${out}/frames-${width}/${String(n).padStart(3, "0")}-y${y}.jpg`, type: "jpeg", quality: 60 });
  }
  if (!framesOnly) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload({ waitUntil: "networkidle" });
    for (let y = 0; y < h * 1.2; y += 400) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/home-${width}.jpg`, type: "jpeg", quality: 70, fullPage: true });
  }
  console.log(`✔ ${width}px (${h}px)`);
  await ctx.close();
}
await browser.close();
