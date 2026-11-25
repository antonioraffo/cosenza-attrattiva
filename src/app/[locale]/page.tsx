import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroDrawing } from "@/components/home/HeroDrawing";
import { EventsSection } from "@/components/home/EventsSection";
import { ExploreSection } from "@/components/home/ExploreSection";
import { TimeSection } from "@/components/home/TimeSection";
import { LowerRoot } from "@/components/home/LowerRoot";
import { CreaBand } from "@/components/crea/CreaBand";

/**
 * Home: hero (disegno al tratto in loop) → «Esplora a piedi», «Il tuo tempo» e «Il tuo giro» (modello della
 * demo di Stefano) → eventi (grandi eventi, poi il calendario) → fascia nera «Bottega Cosenza» → footer.
 * Restano nel progetto ma non in home: HomeIntro/SilhouetteIntro, HomePanels (MAB/Duomo/San Domenico),
 * TimeBar, ThreeWays, ItinerariesSection, SectionNav, MissionSection (carosello dei pilastri),
 * PillarBlocks (mission a blocchi alternati, documentata in docs/blocchi-rimossi/mission.md).
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const th = await getTranslations("homeHero");
  // testi delle card dell'hero: scheda del luogo e tre curiosità per scena
  const scene = (k: "duomo" | "ponte", href: string) => ({
    title: th(`${k}.title`),
    description: th(`${k}.description`),
    href,
    facts: [0, 1, 2].map((i) => ({ title: th(`${k}.facts.${i}.title`), text: th(`${k}.facts.${i}.text`) })),
  });

  return (
    <>
      <Header />
      <main id="main">
        <HeroDrawing
          title={t("heroTitle")}
          scenes={{ duomo: scene("duomo", "/luoghi/duomo"), ponte: scene("ponte", "/luoghi/ponte-calatrava") }}
          labels={{
            nav: th("sceneNav"),
            duomo: th("sceneDuomo"),
            ponte: th("scenePonte"),
            announce: { duomo: t("hero.shown", { title: th("duomo.title") }), ponte: t("hero.shown", { title: th("ponte.title") }) },
            art: { duomo: t("drawingAlt", { title: th("duomo.title") }), ponte: t("drawingAlt", { title: th("ponte.title") }) },
            curiosity: t("hero.curiosity"),
            place: t("hero.place"),
            discover: th("discover"),
            pause: t("hero.pause"),
            play: t("hero.play"),
          }}
        />
        <LowerRoot overlap={false}>
          <ExploreSection locale={locale} />
          <TimeSection locale={locale} />
          <EventsSection locale={locale} />
        </LowerRoot>
        <CreaBand as="h2" withLink />
      </main>
      <Footer />
    </>
  );
}
