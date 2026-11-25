import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSwitch } from "@/components/home/HeroSwitch";
import { getFeatured } from "@/components/home/featured";
import { EventsSection } from "@/components/home/EventsSection";
import { ExploreSection } from "@/components/home/ExploreSection";
import { TimeSection } from "@/components/home/TimeSection";
import { LowerRoot } from "@/components/home/LowerRoot";
import { CreaBand } from "@/components/crea/CreaBand";

/**
 * Home: hero v2 (filigrana del disegno al tratto, foto, curiosità e slot «In evidenza»; con ?template=2 e 3 il disegno al tratto in loop) → «Esplora a piedi», «Il tuo tempo» e «Il tuo giro» (modello della
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
  const t2 = await getTranslations("homeHero2");
  const tt = await getTranslations("time");
  const featured = await getFeatured(locale);
  // testi delle card dell'hero: scheda del luogo e tre curiosità per scena
  const scene = (k: "duomo" | "ponte", href: string) => ({
    title: th(`${k}.title`),
    description: th(`${k}.description`),
    href,
    facts: [0, 1, 2].map((i) => ({ title: th(`${k}.facts.${i}.title`), text: th(`${k}.facts.${i}.text`) })),
  });

  const scenes = { duomo: scene("duomo", "/luoghi/duomo"), ponte: scene("ponte", "/luoghi/ponte-calatrava") };

  return (
    <>
      <Header />
      <main id="main">
        <HeroSwitch
          drawing={{
            title: t("heroTitle"),
            scenes,
            labels: {
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
            },
          }}
          v2={{
            title: t("heroTitle"),
            scenes,
            featured,
            labels: {
              eyebrow: t2("eyebrow"),
              lead: t2("lead"),
              time: t2("time"),
              timeOptions: { "3h": tt("options.3h"), "1g": tt("options.1g"), weekend: tt("options.weekend") },
              nav: th("sceneNav"),
              scene: { duomo: th("sceneDuomo"), ponte: th("scenePonte") },
              era: { duomo: t2("era.duomo"), ponte: t2("era.ponte") },
              placeKicker: { duomo: t2("placeKicker", { era: t2("era.duomo") }), ponte: t2("placeKicker", { era: t2("era.ponte") }) },
              art: { duomo: t("drawingAlt", { title: th("duomo.title") }), ponte: t("drawingAlt", { title: th("ponte.title") }) },
              curiosity: t("hero.curiosity"),
              discover: th("discover"),
              drawing: t2("drawing"),
              step: { duomo: t2("step", { n: 1, total: 2 }), ponte: t2("step", { n: 2, total: 2 }) },
              pause: t("hero.pause"),
              play: t("hero.play"),
              featured: {
                from: t2("featured.from", { time: "{time}" }),
                countdownLabel: t2("featured.countdownLabel"),
                started: t2("featured.started"),
                days: t2("featured.days"),
                hours: t2("featured.hours"),
                minutes: t2("featured.minutes"),
                seconds: t2("featured.seconds"),
                discover: t2("featured.discover"),
                next: t2("featured.next"),
              },
            },
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
