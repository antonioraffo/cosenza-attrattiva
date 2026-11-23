import { getTranslations } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { EVENTS } from "@/content/events";
import { EventCard } from "./EventCard";
import { Typewriter } from "./Typewriter";

/** Eventi come vivicosenza: 4 card editoriali senza foto (4 → 2 → 1 colonne). */
export async function EventsSection({ locale }: { locale: string }) {
  const t = await getTranslations("events");
  const month = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" });
  const point = (iso: string) => {
    const d = new Date(`${iso}T00:00:00Z`);
    return { day: String(d.getUTCDate()).padStart(2, "0"), month: month.format(d).replace(".", "").toUpperCase() };
  };

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
          <span className="ca-events-demo">{t("demo")}</span>
        </div>
        <div className="ca-events-grid">
          {EVENTS.map((e) => (
            <div key={e.slug} data-reveal>
              <EventCard
                dates={[point(e.start), ...(e.end ? [point(e.end)] : [])]}
                title={tr(e.title, locale)}
                place={e.place}
                category={tr(e.category, locale)}
                description={tr(e.description, locale)}
                schedule={tr(e.schedule, locale)}
                source={e.source}
                labels={{ more: t("more"), less: t("less"), source: t("source") }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
