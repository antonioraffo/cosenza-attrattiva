import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { isPast } from "@/lib/events";
import { listEvents } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreaBand } from "@/components/crea/CreaBand";
import { EventCard } from "@/components/home/EventCard";
import { calendarItems, cardLabels } from "@/components/events/calendarItems";
import { IconArrowRight } from "@/components/ui/icons";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "crea" });
  return { title: t("title"), description: t("intro") };
}

/**
 * Pilastro Crea: "Fatto a Cosenza" (dal prototipo "Città da vivere" e dal programma Cosenza Crea).
 * Nessuna prenotazione di laboratori; le botteghe reali arriveranno dall'Albo Artigiani.
 */
export default async function CreaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("crea");
  const te = await getTranslations("events");
  const creaEvents = await calendarItems(
    (await listEvents()).filter((e) => (e.pillar === "crea" || e.category === "artigianato") && !isPast(e)),
    locale,
  );
  const labels = await cardLabels(locale);

  return (
    <>
      <Header />
      <main id="main">
        <CreaBand />

        <section className="ca-section ca-section--light" aria-labelledby="brand-title">
          <div className="site-container">
            <div className="ca-section-heading">
              <div>
                <h2 id="brand-title">{t("brandTitle")}</h2>
                <p className="ca-section-intro">{t("brandIntro")}</p>
              </div>
            </div>
            <ol className="ca-brand-points">
              {[0, 1, 2].map((i) => (
                <li key={i}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t(`brand.${i}.title`)}</h3>
                  <p>{t(`brand.${i}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ca-section ca-section--white" aria-labelledby="workshops-title">
          <div className="site-container ca-workshops">
            <div>
              <h2 id="workshops-title">{t("workshopsTitle")}</h2>
              <p className="ca-section-intro">{t("workshopsText")}</p>
              <p className="ca-demo-note mt-4">{t("workshopsTodo")}</p>
            </div>
            <Link href="/itinerari/le-mani-di-cosenza" className="ca-heading-action">
              {t("itineraryCta")} <IconArrowRight size={18} />
            </Link>
          </div>
        </section>

        {creaEvents.length > 0 && (
          <section className="ca-section ca-section--light" aria-labelledby="crea-events-title">
            <div className="site-container">
              <div className="ca-section-heading">
                <div>
                  <h2 id="crea-events-title">{t("eventsTitle")}</h2>
                </div>
                <Link href="/eventi" className="ca-heading-action">
                  {te("all")} <IconArrowRight size={18} />
                </Link>
              </div>
              <ul className="ca-events-grid">
                {creaEvents.map((e) => (
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
                      labels={labels}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="ca-crea-quote">
          <blockquote className="site-container">
            <p>{t("quote")}</p>
          </blockquote>
        </section>
      </main>
      <Footer />
    </>
  );
}
