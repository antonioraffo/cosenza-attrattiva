/**
 * Seed idempotente: carica content/seed/** nel database (upsert per slug/key).
 * Eseguibile più volte: `make seed`.
 */
import { writeFile } from "node:fs/promises";
import { eq, notInArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { bearingDeg, lineLengthM, locateOnLine, type LngLat } from "../../lib/geo";
import { chapterPoint, loadContent, readRoute, validateContent } from "./content";
import * as s from "./schema";

const client = postgres(process.env.DATABASE_URL!, { max: 1, onnotice: () => {} });
const db = drizzle(client, { schema: s, casing: "snake_case" });

const WALK_M_PER_MIN = 70; // passo turistico, con soste brevi
const MIN_PER_STOP = 8;

const content = await loadContent();
const { errors, warnings } = validateContent(content);
warnings.forEach((w) => console.warn(`  ! ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`  ✘ ${e}`));
  process.exit(1);
}

await db.transaction(async (tx) => {
  /* media */
  const mediaIds = new Map<string, number>();
  for (const m of content.media) {
    const values = {
      key: m.key,
      kind: m.kind,
      url: m.file,
      width: m.width,
      height: m.height,
      alt: m.alt,
      credit: m.credit,
      license: m.license,
      sourceUrl: m.sourceUrl,
      updatedAt: new Date(),
    };
    const [row] = await tx
      .insert(s.media)
      .values(values)
      .onConflictDoUpdate({ target: s.media.key, set: values })
      .returning({ id: s.media.id });
    mediaIds.set(m.key, row!.id);
  }

  /* quartieri */
  const nbIds = new Map<string, number>();
  for (const n of content.neighborhoods) {
    const ring = [...n.polygon];
    const [f, l] = [ring[0]!, ring[ring.length - 1]!];
    if (f[0] !== l[0] || f[1] !== l[1]) ring.push(f);
    const values = { slug: n.slug, name: n.name, description: n.description, geom: [ring], updatedAt: new Date() };
    const [row] = await tx
      .insert(s.neighborhoods)
      .values(values)
      .onConflictDoUpdate({ target: s.neighborhoods.slug, set: values })
      .returning({ id: s.neighborhoods.id });
    nbIds.set(n.slug, row!.id);
  }

  /* luoghi */
  const placeIds = new Map<string, number>();
  for (const p of content.places) {
    const sv = p.streetview
      ? {
          lat: p.streetview.lat,
          lng: p.streetview.lng,
          heading: p.streetview.heading ?? Math.round(bearingDeg([p.streetview.lng, p.streetview.lat], [p.lng, p.lat])),
          pitch: p.streetview.pitch ?? 5,
          hotspots: p.streetview.hotspots,
        }
      : null;
    const values = {
      slug: p.slug,
      name: p.name,
      category: p.category,
      summary: p.summary,
      body: p.body,
      curiosities: p.curiosities,
      geom: [p.lng, p.lat] as LngLat,
      coordsVerified: p.coordsVerified,
      coordsSource: p.coordsSource,
      geofenceRadiusM: p.geofenceRadiusM,
      address: p.address,
      openingHours: p.openingHours,
      accessibility: p.accessibility,
      historicMediaId: p.historic ? (mediaIds.get(p.historic.media) ?? null) : null,
      historicYear: p.historic?.year ?? null,
      historicCaption: p.historic?.caption ?? null,
      streetview: sv,
      ar: p.ar ?? null,
      neighborhoodId: p.neighborhood ? (nbIds.get(p.neighborhood) ?? null) : null,
      updatedAt: new Date(),
    };
    const [row] = await tx
      .insert(s.places)
      .values(values)
      .onConflictDoUpdate({ target: s.places.slug, set: values })
      .returning({ id: s.places.id });
    placeIds.set(p.slug, row!.id);

    await tx.delete(s.placeMedia).where(eq(s.placeMedia.placeId, row!.id));
    const gallery = p.images.filter((k) => mediaIds.has(k));
    if (gallery.length) {
      await tx
        .insert(s.placeMedia)
        .values(gallery.map((k, i) => ({ placeId: row!.id, mediaId: mediaIds.get(k)!, position: i })));
    }
  }

  /* itinerari + capitoli */
  for (const [sort, it] of content.itineraries.entries()) {
    const stops = it.chapters.map((ch) => chapterPoint(content, ch));
    const route = (await readRoute(it.slug)) ?? stops; // fallback: linea spezzata tra le tappe
    const lengthM = Math.round(lineLengthM(route));
    const durationMin = Math.round((lengthM / WALK_M_PER_MIN + stops.length * MIN_PER_STOP) / 5) * 5;

    const values = {
      slug: it.slug,
      title: it.title,
      subtitle: it.subtitle,
      intro: it.intro,
      theme: it.theme,
      difficulty: it.difficulty,
      durationMin,
      lengthM,
      color: it.color,
      coverMediaId: mediaIds.get(it.cover) ?? null,
      route,
      featured: it.featured,
      sort,
      updatedAt: new Date(),
    };
    const [row] = await tx
      .insert(s.itineraries)
      .values(values)
      .onConflictDoUpdate({ target: s.itineraries.slug, set: values })
      .returning({ id: s.itineraries.id });

    await tx.delete(s.chapters).where(eq(s.chapters.itineraryId, row!.id));
    let prevAlong = 0;
    await tx.insert(s.chapters).values(
      it.chapters.map((ch, i) => {
        // la proiezione è monotona: un percorso può ripassare vicino a una tappa precedente
        const along = Math.max(prevAlong, locateOnLine(route, stops[i]!).alongM);
        prevAlong = along;
        return {
          itineraryId: row!.id,
          placeId: ch.place ? placeIds.get(ch.place)! : null,
          position: i,
          title: ch.title,
          body: ch.body,
          camera: ch.camera,
          geom: stops[i]!,
          routeFraction: lengthM > 0 ? Math.min(1, along / lengthM) : 0,
        };
      }),
    );
    console.log(`  ✔ ${it.slug}: ${it.chapters.length} capitoli, ${(lengthM / 1000).toFixed(1)} km, ~${durationMin} min`);
  }

  /* rimuove contenuti non più presenti nel seed */
  const slugs = content.itineraries.map((i) => i.slug);
  if (slugs.length) await tx.delete(s.itineraries).where(notInArray(s.itineraries.slug, slugs));
  const placeSlugs = content.places.map((p) => p.slug);
  if (placeSlugs.length) await tx.delete(s.places).where(notInArray(s.places.slug, placeSlugs));
  const mediaKeys = content.media.map((m) => m.key);
  if (mediaKeys.length) await tx.delete(s.media).where(notInArray(s.media.key, mediaKeys));
});

/* report coordinate da verificare */
const unverified = content.places.filter((p) => !p.coordsVerified);
await writeFile(
  "TODO-coordinate.md",
  [
    "# Coordinate da verificare",
    "",
    "Generato da `make seed`. Luoghi con coordinate stimate o non verificate sull'oggetto stesso",
    "(fonte diversa da Wikidata/OSM). Verificare sul posto o su mappa e aggiornare",
    "`content/seed/places/*.ts` impostando `coordsVerified: true`.",
    "",
    "| Luogo | Slug | Lat | Lng | Fonte |",
    "|---|---|---|---|---|",
    ...unverified.map((p) => `| ${p.name.it} | \`${p.slug}\` | ${p.lat} | ${p.lng} | ${p.coordsSource} |`),
    "",
    unverified.length ? "" : "_Nessuna: tutte le coordinate provengono da Wikidata/OSM._",
  ].join("\n"),
);

const [{ count }] = (await db.execute(sql`select count(*)::int as count from places`)) as unknown as [{ count: number }];
console.log(
  `✔ Seed completato: ${content.itineraries.length} itinerari, ${count} luoghi, ${content.media.length} media, ${content.neighborhoods.length} quartieri`,
);
console.log(`  ${unverified.length} luoghi con coordinate da verificare → TODO-coordinate.md`);
await client.end();
