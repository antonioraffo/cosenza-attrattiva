import { getTranslations } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { eventDates, isPast, todayIso } from "@/lib/events";
import type { EventSummary } from "@/server/queries";
import type { CalendarItem } from "./EventsCalendar";

/** Dati serializzabili delle card evento (server → client). */
export async function calendarItems(list: EventSummary[], locale: string): Promise<CalendarItem[]> {
  const t = await getTranslations({ locale, namespace: "events" });
  const today = todayIso();
  return list.map((e) => {
    const { points, period } = eventDates(e, locale);
    return {
      slug: e.slug,
      category: e.category,
      major: e.major,
      past: isPast(e, today),
      dates: points,
      period,
      title: tr(e.title, locale),
      place: e.placeName ? tr(e.placeName, locale).split(" – ")[0]! : (e.venue ?? ""),
      categoryLabel: t(`category.${e.category}`),
      description: tr(e.summary, locale),
      schedule: e.schedule ? tr(e.schedule, locale) : null,
      source: e.sourceUrl,
    };
  });
}

export async function cardLabels(locale: string) {
  const t = await getTranslations({ locale, namespace: "events" });
  return { more: t("more"), less: t("less"), source: t("source"), details: t("details"), major: t("majorBadge") };
}
