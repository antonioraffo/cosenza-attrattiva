import { getTranslations } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { eventDateLine, eventDates, isPast } from "@/lib/events";
import { listEvents, type EventSummary } from "@/server/queries";

/**
 * Slot «In evidenza» dell'hero v2 (?template=3): un evento (con conto alla rovescia) o una notizia.
 * Scelta: l'evento indicato in FEATURED_OVERRIDES se è ancora futuro, altrimenti il prossimo grande evento
 * con una data. Gli eventi non hanno ancora un flag «in evidenza» nel database: finché non c'è, lo
 * sostituisce questa tabella (dati dimostrativi: orario e foto del Capodanno sono segnaposto).
 */
export interface FeaturedItem {
  kind: "evento" | "notizia";
  label: string;
  title: string;
  place: string | null;
  category: string | null;
  date: { day: string; month: string } | null;
  /** orario di inizio già formattato ("21:00"), se noto */
  time: string | null;
  /** istante ISO del conto alla rovescia (solo eventi) */
  countdownTo: string | null;
  countdownLabel: string;
  image: string | null;
  href: string;
  allHref: string;
  allLabel: string;
  next: { date: string; title: string; href: string }[];
}

interface Override {
  time?: string;
  countdownTo?: string;
  countdown?: "midnight";
  image?: string;
}

const FEATURED_OVERRIDES: Record<string, Override> = {
  "capodanno-in-piazza": {
    time: "21:00",
    countdownTo: "2027-01-01T00:00:00+01:00",
    countdown: "midnight",
    image: "/media/piazza-bilotti-1.jpg",
  },
};

export async function getFeatured(locale: string): Promise<FeaturedItem | null> {
  const t = await getTranslations("homeHero2.featured");
  const te = await getTranslations("events");
  const future = (await listEvents()).filter((e) => !isPast(e));
  const pick: EventSummary | undefined =
    future.find((e) => e.slug in FEATURED_OVERRIDES) ?? future.find((e) => e.major && e.startDate);
  if (!pick) return null;
  const o = FEATURED_OVERRIDES[pick.slug] ?? {};
  const point = eventDates(pick, locale).points[0] ?? null;
  return {
    kind: "evento",
    label: t("label"),
    title: tr(pick.title, locale),
    place: pick.venue ?? (pick.placeName ? tr(pick.placeName, locale) : null),
    category: te(`category.${pick.category}`),
    date: point ? { day: String(Number(point.day)), month: point.month } : null,
    time: o.time ?? null,
    // senza orario si conta fino all'inizio della giornata (ora di Roma, inverno: +01:00)
    countdownTo: o.countdownTo ?? (pick.startDate ? `${pick.startDate}T${o.time ?? "00:00"}:00+01:00` : null),
    countdownLabel: o.countdown === "midnight" ? t("countdownMidnight") : t("countdown"),
    image: o.image ?? pick.cover?.url ?? null,
    href: `/eventi/${pick.slug}`,
    allHref: "/eventi#grandi-eventi",
    allLabel: t("all"),
    next: future
      .filter((e) => e.major && e.slug !== pick.slug)
      .slice(0, 3)
      .map((e) => ({ date: eventDateLine(e, locale), title: tr(e.title, locale), href: `/eventi/${e.slug}` })),
  };
}
