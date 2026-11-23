import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listItineraries } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeHero } from "@/components/home/HomeHero";
import { MissionSection } from "@/components/home/MissionSection";
import { ItineraryCard } from "@/components/itinerary/ItineraryCard";
import { ThemeFilter } from "@/components/itinerary/ThemeFilter";
import { SmartImage } from "@/components/ui/SmartImage";
import { IconArrowRight, IconBook, IconChevronDown, IconStamp, IconWalk } from "@/components/ui/icons";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const all = await listItineraries();
  const featured = all.filter((i) => i.featured);
  const hero = featured[0] ?? all[0];

  const cards = await Promise.all(
    all.map(async (it) => ({ slug: it.slug, theme: it.theme, node: await ItineraryCard({ it, locale }) })),
  );

  return (
    <>
      <Header />
      <main id="main">
        <HomeHero locale={locale} />
        <MissionSection />

        {/* ── In evidenza ──────────────────────────────────────── */}
        {featured.length > 0 && (
          <section aria-labelledby="featured-title" className="mx-auto max-w-7xl pt-16 md:px-8">
            <h2 id="featured-title" className="px-4 text-3xl md:px-0 md:text-4xl">
              {t("featured")}
            </h2>
            <ul className="scrollbar-none mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
              {await Promise.all(
                featured.map(async (it, i) => (
                  <li key={it.slug} className="w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto">
                    {await ItineraryCard({ it, locale, size: "lg", priority: i < 2 })}
                  </li>
                )),
              )}
            </ul>
          </section>
        )}

        {/* ── Tutti gli itinerari ──────────────────────────────── */}
        <section id="itinerari" aria-labelledby="all-title" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-14 md:px-8">
          <h2 id="all-title" className="text-3xl md:text-4xl">
            {t("allItineraries")}
          </h2>
          <div className="mt-5">
            <ThemeFilter cards={cards} />
          </div>
        </section>

        {/* ── Come funziona ────────────────────────────────────── */}
        <section id="come-funziona" aria-labelledby="how-title" className="mx-auto mt-20 max-w-7xl scroll-mt-20 px-4 md:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-primario-900 px-6 py-12 text-primario-50 md:px-12">
            <h2 id="how-title" className="max-w-xl text-3xl md:text-4xl">
              {t("howTitle")}
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {[
                { icon: IconBook, title: t("howStoryTitle"), text: t("howStoryText") },
                { icon: IconWalk, title: t("howWalkTitle"), text: t("howWalkText") },
                { icon: IconStamp, title: t("howPassportTitle"), text: t("howPassportText") },
              ].map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative">
                  <span className="font-display text-6xl text-primario-600" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 flex items-center gap-2 text-2xl text-white">
                    <Icon size={22} className="text-arancio-300" /> {title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-primario-100/85">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Passaporto ───────────────────────────────────────── */}
        <section aria-labelledby="pass-title" className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-start gap-6 rounded-[2rem] border border-neutro-200 bg-[radial-gradient(circle_at_85%_20%,var(--color-primario-50),transparent_55%)] bg-white p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 id="pass-title" className="text-3xl">
                {t("passportTeaser")}
              </h2>
              <p className="mt-2 max-w-lg text-neutro-600">{t("passportTeaserText")}</p>
            </div>
            <Link
              href="/passaporto"
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-primario-700 px-6 font-semibold text-white hover:bg-primario-600"
            >
              <IconStamp size={18} /> {t("openPassport")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
