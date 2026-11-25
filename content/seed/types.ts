/**
 * Formato dei contenuti di seed. I file in content/seed/** esportano dati tipizzati
 * con queste interfacce; `src/server/db/seed.ts` li valida e li carica (upsert per slug).
 */

export type Locale = "it" | "en";
/** Testo localizzato: italiano obbligatorio, inglese obbligatorio nel seed. */
export type L = Record<Locale, string>;
/** Coordinate [lng, lat] (ordine GeoJSON). */
export type LngLat = [number, number];

export type Theme = "fede" | "arte" | "storia" | "enogastronomia" | "contemporaneo" | "quartieri";
export type Difficulty = "facile" | "media" | "impegnativa";
export type PlaceCategory =
  | "chiesa"
  | "museo"
  | "piazza"
  | "strada"
  | "teatro"
  | "parco"
  | "monumento"
  | "opera-arte"
  | "architettura"
  | "paesaggio"
  | "quartiere"
  | "cantina"
  | "scienza";

export interface SeedMedia {
  /** Chiave univoca, convenzione `<placeSlug>-<n>` (n da 1) oppure `<placeSlug>-storica`. */
  key: string;
  /** Percorso pubblico, es. `/media/duomo-1.jpg` (file in public/media). */
  file: string;
  kind: "image" | "historic";
  width: number;
  height: number;
  alt: L;
  /** Es. "Mario Rossi, CC BY-SA 4.0, via Wikimedia Commons" */
  credit: string;
  /** Es. "CC BY-SA 4.0", "CC0", "Public domain" */
  license: string;
  /** Pagina del file su Commons */
  sourceUrl: string;
}

export interface SeedPlace {
  slug: string;
  name: L;
  category: PlaceCategory;
  /** Una frase, max ~160 caratteri. */
  summary: L;
  /** Una riga di sintesi per le mini card (Esplora a piedi in home), max ~90 caratteri. */
  sintesi?: Partial<L>;
  /** Markdown, 150–250 parole, tono evocativo ma accurato. */
  body: L;
  /** 2–3 curiosità brevi. */
  curiosities: L[];
  lat: number;
  lng: number;
  /** Fonte delle coordinate: "wikidata Q123", "osm node/123", "nominatim", "stima". */
  coordsSource: string;
  /** true solo se prese da Wikidata/OSM sull'oggetto stesso. */
  coordsVerified: boolean;
  /** Raggio di geofence in metri (25–80 in città, fino a 150 per aree ampie). */
  geofenceRadiusM: number;
  address: string;
  /** null se non applicabile (spazio pubblico sempre accessibile → usare testo "Sempre accessibile"). */
  openingHours: L | null;
  accessibility: { stepFree: boolean | null; notes: L };
  /** Chiavi di SeedMedia (kind "image"), la prima è la copertina. */
  images: string[];
  /** Foto storica per lo slider "Ieri e oggi". */
  historic?: { media: string; year: string; caption: L };
  /** Punto di vista Street View (strada vicina al luogo). heading opzionale: se assente è calcolato verso il luogo. */
  streetview?: {
    lat: number;
    lng: number;
    heading?: number;
    pitch?: number;
    hotspots: { heading: number; pitch: number; label: L; text: L }[];
  };
  /** Contenuti per l'overlay AR (etichetta + timeline storica). */
  ar?: { headline: L; timeline: { year: string; text: L }[] };
  /** slug del quartiere (SeedNeighborhood) se pertinente */
  neighborhood?: string;
}

export interface SeedChapter {
  /**
   * slug del luogo, oppure null per un capitolo senza luogo: con `at` è una transizione su mappa,
   * con `at: null` è una tappa non geolocalizzata (racconto, tema, prodotto).
   */
  place: string | null;
  at?: LngLat | null;
  title: L;
  /** Markdown, 120–250 parole, seconda persona, presente, evocativo. */
  body: L;
  /** Camera per il flyTo (zoom 15–18 in città, bearing -180..180, pitch 0–60); assente senza posizione. */
  camera?: { zoom: number; bearing: number; pitch: number };
  /** Immagine del capitolo (chiave SeedMedia), usata soprattutto per le tappe senza luogo. */
  image?: string;
}

export interface SeedItinerary {
  slug: string;
  title: L;
  subtitle: L;
  /** Introduzione 60–100 parole. */
  intro: L;
  theme: Theme;
  difficulty: Difficulty;
  /** Colore del percorso (hex) */
  color: string;
  /** Chiave SeedMedia della copertina */
  cover: string;
  featured: boolean;
  /**
   * Durata dichiarata in minuti: obbligatoria quando le tappe geolocalizzate sono meno di due
   * (itinerario tematico, o misto senza percorso); altrimenti è calcolata dal percorso.
   */
  durationMin?: number;
  chapters: SeedChapter[];
}

export interface SeedNeighborhood {
  slug: string;
  name: L;
  description: L;
  /** Anello chiuso [lng, lat][] (primo = ultimo), approssimativo. */
  polygon: LngLat[];
}

export type EventCategory = "cultura" | "spettacolo" | "tradizioni" | "shopping-notti" | "artigianato";
export type Pillar = "vive" | "connect" | "crea";

export interface SeedEvent {
  slug: string;
  title: L;
  /** Una frase per le card. */
  summary: L;
  /** Markdown, per la pagina dell'evento. */
  description: L;
  category: EventCategory;
  pillar: Pillar;
  /** Grande evento: evento di grande rilevanza, in evidenza con una pagina dedicata. */
  major: boolean;
  /** Date ISO (YYYY-MM-DD); se mancano vale `period`. */
  start?: string;
  end?: string;
  /** Mese indicativo 1–12, per ordinare gli eventi senza data. */
  month?: number;
  /** Etichetta del periodo quando la data non è nota (es. "Luglio", "Data da annunciare"). */
  period?: L;
  schedule?: L;
  venue?: string;
  /** slug del luogo (SeedPlace) dove si svolge */
  place?: string;
  /** Posizione se il luogo non è tra i SeedPlace */
  at?: LngLat;
  /** Chiave SeedMedia della copertina */
  cover?: string;
  sourceUrl?: string;
  /** Dati dimostrativi o da verificare con il Comune */
  demo: boolean;
}
