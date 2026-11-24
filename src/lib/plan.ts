/**
 * «Il tuo tempo, il tuo giro»: dato il tempo disponibile (3 ore, 1 giorno, weekend) e l'ora di partenza,
 * compone un giro con gli itinerari a piedi già pronti. Tempi dai percorsi reali: i minuti tra le tappe
 * vengono dal percorso pedonale dell'itinerario (frazione lungo il percorso × lunghezza), i trasferimenti
 * tra un itinerario e il successivo dal percorso pedonale OSRM (tabella itinerary_links).
 * Funzioni pure: le usano la pagina (server) e il selettore (client).
 */

/** Passo turistico con soste brevi e minuti per tappa: gli stessi del seed per la durata degli itinerari. */
export const WALK_M_PER_MIN = 70;
export const MIN_PER_STOP = 8;

export const TIME_OPTIONS = ["3h", "1g", "weekend"] as const;
export type TimeOption = (typeof TIME_OPTIONS)[number];

/** Giorni e blocchi di visita (minuti) per ogni scelta; tra due blocchi dello stesso giorno c'è una pausa. */
export const TIME_SHAPES: Record<TimeOption, { days: number; slots: number[] }> = {
  "3h": { days: 1, slots: [180] },
  "1g": { days: 1, slots: [180, 180] },
  weekend: { days: 2, slots: [180, 180] },
};
export const BREAK_MIN = 90;
export const START_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;
export const DEFAULT_START = 10;

export interface PlanStopInput {
  title: string;
  placeSlug: string | null;
  /** Posizione lungo il percorso (0–1); null = tappa non geolocalizzata (lettura). */
  fraction: number | null;
  /** [lng, lat] della tappa, se geolocalizzata: serve alla mappa del giro. */
  position?: [number, number] | null;
}

export interface PlanItineraryInput {
  slug: string;
  title: string;
  durationMin: number;
  lengthM: number | null;
  kind: "a-piedi" | "misto" | "tematico";
  color: string;
  stops: PlanStopInput[];
}

/** Distanze a piedi (m) dalla fine di un itinerario all'inizio di un altro: links[from][to]. */
export type PlanLinks = Record<string, Record<string, number>>;

export interface PlanStop extends PlanStopInput {
  /** Minuti dall'inizio della giornata (00:00). */
  time: number;
  /** Minuti a piedi dalla tappa precedente (0 per la prima e per le tappe di lettura). */
  walkMin: number;
}

export type PlanItem =
  | { type: "itinerary"; slug: string; title: string; color: string; kind: PlanItineraryInput["kind"]; lengthM: number | null; start: number; end: number; stops: PlanStop[] }
  | { type: "transfer"; start: number; minutes: number; distanceM: number; to: string }
  | { type: "break"; start: number; minutes: number };

export interface PlanDay {
  items: PlanItem[];
  end: number;
}

export interface Plan {
  option: TimeOption;
  startHour: number;
  days: PlanDay[];
  /** Itinerari usati, nell'ordine del giro. */
  slugs: string[];
  /** Metri a piedi in tutto (percorsi + trasferimenti). */
  walkM: number;
  /** Luoghi del giro, nell'ordine, senza doppioni: servono per salvarli nel mio itinerario. */
  places: string[];
}

interface Candidate {
  it: PlanItineraryInput;
  distanceM: number;
}

export const walkMinutesFor = (m: number) => Math.ceil(m / WALK_M_PER_MIN);

export const isTimeOption = (v: unknown): v is TimeOption => TIME_OPTIONS.includes(v as TimeOption);

export function parseStartHour(v: unknown) {
  const n = Number(v);
  return (START_HOURS as readonly number[]).includes(n) ? n : DEFAULT_START;
}

export const formatClock = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Orari delle tappe di un itinerario che parte a `start`. */
export function scheduleStops(it: PlanItineraryInput, start: number): { stops: PlanStop[]; end: number } {
  let t = start;
  let prev: number | null = null;
  const stops = it.stops.map((s, i) => {
    let walkMin = 0;
    if (s.fraction !== null && prev !== null && it.lengthM) walkMin = Math.round(((s.fraction - prev) * it.lengthM) / WALK_M_PER_MIN);
    if (s.fraction !== null) prev = s.fraction;
    if (i > 0) t += walkMin;
    const stop = { ...s, time: t, walkMin };
    t += MIN_PER_STOP;
    return stop;
  });
  return { stops, end: Math.max(start + it.durationMin, t) };
}

/** Itinerari adatti al giro: si percorrono a piedi (almeno una tappa su mappa e un percorso). */
export const walkable = (it: PlanItineraryInput) => it.kind !== "tematico" && it.lengthM !== null;

/**
 * Compone il giro. Ogni blocco si riempie in modo goloso: si parte dal primo itinerario disponibile
 * nell'ordine editoriale, poi si sceglie il più vicino (trasferimento più breve) che sta nel tempo rimasto.
 * Un itinerario non si ripete nel giro.
 */
export function buildPlan(all: PlanItineraryInput[], links: PlanLinks, option: TimeOption, startHour = DEFAULT_START): Plan {
  const shape = TIME_SHAPES[option];
  const pool = all.filter(walkable);
  const used = new Set<string>();
  const days: PlanDay[] = [];
  let walkM = 0;

  for (let d = 0; d < shape.days; d++) {
    const items: PlanItem[] = [];
    let t = startHour * 60;
    let current: string | null = null;

    for (const [si, budget] of shape.slots.entries()) {
      let left = budget;
      const slot: PlanItem[] = [];
      // tra due blocchi dello stesso giorno c'è la pausa: il secondo parte dopo
      const breakAt = t;
      if (si > 0) t += BREAK_MIN;
      for (;;) {
        const from: string | null = current;
        const options: Candidate[] = [];
        for (const it of pool) {
          if (used.has(it.slug)) continue;
          const distanceM = from ? links[from]?.[it.slug] : 0;
          if (distanceM === undefined) continue;
          const cost = it.durationMin + (distanceM ? walkMinutesFor(distanceM) : 0);
          if (cost <= left) options.push({ it, distanceM });
        }
        if (!options.length) break;
        // all'inizio del blocco senza punto di partenza vale l'ordine editoriale; poi il più vicino
        const pick: Candidate = from ? options.reduce((a, b) => (b.distanceM < a.distanceM ? b : a)) : options[0]!;
        if (pick.distanceM > 0) {
          const minutes = walkMinutesFor(pick.distanceM);
          slot.push({ type: "transfer", start: t, minutes, distanceM: pick.distanceM, to: pick.it.slug });
          t += minutes;
          walkM += pick.distanceM;
        }
        const { stops, end } = scheduleStops(pick.it, t);
        slot.push({ type: "itinerary", slug: pick.it.slug, title: pick.it.title, color: pick.it.color, kind: pick.it.kind, lengthM: pick.it.lengthM, start: t, end, stops });
        walkM += pick.it.lengthM ?? 0;
        left -= end - t + (pick.distanceM ? walkMinutesFor(pick.distanceM) : 0);
        t = end;
        used.add(pick.it.slug);
        current = pick.it.slug;
      }
      if (!slot.length) {
        t = breakAt;
        break;
      }
      if (si > 0) items.push({ type: "break", start: breakAt, minutes: BREAK_MIN });
      items.push(...slot);
    }
    if (!items.length) break;
    days.push({ items, end: t });
  }

  const slugs = days.flatMap((d) => d.items.flatMap((i) => (i.type === "itinerary" ? [i.slug] : [])));
  const places = [
    ...new Set(
      days.flatMap((d) => d.items.flatMap((i) => (i.type === "itinerary" ? i.stops.map((s) => s.placeSlug).filter((s) => s !== null) : []))),
    ),
  ];
  return { option, startHour, days, slugs, walkM, places };
}

/** Itinerari che stanno da soli nel tempo scelto (anche tematici, da leggere), esclusi quelli già nel giro. */
export function fittingItineraries<T extends { slug: string; durationMin: number }>(all: T[], option: TimeOption, plan: Plan) {
  const max = TIME_SHAPES[option].slots.reduce((a, b) => a + b, 0) * TIME_SHAPES[option].days;
  return all.filter((it) => it.durationMin <= max && !plan.slugs.includes(it.slug));
}
