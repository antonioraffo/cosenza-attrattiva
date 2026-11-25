import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { eventDateLine } from "@/lib/events";
import type { EventSummary } from "@/server/queries";

/** Colore della card per tipo di evento: tutti reggono il testo bianco ≥ 4,5:1 (docs/DESIGN-TOKENS.md). */
const TONE: Record<EventSummary["category"], string> = {
  tradizioni: "var(--color-primario-600)",
  cultura: "var(--color-azzurro-700)",
  "shopping-notti": "var(--color-viola-500)",
  artigianato: "var(--color-arancio-700)",
  spettacolo: "var(--color-neutro-900)",
};

/**
 * Grandi eventi: gli eventi di grande rilevanza, in card grandi e colorate senza foto (dal calendario del
 * prototipo "Città da vivere"), ciascuna verso la sua pagina dedicata.
 */
export async function MajorEventsBand({ events, locale, headingLevel = 3 }: { events: EventSummary[]; locale: string; headingLevel?: 2 | 3 }) {
  const t = await getTranslations("events");
  const H = headingLevel === 2 ? "h2" : "h3";
  if (!events.length) return null;
  return (
    <ul className="ca-major-band">
      {events.map((e) => (
        <li key={e.slug}>
          <article className="ca-major-card" style={{ "--tone": TONE[e.category] } as React.CSSProperties}>
            <p className="ca-major-date">{eventDateLine(e, locale)}</p>
            <div className="ca-major-copy">
              <p className="ca-major-kind">{t(`category.${e.category}`)}</p>
              <H className="ca-major-title">
                <Link href={`/eventi/${e.slug}`} className="ca-card-link">
                  {tr(e.title, locale)}
                </Link>
              </H>
              {e.venue && <p className="ca-major-venue">{e.venue}</p>}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
