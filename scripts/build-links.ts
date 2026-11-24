/**
 * Calcola i trasferimenti a piedi tra gli itinerari (dall'ultima tappa geolocalizzata di uno alla
 * prima del successivo) con il servizio "table" di OSRM (profilo "foot", server pubblico di FOSSGIS)
 * e li salva in content/seed/routes/_links.json. Servono al giro di «Il tuo tempo».
 * Rieseguire solo se cambiano le tappe di inizio o fine:
 *   docker compose exec app pnpm routes:links
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { setDefaultResultOrder } from "node:dns";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { CONTENT_DIR, chapterPoint, loadContent } from "../src/server/db/content";

// nel container l'IPv6 non è instradato: si preferisce l'IPv4
setDefaultResultOrder("ipv4first");
setDefaultAutoSelectFamilyAttemptTimeout(3000);

const OSRM = "https://routing.openstreetmap.de/routed-foot/table/v1/foot";

const content = await loadContent();
await mkdir(path.join(CONTENT_DIR, "routes"), { recursive: true });

// itinerari percorribili: almeno due tappe geolocalizzate
const ends = content.itineraries
  .map((it) => {
    const pts = it.chapters.map((ch) => chapterPoint(content, ch)).filter((p): p is [number, number] => p !== null);
    return pts.length >= 2 ? { slug: it.slug, start: pts[0]!, end: pts.at(-1)! } : null;
  })
  .filter((x) => x !== null);

const n = ends.length;
const coords = [...ends.map((e) => e.end), ...ends.map((e) => e.start)].map(([lng, lat]) => `${lng.toFixed(6)},${lat.toFixed(6)}`).join(";");
const sources = ends.map((_, i) => i).join(";");
const destinations = ends.map((_, i) => n + i).join(";");
const res = await fetch(`${OSRM}/${coords}?annotations=distance&sources=${sources}&destinations=${destinations}`, {
  headers: { "User-Agent": "CosenzaAttrattivaDemo/0.1 (local tourism demo)" },
});
if (!res.ok) throw new Error(`OSRM ${res.status}`);
const json = (await res.json()) as { distances?: (number | null)[][] };
if (!json.distances) throw new Error("OSRM: nessuna matrice di distanze");

const links: { from: string; to: string; distanceM: number }[] = [];
ends.forEach((a, i) =>
  ends.forEach((b, j) => {
    const d = json.distances![i]![j];
    if (i !== j && d !== null && d !== undefined) links.push({ from: a.slug, to: b.slug, distanceM: Math.round(d) });
  }),
);
await writeFile(
  path.join(CONTENT_DIR, "routes", "_links.json"),
  JSON.stringify({ source: "OSRM foot (table), © OpenStreetMap contributors", links }, null, 1) + "\n",
);
console.log(`✔ ${links.length} trasferimenti tra ${n} itinerari`);
