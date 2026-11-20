/**
 * Caricamento e validazione dei contenuti in content/seed/**.
 * Usato dal seed e dallo script dei percorsi (scripts/build-routes.ts).
 */
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type {
  LngLat,
  SeedItinerary,
  SeedMedia,
  SeedNeighborhood,
  SeedPlace,
} from "../../../content/seed/types";

export const CONTENT_DIR = path.resolve(process.cwd(), "content/seed");

async function importAll<T>(dir: string, exportName: string): Promise<T[]> {
  const full = path.join(CONTENT_DIR, dir);
  if (!existsSync(full)) return [];
  const files = (await readdir(full)).filter((f) => f.endsWith(".ts")).sort();
  const out: T[] = [];
  for (const f of files) {
    const mod = (await import(pathToFileURL(path.join(full, f)).href)) as Record<string, unknown>;
    const value = mod[exportName];
    if (value === undefined) throw new Error(`${dir}/${f}: export "${exportName}" mancante`);
    out.push(...(Array.isArray(value) ? (value as T[]) : [value as T]));
  }
  return out;
}

export interface Content {
  places: SeedPlace[];
  media: SeedMedia[];
  itineraries: SeedItinerary[];
  neighborhoods: SeedNeighborhood[];
}

export async function loadContent(): Promise<Content> {
  const [places, media, itineraries] = await Promise.all([
    importAll<SeedPlace>("places", "places"),
    importAll<SeedMedia>("media", "media"),
    importAll<SeedItinerary>("itineraries", "itinerary"),
  ]);
  const nbFile = path.join(CONTENT_DIR, "neighborhoods.ts");
  const neighborhoods = existsSync(nbFile)
    ? ((await import(pathToFileURL(nbFile).href)) as { neighborhoods: SeedNeighborhood[] }).neighborhoods
    : [];
  return { places, media, itineraries, neighborhoods };
}

/** Controlli di coerenza: errori bloccanti e avvisi. */
export function validateContent(c: Content): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const dup = (arr: string[], what: string) => {
    const seen = new Set<string>();
    for (const s of arr) {
      if (seen.has(s)) errors.push(`${what} duplicato: ${s}`);
      seen.add(s);
    }
  };
  dup(c.places.map((p) => p.slug), "luogo");
  dup(c.media.map((m) => m.key), "media");
  dup(c.itineraries.map((i) => i.slug), "itinerario");
  dup(c.neighborhoods.map((n) => n.slug), "quartiere");

  const placeSlugs = new Set(c.places.map((p) => p.slug));
  const mediaKeys = new Set(c.media.map((m) => m.key));
  const nbSlugs = new Set(c.neighborhoods.map((n) => n.slug));

  for (const m of c.media) {
    if (!existsSync(path.join(process.cwd(), "public", m.file))) errors.push(`media ${m.key}: file mancante ${m.file}`);
  }
  for (const p of c.places) {
    for (const k of p.images) if (!mediaKeys.has(k)) warnings.push(`luogo ${p.slug}: immagine ${k} assente`);
    if (p.historic && !mediaKeys.has(p.historic.media)) warnings.push(`luogo ${p.slug}: foto storica assente`);
    if (p.neighborhood && !nbSlugs.has(p.neighborhood)) warnings.push(`luogo ${p.slug}: quartiere ${p.neighborhood} assente`);
    if (Math.abs(p.lat - 39.29) > 0.2 || Math.abs(p.lng - 16.26) > 0.2) errors.push(`luogo ${p.slug}: coordinate fuori area`);
  }
  for (const it of c.itineraries) {
    if (!mediaKeys.has(it.cover)) warnings.push(`itinerario ${it.slug}: copertina ${it.cover} assente`);
    it.chapters.forEach((ch, i) => {
      if (ch.place === null && !ch.at) errors.push(`itinerario ${it.slug} cap. ${i + 1}: transizione senza "at"`);
      if (ch.place !== null && !placeSlugs.has(ch.place)) errors.push(`itinerario ${it.slug} cap. ${i + 1}: luogo ${ch.place} inesistente`);
    });
  }
  return { errors, warnings };
}

/** Punto di un capitolo: coordinate del luogo, o `at` per le transizioni. */
export function chapterPoint(c: Content, ch: SeedItinerary["chapters"][number]): LngLat {
  if (ch.place) {
    const p = c.places.find((x) => x.slug === ch.place);
    if (!p) throw new Error(`luogo ${ch.place} inesistente`);
    return [p.lng, p.lat];
  }
  return ch.at!;
}

export async function readRoute(slug: string): Promise<LngLat[] | null> {
  const file = path.join(CONTENT_DIR, "routes", `${slug}.json`);
  if (!existsSync(file)) return null;
  const json = JSON.parse(await readFile(file, "utf8")) as { coordinates: LngLat[] };
  return json.coordinates;
}
