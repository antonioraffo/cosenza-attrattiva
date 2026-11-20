// Screenshot delle pagine principali (mobile 375px e desktop) in docs/screenshots.
// Uso: docker compose --profile tests run --rm e2e node scripts/screenshots.mjs [filtro]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "https://cosenzaattrattiva.test:8443";
const only = process.argv[2];
const pages = [
  ["home", "/it"],
  ["itinerario", "/it/itinerari/il-re-nel-fiume"],
  ["racconto", "/it/itinerari/il-re-nel-fiume/racconto", async (p) => { await p.waitForTimeout(2500); await p.mouse.wheel(0, 1400); await p.waitForTimeout(3500); }],
  ["luogo", "/it/luoghi/castello-svevo"],
  ["passeggiata", "/it/itinerari/fede-di-pietra/passeggiata"],
  ["passaporto", "/it/passaporto"],
];
const out = "docs/screenshots";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const [vw, size] of [["mobile", { width: 375, height: 812 }], ["desktop", { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: vw === "mobile" ? 2 : 1, locale: "it-IT" });
  // banner di consenso già gestito, per screenshot puliti
  await ctx.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: false })));
  for (const [name, path, action] of pages) {
    if (only && !name.includes(only)) continue;
    const p = await ctx.newPage();
    await p.goto(base + path, { waitUntil: "load" });
    if (action) await action(p);
    else await p.waitForTimeout(3000);
    await p.screenshot({ path: `${out}/${name}-${vw}.png`, fullPage: false });
    console.log(`✔ ${name}-${vw}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
