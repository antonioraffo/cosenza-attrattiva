import "server-only";
import { asc, eq, inArray, sql } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/server/db/client";
import { chapters, events, itineraries, itineraryLinks, media, neighborhoods, placeMedia, places, type Media } from "@/server/db/schema";
import type { Position } from "@/lib/geo/wkb";
import { tr } from "@/lib/i18n";

export type MediaItem = Pick<Media, "url" | "width" | "height" | "alt" | "credit" | "license" | "sourceUrl">;

const mediaCols = {
  url: media.url,
  width: media.width,
  height: media.height,
  alt: media.alt,
  credit: media.credit,
  license: media.license,
  sourceUrl: media.sourceUrl,
};

async function mediaByIds(ids: (number | null)[]): Promise<Map<number, MediaItem>> {
  const wanted = [...new Set(ids.filter((x): x is number => x !== null))];
  if (!wanted.length) return new Map();
  const rows = await db.select({ id: media.id, ...mediaCols }).from(media).where(inArray(media.id, wanted));
  return new Map(rows.map(({ id, ...m }) => [id, m]));
}

/** Prima immagine della galleria per ogni luogo. */
async function coverByPlace(placeIds: number[]): Promise<Map<number, MediaItem>> {
  if (!placeIds.length) return new Map();
  const rows = await db
    .select({ placeId: placeMedia.placeId, ...mediaCols })
    .from(placeMedia)
    .innerJoin(media, eq(media.id, placeMedia.mediaId))
    .where(inArray(placeMedia.placeId, placeIds))
    .orderBy(asc(placeMedia.position));
  const out = new Map<number, MediaItem>();
  for (const { placeId, ...m } of rows) if (!out.has(placeId)) out.set(placeId, m);
  return out;
}

/* ── Itinerari ──────────────────────────────────────────────────────────── */

export const listItineraries = cache(async () => {
  const rows = await db
    .select({
      id: itineraries.id,
      slug: itineraries.slug,
      title: itineraries.title,
      subtitle: itineraries.subtitle,
      theme: itineraries.theme,
      difficulty: itineraries.difficulty,
      durationMin: itineraries.durationMin,
      lengthM: itineraries.lengthM,
      kind: itineraries.kind,
      color: itineraries.color,
      featured: itineraries.featured,
      coverMediaId: itineraries.coverMediaId,
      stops: sql<number>`(select count(*)::int from chapters c where c.itinerary_id = "itineraries"."id")`,
    })
    .from(itineraries)
    .orderBy(asc(itineraries.sort));
  const covers = await mediaByIds(rows.map((r) => r.coverMediaId));
  return rows.map(({ coverMediaId, ...r }) => ({ ...r, cover: coverMediaId ? (covers.get(coverMediaId) ?? null) : null }));
});

export type ItinerarySummary = Awaited<ReturnType<typeof listItineraries>>[number];

export const getItinerary = cache(async (slug: string) => {
  const [it] = await db.select().from(itineraries).where(eq(itineraries.slug, slug)).limit(1);
  if (!it) return null;

  const rows = await db
    .select({
      id: chapters.id,
      position: chapters.position,
      title: chapters.title,
      body: chapters.body,
      audioUrl: chapters.audioUrl,
      camera: chapters.camera,
      geom: chapters.geom,
      routeFraction: chapters.routeFraction,
      imageMediaId: chapters.imageMediaId,
      placeId: chapters.placeId,
      placeSlug: places.slug,
      placeName: places.name,
      placeSummary: places.summary,
      geofenceRadiusM: places.geofenceRadiusM,
      hasStreetview: sql<boolean>`${places.streetview} is not null`,
      hasAr: sql<boolean>`${places.ar} is not null`,
    })
    .from(chapters)
    .leftJoin(places, eq(places.id, chapters.placeId))
    .where(eq(chapters.itineraryId, it.id))
    .orderBy(asc(chapters.position));

  const [covers, itCover, chapterImages] = await Promise.all([
    coverByPlace(rows.map((r) => r.placeId).filter((x): x is number => x !== null)),
    mediaByIds([it.coverMediaId]),
    mediaByIds(rows.map((r) => r.imageMediaId)),
  ]);

  return {
    ...it,
    cover: it.coverMediaId ? (itCover.get(it.coverMediaId) ?? null) : null,
    chapters: rows.map((r) => ({
      ...r,
      /** null = tappa non geolocalizzata */
      geom: (r.geom as Position | null) ?? null,
      geofenceRadiusM: r.geofenceRadiusM ?? 30,
      image: (r.imageMediaId ? chapterImages.get(r.imageMediaId) : null) ?? (r.placeId ? (covers.get(r.placeId) ?? null) : null),
    })),
    /** Tappe con posizione: servono almeno due per la passeggiata e il volo 3D. */
    locatedCount: rows.filter((r) => r.geom !== null).length,
  };
});

export type ItineraryDetail = NonNullable<Awaited<ReturnType<typeof getItinerary>>>;
export type ChapterDetail = ItineraryDetail["chapters"][number];

/** Dati del giro di «Il tuo tempo»: itinerari con le tappe (frazione lungo il percorso) e trasferimenti a piedi. */
export const getPlanData = cache(async (locale: string) => {
  const all = await listItineraries();
  const rows = await db
    .select({
      itineraryId: chapters.itineraryId,
      title: chapters.title,
      placeSlug: places.slug,
      placeName: places.name,
      fraction: chapters.routeFraction,
      located: sql<boolean>`${chapters.geom} is not null`,
    })
    .from(chapters)
    .leftJoin(places, eq(places.id, chapters.placeId))
    .orderBy(asc(chapters.itineraryId), asc(chapters.position));
  const linkRows = await db.select().from(itineraryLinks);
  const slugById = new Map(all.map((i) => [i.id, i.slug]));
  const links: Record<string, Record<string, number>> = {};
  for (const l of linkRows) {
    const from = slugById.get(l.fromId);
    const to = slugById.get(l.toId);
    if (from && to) (links[from] ??= {})[to] = l.distanceM;
  }
  const itineraries = all.map((it) => ({
    slug: it.slug,
    title: tr(it.title, locale),
    subtitle: tr(it.subtitle, locale),
    durationMin: it.durationMin,
    lengthM: it.lengthM,
    kind: it.kind,
    color: it.color,
    theme: it.theme,
    cover: it.cover,
    stops: rows
      .filter((r) => r.itineraryId === it.id)
      .map((r) => ({
        // il nome del luogo è più utile del titolo del capitolo in una linea del tempo
        title: r.placeName ? tr(r.placeName, locale).split(" – ")[0]! : tr(r.title, locale),
        placeSlug: r.placeSlug,
        fraction: r.located ? (r.fraction ?? 0) : null,
      })),
  }));
  return { itineraries, links };
});

/* ── Luoghi ─────────────────────────────────────────────────────────────── */

export const getPlace = cache(async (slug: string) => {
  const [p] = await db.select().from(places).where(eq(places.slug, slug)).limit(1);
  if (!p) return null;

  const [gallery, historic, inItineraries, nb, nearby] = await Promise.all([
    db
      .select(mediaCols)
      .from(placeMedia)
      .innerJoin(media, eq(media.id, placeMedia.mediaId))
      .where(eq(placeMedia.placeId, p.id))
      .orderBy(asc(placeMedia.position)),
    mediaByIds([p.historicMediaId]),
    db
      .selectDistinct({
        slug: itineraries.slug,
        title: itineraries.title,
        theme: itineraries.theme,
        color: itineraries.color,
        durationMin: itineraries.durationMin,
        sort: itineraries.sort,
      })
      .from(chapters)
      .innerJoin(itineraries, eq(itineraries.id, chapters.itineraryId))
      .where(eq(chapters.placeId, p.id))
      .orderBy(asc(itineraries.sort)),
    p.neighborhoodId
      ? db.select({ slug: neighborhoods.slug, name: neighborhoods.name }).from(neighborhoods).where(eq(neighborhoods.id, p.neighborhoodId))
      : Promise.resolve([]),
    nearbyPlaces(p.id),
  ]);

  return {
    ...p,
    gallery,
    historic: p.historicMediaId ? (historic.get(p.historicMediaId) ?? null) : null,
    itineraries: inItineraries,
    neighborhood: nb[0] ?? null,
    nearby,
  };
});

export type PlaceDetail = NonNullable<Awaited<ReturnType<typeof getPlace>>>;

/** Luoghi entro `radiusM` (ST_DWithin su geography): prossimità tra luoghi, mai sulla posizione dell'utente. */
export async function nearbyPlaces(placeId: number, radiusM = 700, limit = 4) {
  const rows = await db.execute<{ id: number; slug: string; name: { it: string; en: string }; category: string; distance: number }>(sql`
    select p2.id, p2.slug, p2.name, p2.category,
           round(ST_Distance(p1.geom::geography, p2.geom::geography))::int as distance
    from ${places} p1
    join ${places} p2 on p2.id <> p1.id
     and ST_DWithin(p1.geom::geography, p2.geom::geography, ${radiusM})
    where p1.id = ${placeId}
    order by distance
    limit ${limit}
  `);
  const list = Array.from(rows);
  const covers = await coverByPlace(list.map((r) => r.id));
  return list.map((r) => ({ ...r, image: covers.get(r.id) ?? null }));
}

export const listPlaceSlugs = cache(async () => db.select({ slug: places.slug, updatedAt: places.updatedAt }).from(places));

/** Tutti i luoghi (per la mappa AR e il passaporto). */
export const listPlacesLite = cache(async () => {
  const rows = await db
    .select({
      id: places.id,
      slug: places.slug,
      name: places.name,
      category: places.category,
      geom: places.geom,
      geofenceRadiusM: places.geofenceRadiusM,
      ar: places.ar,
    })
    .from(places)
    .orderBy(asc(places.slug));
  const covers = await coverByPlace(rows.map((r) => r.id));
  return rows.map((r) => ({ ...r, image: covers.get(r.id) ?? null }));
});

export type PlaceLite = Awaited<ReturnType<typeof listPlacesLite>>[number];

export const listAllMedia = cache(async () =>
  db.select({ key: media.key, ...mediaCols }).from(media).orderBy(asc(media.key)),
);

/** Luoghi per slug, nell'ordine richiesto (pannelli della home). */
export const placesBySlugs = cache(async (slugs: string[]) => {
  if (!slugs.length) return [];
  const rows = await db
    .select({ id: places.id, slug: places.slug, name: places.name, summary: places.summary })
    .from(places)
    .where(inArray(places.slug, slugs));
  const covers = await coverByPlace(rows.map((r) => r.id));
  return slugs
    .map((slug) => rows.find((r) => r.slug === slug))
    .filter((r): r is (typeof rows)[number] => !!r)
    .map((r) => ({ ...r, image: covers.get(r.id) ?? null }));
});

/** Tutti i luoghi con sintesi e testo, per Esplora e per "Il mio itinerario" (ordine per nome). */
export const listPlacesFull = cache(async () => {
  const rows = await db
    .select({
      id: places.id,
      slug: places.slug,
      name: places.name,
      category: places.category,
      summary: places.summary,
      body: places.body,
      geom: places.geom,
      geofenceRadiusM: places.geofenceRadiusM,
      audioUrl: places.audioUrl,
    })
    .from(places)
    .orderBy(asc(places.slug));
  const covers = await coverByPlace(rows.map((r) => r.id));
  return rows.map((r) => ({ ...r, image: covers.get(r.id) ?? null }));
});

export type PlaceFull = Awaited<ReturnType<typeof listPlacesFull>>[number];

/* ── Eventi ─────────────────────────────────────────────────────────────── */

const eventCols = {
  id: events.id,
  slug: events.slug,
  title: events.title,
  summary: events.summary,
  category: events.category,
  pillar: events.pillar,
  major: events.major,
  startDate: events.startDate,
  endDate: events.endDate,
  month: events.month,
  period: events.period,
  schedule: events.schedule,
  venue: events.venue,
  sourceUrl: events.sourceUrl,
  demo: events.demo,
  coverMediaId: events.coverMediaId,
  placeSlug: places.slug,
  placeName: places.name,
};

/**
 * Tutti gli eventi in ordine di data: prima quelli con una data (anche passati, il filtro è in pagina),
 * poi quelli con il solo mese, poi quelli "da annunciare".
 */
export const listEvents = cache(async () => {
  const rows = await db
    .select(eventCols)
    .from(events)
    .leftJoin(places, eq(places.id, events.placeId))
    .orderBy(sql`${events.startDate} asc nulls last`, sql`${events.month} asc nulls last`, asc(events.slug));
  const covers = await mediaByIds(rows.map((r) => r.coverMediaId));
  return rows.map(({ coverMediaId, ...r }) => ({ ...r, cover: coverMediaId ? (covers.get(coverMediaId) ?? null) : null }));
});

export type EventSummary = Awaited<ReturnType<typeof listEvents>>[number];

/** Luoghi entro `radiusM` da un punto (prossimità tra luoghi pubblici, mai la posizione dell'utente). */
async function placesNearPoint(point: Position, radiusM = 600, limit = 4, exclude: number | null = null) {
  const geom = sql`ST_SetSRID(ST_MakePoint(${point[0]}, ${point[1]}), 4326)::geography`;
  const rows = await db.execute<{ id: number; slug: string; name: { it: string; en: string }; category: string; distance: number }>(sql`
    select p.id, p.slug, p.name, p.category, round(ST_Distance(p.geom::geography, ${geom}))::int as distance
    from ${places} p
    where ST_DWithin(p.geom::geography, ${geom}, ${radiusM}) and p.id is distinct from ${exclude}
    order by distance
    limit ${limit}
  `);
  const list = Array.from(rows);
  const covers = await coverByPlace(list.map((r) => r.id));
  return list.map((r) => ({ ...r, image: covers.get(r.id) ?? null }));
}

/** Itinerari con almeno una tappa entro `radiusM` dal punto, i più vicini prima. */
async function itinerariesNearPoint(point: Position, radiusM = 500) {
  const geom = sql`ST_SetSRID(ST_MakePoint(${point[0]}, ${point[1]}), 4326)::geography`;
  const rows = await db.execute<{ slug: string; title: { it: string; en: string }; subtitle: { it: string; en: string }; color: string; distance: number }>(sql`
    select i.slug, i.title, i.subtitle, i.color, min(round(ST_Distance(c.geom::geography, ${geom})))::int as distance
    from ${chapters} c join ${itineraries} i on i.id = c.itinerary_id
    where c.geom is not null and ST_DWithin(c.geom::geography, ${geom}, ${radiusM})
    group by i.slug, i.title, i.subtitle, i.color
    order by distance
    limit 3
  `);
  return Array.from(rows);
}

export const getEvent = cache(async (slug: string) => {
  const [row] = await db
    .select({ ...eventCols, description: events.description, geom: events.geom, placeId: events.placeId })
    .from(events)
    .leftJoin(places, eq(places.id, events.placeId))
    .where(eq(events.slug, slug))
    .limit(1);
  if (!row) return null;
  const point = (row.geom as Position | null) ?? null;
  const [cover, nearby, nearItineraries] = await Promise.all([
    mediaByIds([row.coverMediaId]),
    point ? placesNearPoint(point, 600, 4, row.placeId) : Promise.resolve([]),
    point ? itinerariesNearPoint(point) : Promise.resolve([]),
  ]);
  return {
    ...row,
    geom: point,
    cover: row.coverMediaId ? (cover.get(row.coverMediaId) ?? null) : null,
    nearby,
    itineraries: nearItineraries,
  };
});

export type EventDetail = NonNullable<Awaited<ReturnType<typeof getEvent>>>;
