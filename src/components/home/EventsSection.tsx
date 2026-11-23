import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isPast } from "@/lib/events";
import { listEvents } from "@/server/queries";
import { MajorEventsBand } from "@/components/events/MajorEventsBand";
import { calendarItems, cardLabels } from "@/components/events/calendarItems";
import { IconArrowRight } from "@/components/ui/icons";
import { EventCard } from "./EventCard";
import { Typewriter } from "./Typewriter";

/**
 * Eventi in home, come vivicosenza (titolo, intro, "Scopri di più", 4 card editoriali), dal database:
 * prima i grandi eventi in evidenza, poi i prossimi appuntamenti del calendario.
 */
export async function EventsSection({ locale }: { locale: string }) {
  const t = await getTranslations("events");
  const all = (await listEvents()).filter((e) => !isPast(e));
  const majors = all.filter((e) => e.major).slice(0, 4);
  const next = await calendarItems(all.filter((e) => !e.major).slice(0, 4), locale);
  const labels = await cardLabels(locale);

  return (
    <section id="eventi" className="ca-section ca-section--light ca-events" aria-labelledby="eventi-title">
      <div className="site-container">
        <div className="ca-section-heading">
          <div>
            <h2 id="eventi-title">
              <Typewriter text={t("title")} />
            </h2>
            <p className="ca-section-intro" data-reveal>
              {t("intro")}
            </p>
          </div>
          <Link href="/eventi" className="ca-heading-action">
            {t("all")} <IconArrowRight size={18} />
          </Link>
        </div>

        {majors.length > 0 && (
          <div className="ca-events-block" data-reveal>
            <h3 className="ca-events-subtitle">{t("majorTitle")}</h3>
            <MajorEventsBand events={majors} locale={locale} headingLevel={3} />
          </div>
        )}

        {next.length > 0 && (
          <ul className="ca-events-grid">
            {next.map((e) => (
              <li key={e.slug} data-reveal>
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
                  labels={labels}
                />
              </li>
            ))}
          </ul>
        )}
        {all.some((e) => e.demo) && <p className="ca-demo-note mt-6">{t("demoNote")}</p>}
      </div>
    </section>
  );
}
