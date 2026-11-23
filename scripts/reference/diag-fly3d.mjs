// Diagnostica del volo 3D: apre il racconto, avvia "Vista 3D" con consenso Google e registra errori.
import { chromium } from "@playwright/test";
const base = process.env.BASE_URL ?? "https://cosenzaattrattiva.test:8443";
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: "it-IT" });
await ctx.addInitScript(() => localStorage.setItem("cosenza-consent:v1", JSON.stringify({ decided: true, google: true })));
const page = await ctx.newPage();
const key = /key=[^&]+/g;
page.on("console", (m) => ["error", "warning"].includes(m.type()) && console.log(`[console.${m.type()}]`, m.text().replace(key, "key=***").slice(0, 400)));
page.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 400)));
page.on("requestfailed", (r) => console.log("[requestfailed]", r.url().replace(key, "key=***").slice(0, 160), r.failure()?.errorText));
page.on("response", async (r) => {
  if (r.status() >= 400 && /google|gstatic|jsdelivr|cesium/.test(r.url())) {
    let body = ""; try { body = (await r.text()).slice(0, 300); } catch {}
    console.log("[http]", r.status(), r.url().replace(key, "key=***").slice(0, 160), body.replace(/\s+/g, " "));
  }
});
await page.goto(`${base}/it/itinerari/il-re-nel-fiume/racconto`, { waitUntil: "load" });
await page.waitForTimeout(5000);
await page.getByRole("button", { name: /Vista 3D/ }).first().click();
const dialog = page.getByRole("dialog");
const next = dialog.getByRole("button", { name: "Tappa successiva" });
await next.waitFor({ timeout: 25000 }).catch(() => {});
await page.waitForTimeout(4000);
await page.screenshot({ path: "docs/reference/compare/tmp/fly3d-0.jpg", type: "jpeg", quality: 60 });
for (let i = 1; i <= 3 && (await next.isVisible()); i++) {
  await next.click();
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `docs/reference/compare/tmp/fly3d-${i}.jpg`, type: "jpeg", quality: 60 });
}
console.log("[dialog text]", (await dialog.innerText().catch(() => "")).replace(/\s+/g, " ").slice(0, 200));
await browser.close();
