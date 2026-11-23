import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { passportOn } from "./fixtures";

const extra = passportOn ? ["/it/passaporto"] : ["/it/esplora", "/it/mio-itinerario?p=duomo,castello-svevo"];
for (const path of ["/it", "/it/itinerari/atene-della-calabria", "/it/luoghi/castello-svevo", ...extra]) {
  test(`accessibilità WCAG 2.1 AA: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // attende la fine delle animazioni di ingresso (banner, reveal): axe misura i colori finali
    await page.waitForTimeout(1000);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude(".maplibregl-canvas")
      .analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}
