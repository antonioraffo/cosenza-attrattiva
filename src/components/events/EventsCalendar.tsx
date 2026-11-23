"use client";

import { useState } from "react";
import { EventCard } from "@/components/home/EventCard";

export interface CalendarItem {
  slug: string;
  category: string;
  major: boolean;
  past: boolean;
  dates: { day: string; month: string }[];
  period: string | null;
  title: string;
  place: string;
  categoryLabel: string;
  description: string;
  schedule: string | null;
  source: string | null;
}

/** Calendario della città: filtro per tipo e "solo grandi eventi"; gli eventi passati in fondo, chiusi. */
export function EventsCalendar({
  items,
  categories,
  labels,
}: {
  items: CalendarItem[];
  categories: { key: string; label: string }[];
  labels: {
    filter: string;
    all: string;
    onlyMajor: string;
    empty: string;
    past: string;
    card: { more: string; less: string; source: string; details: string; major: string };
  };
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [onlyMajor, setOnlyMajor] = useState(false);
  const shown = items.filter((e) => (!category || e.category === category) && (!onlyMajor || e.major));
  const upcoming = shown.filter((e) => !e.past);
  const past = shown.filter((e) => e.past);
  const card = (e: CalendarItem) => (
    <li key={e.slug}>
      <EventCard
        dates={e.dates}
        period={e.period}
        href={`/eventi/${e.slug}`}
        major={e.major}
        title={e.title}
        place={e.place}
        category={e.categoryLabel}
        description={e.description}
        schedule={e.schedule}
        source={e.source}
        labels={labels.card}
      />
    </li>
  );

  return (
    <div>
      <div className="ca-calendar-filters">
        <div role="group" aria-label={labels.filter} className="ca-chips">
          <button type="button" className="ca-chip" aria-pressed={category === null} onClick={() => setCategory(null)}>
            {labels.all}
          </button>
          {categories.map((c) => (
            <button key={c.key} type="button" className="ca-chip" aria-pressed={category === c.key} onClick={() => setCategory(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
        <button type="button" className="ca-chip ca-chip--major" aria-pressed={onlyMajor} onClick={() => setOnlyMajor((v) => !v)}>
          {labels.onlyMajor}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {upcoming.length}
      </p>
      {upcoming.length ? <ul className="ca-events-grid">{upcoming.map(card)}</ul> : <p className="text-neutro-500">{labels.empty}</p>}
      {past.length > 0 && (
        <details className="ca-calendar-past">
          <summary>
            {labels.past} ({past.length})
          </summary>
          <ul className="ca-events-grid">{past.map(card)}</ul>
        </details>
      )}
    </div>
  );
}
