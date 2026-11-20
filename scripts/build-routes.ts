/**
 * Calcola i percorsi pedonali reali tra le tappe di ogni itinerario usando OSRM
 * (profilo "foot", server pubblico di FOSSGIS) e li salva in content/seed/routes/*.json.
 * Il seed resta così offline e riproducibile. Rieseguire solo se cambiano le tappe:
 *   docker compose exec app pnpm routes [slug]
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { CONTENT_DIR, chapterPoint, loadContent } from "../src/server/db/content";

const OSRM = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";
const only = process.argv[2];

const content = await loadContent();
await mkdir(path.join(CONTENT_DIR, "routes"), { recursive: true });

for (const it of content.itineraries) {
  if (only && it.slug !== only) continue;
  const pts = it.chapters.map((ch) => chapterPoint(content, ch));
  const coords = pts.map(([lng, lat]) => `${lng.toFixed(6)},${lat.toFixed(6)}`).join(";");
  const res = await fetch(`${OSRM}/${coords}?overview=full&geometries=geojson`, {
    headers: { "User-Agent": "CosenzaAttrattivaDemo/0.1 (local tourism demo)" },
  });
  if (!res.ok) {
    console.warn(`✘ ${it.slug}: OSRM ${res.status}`);
    continue;
  }
  const json = (await res.json()) as { routes?: { geometry: { coordinates: [number, number][] }; distance: number }[] };
  const route = json.routes?.[0];
  if (!route) {
    console.warn(`✘ ${it.slug}: nessun percorso`);
    continue;
  }
  const coordinates = route.geometry.coordinates.map(([x, y]) => [+x.toFixed(6), +y.toFixed(6)]);
  await writeFile(
    path.join(CONTENT_DIR, "routes", `${it.slug}.json`),
    JSON.stringify({ source: "OSRM foot, © OpenStreetMap contributors", distanceM: Math.round(route.distance), coordinates }) + "\n",
  );
  console.log(`✔ ${it.slug}: ${(route.distance / 1000).toFixed(2)} km, ${coordinates.length} punti`);
  await new Promise((r) => setTimeout(r, 1100)); // rispetto del rate limit
}
