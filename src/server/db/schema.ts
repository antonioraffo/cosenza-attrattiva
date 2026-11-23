import { sql, type SQL } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { parseWkbHex, type Position } from "@/lib/geo/wkb";

/* ── Tipi condivisi ─────────────────────────────────────────────────────── */

export type Localized = { it: string; en: string };
export type Camera = { zoom: number; bearing: number; pitch: number };
export type StreetViewConfig = {
  lat: number;
  lng: number;
  heading: number;
  pitch: number;
  hotspots: { heading: number; pitch: number; label: Localized; text: Localized }[];
};
export type ArConfig = { headline: Localized; timeline: { year: string; text: Localized }[] };
export type Accessibility = { stepFree: boolean | null; notes: Localized };

/* ── Tipi PostGIS (SRID 4326, coordinate [lng, lat]) ────────────────────── */

const geojson = (g: object): SQL => sql`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(g)}), 4326)`;

export const point = customType<{ data: Position; driverData: string }>({
  dataType: () => "geometry(Point, 4326)",
  toDriver: (coordinates) => geojson({ type: "Point", coordinates }),
  fromDriver: (hex) => parseWkbHex(hex).coordinates as Position,
});

export const lineString = customType<{ data: Position[]; driverData: string }>({
  dataType: () => "geometry(LineString, 4326)",
  toDriver: (coordinates) => geojson({ type: "LineString", coordinates }),
  fromDriver: (hex) => parseWkbHex(hex).coordinates as Position[],
});

export const polygon = customType<{ data: Position[][]; driverData: string }>({
  dataType: () => "geometry(Polygon, 4326)",
  toDriver: (coordinates) => geojson({ type: "Polygon", coordinates }),
  fromDriver: (hex) => parseWkbHex(hex).coordinates as Position[][],
});

/* ── Enum ───────────────────────────────────────────────────────────────── */

export const themeEnum = pgEnum("theme", [
  "fede",
  "arte",
  "storia",
  "enogastronomia",
  "contemporaneo",
  "quartieri",
]);
export const difficultyEnum = pgEnum("difficulty", ["facile", "media", "impegnativa"]);
export const placeCategoryEnum = pgEnum("place_category", [
  "chiesa",
  "museo",
  "piazza",
  "strada",
  "teatro",
  "parco",
  "monumento",
  "opera-arte",
  "architettura",
  "paesaggio",
  "quartiere",
  "cantina",
  "scienza",
]);
export const mediaKindEnum = pgEnum("media_kind", ["image", "historic", "audio"]);
/** Tipo di itinerario in base a quante tappe hanno una posizione (calcolato dal seed). */
export const itineraryKindEnum = pgEnum("itinerary_kind", ["a-piedi", "misto", "tematico"]);
export const pillarEnum = pgEnum("pillar", ["vive", "connect", "crea"]);
export const eventCategoryEnum = pgEnum("event_category", ["cultura", "spettacolo", "tradizioni", "shopping-notti", "artigianato"]);

/* ── Tabelle ────────────────────────────────────────────────────────────── */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  kind: mediaKindEnum("kind").notNull(),
  url: text("url").notNull(),
  width: integer("width"),
  height: integer("height"),
  alt: jsonb("alt").$type<Localized>().notNull(),
  credit: text("credit"),
  license: text("license"),
  sourceUrl: text("source_url"),
  ...timestamps,
});

export const neighborhoods = pgTable(
  "neighborhoods",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: jsonb("name").$type<Localized>().notNull(),
    description: jsonb("description").$type<Localized>().notNull(),
    geom: polygon("geom").notNull(),
    ...timestamps,
  },
  (t) => [index("neighborhoods_geom_idx").using("gist", t.geom)],
);

export const places = pgTable(
  "places",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: jsonb("name").$type<Localized>().notNull(),
    category: placeCategoryEnum("category").notNull(),
    summary: jsonb("summary").$type<Localized>().notNull(),
    body: jsonb("body").$type<Localized>().notNull(),
    curiosities: jsonb("curiosities").$type<Localized[]>().notNull().default([]),
    geom: point("geom").notNull(),
    coordsVerified: boolean("coords_verified").notNull().default(false),
    coordsSource: text("coords_source"),
    geofenceRadiusM: smallint("geofence_radius_m").notNull().default(40),
    address: text("address"),
    openingHours: jsonb("opening_hours").$type<Localized | null>(),
    accessibility: jsonb("accessibility").$type<Accessibility>(),
    historicMediaId: integer("historic_media_id").references(() => media.id, { onDelete: "set null" }),
    historicYear: text("historic_year"),
    historicCaption: jsonb("historic_caption").$type<Localized | null>(),
    audioUrl: jsonb("audio_url").$type<Partial<Localized> | null>(),
    streetview: jsonb("streetview").$type<StreetViewConfig | null>(),
    ar: jsonb("ar").$type<ArConfig | null>(),
    neighborhoodId: integer("neighborhood_id").references(() => neighborhoods.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [index("places_geom_idx").using("gist", t.geom)],
);

export const placeMedia = pgTable(
  "place_media",
  {
    placeId: integer("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    mediaId: integer("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    position: smallint("position").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.placeId, t.mediaId] })],
);

export const itineraries = pgTable(
  "itineraries",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: jsonb("title").$type<Localized>().notNull(),
    subtitle: jsonb("subtitle").$type<Localized>().notNull(),
    intro: jsonb("intro").$type<Localized>().notNull(),
    theme: themeEnum("theme").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    /** Calcolata dal percorso; per gli itinerari senza percorso è la durata dichiarata dalla redazione. */
    durationMin: integer("duration_min").notNull(),
    /** Lunghezza del percorso: assente negli itinerari tematici. */
    lengthM: integer("length_m"),
    kind: itineraryKindEnum("kind").notNull().default("a-piedi"),
    color: text("color").notNull(),
    coverMediaId: integer("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    /** Percorso pedonale: presente solo con almeno due tappe geolocalizzate. */
    route: lineString("route"),
    featured: boolean("featured").notNull().default(false),
    sort: smallint("sort").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("itineraries_route_idx").using("gist", t.route)],
);

export const chapters = pgTable(
  "chapters",
  {
    id: serial("id").primaryKey(),
    itineraryId: integer("itinerary_id")
      .notNull()
      .references(() => itineraries.id, { onDelete: "cascade" }),
    placeId: integer("place_id").references(() => places.id, { onDelete: "set null" }),
    position: smallint("position").notNull(),
    title: jsonb("title").$type<Localized>().notNull(),
    body: jsonb("body").$type<Localized>().notNull(),
    audioUrl: jsonb("audio_url").$type<Partial<Localized> | null>(),
    camera: jsonb("camera").$type<Camera | null>(),
    /**
     * Punto del capitolo: coincide col luogo, oppure punto libero per le transizioni.
     * Assente per le tappe non geolocalizzate (racconti, temi, prodotti).
     */
    geom: point("geom"),
    /** Posizione lungo il percorso (0–1): separa il tratto "fatto" dal "rimanente". */
    routeFraction: real("route_fraction"),
    /** Immagine propria del capitolo (per le tappe senza luogo); altrimenti si usa quella del luogo. */
    imageMediaId: integer("image_media_id").references(() => media.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [uniqueIndex("chapters_itinerary_position_idx").on(t.itineraryId, t.position)],
);

/**
 * Eventi della città (pilastro Vive). `major` = grande evento: un evento di grande rilevanza
 * (richiamo oltre la città, visibilità, valore identitario), messo in evidenza con una pagina dedicata.
 * Le date possono mancare: allora vale `period` (es. "Luglio", "Data da annunciare").
 */
export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: jsonb("title").$type<Localized>().notNull(),
    summary: jsonb("summary").$type<Localized>().notNull(),
    description: jsonb("description").$type<Localized>().notNull(),
    category: eventCategoryEnum("category").notNull(),
    pillar: pillarEnum("pillar").notNull().default("vive"),
    major: boolean("major").notNull().default(false),
    startDate: text("start_date"),
    endDate: text("end_date"),
    /** Mese indicativo (1–12) per ordinare gli eventi senza data esatta. */
    month: smallint("month"),
    period: jsonb("period").$type<Localized | null>(),
    schedule: jsonb("schedule").$type<Localized | null>(),
    venue: text("venue"),
    placeId: integer("place_id").references(() => places.id, { onDelete: "set null" }),
    geom: point("geom"),
    coverMediaId: integer("cover_media_id").references(() => media.id, { onDelete: "set null" }),
    sourceUrl: text("source_url"),
    /** Dati dimostrativi o da verificare con il Comune. */
    demo: boolean("demo").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("events_geom_idx").using("gist", t.geom)],
);

export type Place = typeof places.$inferSelect;
export type Itinerary = typeof itineraries.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Neighborhood = typeof neighborhoods.$inferSelect;
export type CityEvent = typeof events.$inferSelect;
