import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeIntro, HomePanels } from "@/components/home/HomeHero";
import { MissionSection } from "@/components/home/MissionSection";
import { ThreeWays } from "@/components/home/ThreeWays";
import { ItinerariesSection } from "@/components/home/ItinerariesSection";
import { EventsSection } from "@/components/home/EventsSection";
import { LowerRoot } from "@/components/home/LowerRoot";
import { SectionNav } from "@/components/home/SectionNav";

/**
 * Home sul modello di vivicosenza (docs/reference/vivicosenza/ANALISI.md):
 * header → hero silhouette → mission e tre aree → pannelli MAB/Duomo/San Domenico →
 * "Tre modi di vivere un itinerario" (foglio inclinato) → itinerari → eventi → footer.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tn = await getTranslations("sectionNav");

  return (
    <>
      <Header />
      <main id="main">
        <HomeIntro title={t("heroTitle")} />
        <MissionSection />
        <HomePanels locale={locale} />
        <LowerRoot>
          <div className="ca-explore-transition">
            <ThreeWays locale={locale} />
            <ItinerariesSection locale={locale} />
            <div className="ca-explore-tail" aria-hidden="true" />
          </div>
          <EventsSection locale={locale} />
        </LowerRoot>
        <SectionNav
          sections={[
            { id: "mission", label: tn("mission") },
            { id: "esplora", label: tn("threeWays") },
            { id: "itinerari", label: tn("itinerari") },
            { id: "eventi", label: tn("eventi") },
          ]}
          labels={{ label: tn("label"), open: tn("open"), close: tn("close") }}
        />
      </main>
      <Footer />
    </>
  );
}
