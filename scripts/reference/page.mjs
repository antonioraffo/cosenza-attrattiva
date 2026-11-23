// Screenshot a pagina intera di un percorso (verifiche durante lo sviluppo).
// Uso: node scripts/reference/page.mjs <percorso> [larghezze] [uscita]
import { chromium } from "@playwright/test";
const base = process.env.BASE_URL ?? "https://cosenzaattrattiva.test:8443";
const [path = "/it", w = "375,1440", out = "docs/reference/compare/tmp"] = process.argv.slice(2);
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const width of w.split(",").map(Number)) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 812 : 900 }, locale: "it-IT" });
  await ctx.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: false })));
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  const name = path.replace(/[^a-z0-9]+/gi, "_");
  await page.screenshot({ path: `${out}/page${name}-${width}.jpg`, type: "jpeg", quality: 65, fullPage: true });
  console.log(`✔ ${out}/page${name}-${width}.jpg`);
  await ctx.close();
}
await browser.close();
