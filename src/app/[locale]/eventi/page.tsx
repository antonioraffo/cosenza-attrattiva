import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { listEvents } from "@/server/queries";
import { isPast } from "@/lib/events";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MajorEventsBand } from "@/components/events/MajorEventsBand";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import { calendarItems, cardLabels } from "@/components/events/calendarItems";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return { title: t("title"), description: t("intro") };
}

/** Pilastro Vive: grandi eventi in evidenza e calendario unico della città. */
export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const all = await listEvents();
  const majors = all.filter((e) => e.major && !isPast(e));
  const items = await calendarItems(all, locale);
  const categories = [...new Set(all.map((e) => e.category))].map((key) => ({ key, label: t(`category.${key}`) }));

  return (
    <>
      <Header />
      <main id="main">
        <section className="ca-section ca-section--light" aria-labelledby="events-title">
          <div className="site-container">
            <div className="ca-section-heading">
              <div>
                <p className="eyebrow ca-section-eyebrow">{t("pillar.vive")}</p>
                <h1 id="events-title" className="ca-page-title">
                  {t("title")}
                </h1>
                <p className="ca-section-intro">{t("intro")}</p>
              </div>
            </div>
            {all.some((e) => e.demo) && <p className="ca-demo-note">{t("demoNote")}</p>}
          </div>
        </section>

        {majors.length > 0 && (
          <section id="grandi-eventi" className="ca-section ca-section--white ca-section--tight" aria-labelledby="major-title">
            <div className="site-container">
              <div className="ca-section-heading">
                <div>
                  <h2 id="major-title">{t("majorTitle")}</h2>
                  <p className="ca-section-intro">{t("majorIntro")}</p>
                </div>
              </div>
              <MajorEventsBand events={majors} locale={locale} />
            </div>
          </section>
        )}

        <section id="calendario" className="ca-section ca-section--light" aria-labelledby="calendar-title">
          <div className="site-container">
            <div className="ca-section-heading">
              <div>
                <h2 id="calendar-title">{t("calendarTitle")}</h2>
                <p className="ca-section-intro">{t("calendarIntro")}</p>
              </div>
            </div>
            <EventsCalendar
              items={items}
              categories={categories}
              labels={{
                filter: t("filterLabel"),
                all: t("allTypes"),
                onlyMajor: t("onlyMajor"),
                empty: t("empty"),
                past: t("past"),
                card: await cardLabels(locale),
              }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
