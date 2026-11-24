import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroDrawing } from "@/components/home/HeroDrawing";
import { MissionSection } from "@/components/home/MissionSection";
import { EventsSection } from "@/components/home/EventsSection";
import { ExploreSection } from "@/components/home/ExploreSection";
import { TimeSection } from "@/components/home/TimeSection";
import { LowerRoot } from "@/components/home/LowerRoot";
import { CreaBand } from "@/components/crea/CreaBand";

/**
 * Home: hero (disegno al tratto in loop) → mission → eventi (grandi eventi, poi il calendario) →
 * «Esplora a piedi», «Il tuo tempo» e «Il tuo giro» (modello della demo di Stefano) → fascia nera
 * «Fatto a Cosenza» → footer.
 * Restano nel progetto ma non in home: HomeIntro/SilhouetteIntro, HomePanels (MAB/Duomo/San Domenico),
 * TimeBar, ThreeWays, ItinerariesSection, SectionNav.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const th = await getTranslations("homeHero");

  return (
    <>
      <Header />
      <main id="main">
        <HeroDrawing
          title={t("heroTitle")}
          labels={{
            nav: th("sceneNav"),
            duomo: th("sceneDuomo"),
            ponte: th("scenePonte"),
            announce: { duomo: th("sceneAnnounce", { title: th("duomo.title") }), ponte: th("sceneAnnounce", { title: th("ponte.title") }) },
            art: { duomo: t("drawingAlt", { title: th("duomo.title") }), ponte: t("drawingAlt", { title: th("ponte.title") }) },
          }}
        />
        <MissionSection />
        <LowerRoot>
          <EventsSection locale={locale} />
          <ExploreSection locale={locale} />
          <TimeSection locale={locale} />
        </LowerRoot>
        <CreaBand as="h2" withLink />
      </main>
      <Footer />
    </>
  );
}
