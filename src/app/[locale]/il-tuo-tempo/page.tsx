import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { features } from "@/lib/env";
import { isTimeOption, parseStartHour } from "@/lib/plan";
import { getPlanData } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatDuration } from "@/components/itinerary/ItineraryStats";
import { TimePlanner, type TimeItinerary } from "@/components/time/TimePlanner";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ t?: string; ora?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "time" });
  return { title: t("title"), description: t("intro") };
}

/** «Il tuo tempo, il tuo giro» (Cosenza Connect): 3 ore, 1 giorno o weekend → giro a piedi con orari. */
export default async function TimePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { t: opt, ora } = await searchParams;
  const t = await getTranslations("time");
  const { itineraries, links } = await getPlanData(locale);
  const items: TimeItinerary[] = await Promise.all(itineraries.map(async (it) => ({ ...it, durationLabel: await formatDuration(it.durationMin) })));

  return (
    <>
      <Header />
      <main id="main" className="site-container ca-time-page">
        <div>
          <p className="ca-pillar-badge ca-pillar-badge--connect">{t("eyebrow")}</p>
          <h1 className="ca-page-title">{t("title")}</h1>
          <p className="ca-section-intro">{t("intro")}</p>
        </div>
        <TimePlanner
          itineraries={items}
          links={links}
          initialOption={isTimeOption(opt) ? opt : "3h"}
          initialStart={parseStartHour(ora)}
          canSave={!features.passport}
        />
      </main>
      <Footer />
    </>
  );
}
