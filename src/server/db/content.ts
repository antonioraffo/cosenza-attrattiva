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
  SeedEvent,
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
  events: SeedEvent[];
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
  const evFile = path.join(CONTENT_DIR, "events.ts");
  const events = existsSync(evFile) ? ((await import(pathToFileURL(evFile).href)) as { events: SeedEvent[] }).events : [];
  return { places, media, itineraries, neighborhoods, events };
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
    const located = it.chapters.filter((ch) => ch.place !== null || ch.at).length;
    if (located < 2 && !it.durationMin) errors.push(`itinerario ${it.slug}: meno di due tappe geolocalizzate, serve "durationMin"`);
    for (const ch of it.chapters) if (ch.image && !mediaKeys.has(ch.image)) warnings.push(`itinerario ${it.slug}: immagine ${ch.image} assente`);
    it.chapters.forEach((ch, i) => {
      if (ch.place === null && ch.at === undefined)
        errors.push(`itinerario ${it.slug} cap. ${i + 1}: capitolo senza luogo: indicare "at" (punto) oppure "at: null" (non geolocalizzato)`);
      if ((ch.place !== null || ch.at) && !ch.camera) errors.push(`itinerario ${it.slug} cap. ${i + 1}: manca "camera"`);
      if (ch.place !== null && !placeSlugs.has(ch.place)) errors.push(`itinerario ${it.slug} cap. ${i + 1}: luogo ${ch.place} inesistente`);
    });
  }
  dup(c.events.map((e) => e.slug), "evento");
  for (const e of c.events) {
    if (e.place && !placeSlugs.has(e.place)) errors.push(`evento ${e.slug}: luogo ${e.place} inesistente`);
    if (e.cover && !mediaKeys.has(e.cover)) warnings.push(`evento ${e.slug}: copertina ${e.cover} assente`);
    if (!e.start && !e.period) errors.push(`evento ${e.slug}: serve "start" oppure "period"`);
    if (e.start && !/^\d{4}-\d{2}-\d{2}$/.test(e.start)) errors.push(`evento ${e.slug}: data non valida`);
  }
  return { errors, warnings };
}

/** Punto di un capitolo: coordinate del luogo, `at` per le transizioni, null se non geolocalizzato. */
export function chapterPoint(c: Content, ch: SeedItinerary["chapters"][number]): LngLat | null {
  if (ch.place) {
    const p = c.places.find((x) => x.slug === ch.place);
    if (!p) throw new Error(`luogo ${ch.place} inesistente`);
    return [p.lng, p.lat];
  }
  return ch.at ?? null;
}

export async function readRoute(slug: string): Promise<LngLat[] | null> {
  const file = path.join(CONTENT_DIR, "routes", `${slug}.json`);
  if (!existsSync(file)) return null;
  const json = JSON.parse(await readFile(file, "utf8")) as { coordinates: LngLat[] };
  return json.coordinates;
}

/** Trasferimenti a piedi tra itinerari (scripts/build-links.ts). */
export async function readLinks(): Promise<{ from: string; to: string; distanceM: number }[]> {
  const file = path.join(CONTENT_DIR, "routes", "_links.json");
  if (!existsSync(file)) return [];
  return (JSON.parse(await readFile(file, "utf8")) as { links: { from: string; to: string; distanceM: number }[] }).links;
}
