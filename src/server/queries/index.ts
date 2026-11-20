import "server-only";
import { asc, eq, inArray, sql } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/server/db/client";
import { chapters, itineraries, media, neighborhoods, placeMedia, places, type Media } from "@/server/db/schema";
import type { Position } from "@/lib/geo/wkb";

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
      color: itineraries.color,
      featured: itineraries.featured,
      coverMediaId: itineraries.coverMediaId,
      stops: sql<number>`(select count(*)::int from ${chapters} where ${chapters.itineraryId} = ${itineraries.id})`,
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

  const [covers, itCover] = await Promise.all([
    coverByPlace(rows.map((r) => r.placeId).filter((x): x is number => x !== null)),
    mediaByIds([it.coverMediaId]),
  ]);

  return {
    ...it,
    cover: it.coverMediaId ? (itCover.get(it.coverMediaId) ?? null) : null,
    chapters: rows.map((r) => ({
      ...r,
      geom: r.geom as Position,
      geofenceRadiusM: r.geofenceRadiusM ?? 30,
      image: r.placeId ? (covers.get(r.placeId) ?? null) : null,
    })),
  };
});

export type ItineraryDetail = NonNullable<Awaited<ReturnType<typeof getItinerary>>>;
export type ChapterDetail = ItineraryDetail["chapters"][number];

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
