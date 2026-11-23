import type { Localized } from "@/server/db/schema";
import { tr } from "@/lib/i18n";

type DatedEvent = { startDate: string | null; endDate: string | null; period: Localized | null };

/** Oggi in formato ISO (fuso di Roma), per separare eventi futuri e passati. */
export function todayIso() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
}

/** Un evento è passato quando la sua ultima data è prima di oggi; senza data non lo è mai. */
export function isPast(e: DatedEvent, today = todayIso()) {
  const last = e.endDate ?? e.startDate;
  return last !== null && last < today;
}

export interface DatePoint {
  day: string;
  month: string;
}

/** Date dell'evento come punti "giorno + mese anno" (uno o due), oppure l'etichetta del periodo. */
export function eventDates(e: DatedEvent, locale: string): { points: DatePoint[]; period: string | null } {
  if (!e.startDate) return { points: [], period: e.period ? tr(e.period, locale) : null };
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" });
  const point = (iso: string): DatePoint => {
    const d = new Date(`${iso}T00:00:00Z`);
    return { day: String(d.getUTCDate()).padStart(2, "0"), month: fmt.format(d).replace(".", "").toUpperCase() };
  };
  return { points: [point(e.startDate), ...(e.endDate && e.endDate !== e.startDate ? [point(e.endDate)] : [])], period: null };
}

/** Data in una riga, per le card dei grandi eventi ("12 feb 2027", "13–15 nov 2026", "Luglio"). */
export function eventDateLine(e: DatedEvent, locale: string): string {
  if (!e.startDate) return e.period ? tr(e.period, locale) : "";
  const f = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
  if (!e.endDate || e.endDate === e.startDate) return f(e.startDate, { day: "numeric", month: "short", year: "numeric" });
  return `${f(e.startDate, { day: "numeric" })}–${f(e.endDate, { day: "numeric", month: "short", year: "numeric" })}`;
}
