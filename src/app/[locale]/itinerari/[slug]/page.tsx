import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { excerpt } from "@/lib/text";
import { getItinerary } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ItineraryStats } from "@/components/itinerary/ItineraryStats";
import { OfflineButton } from "@/components/itinerary/OfflineButton";
import { RouteOverviewMap } from "@/components/map/RouteOverviewMap";
import { SmartImage } from "@/components/ui/SmartImage";
import { IconArrowRight, IconBook, IconWalk } from "@/components/ui/icons";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const it = await getItinerary(slug);
  if (!it) return {};
  return {
    title: tr(it.title, locale),
    description: tr(it.subtitle, locale),
    openGraph: { images: it.cover ? [{ url: it.cover.url, width: it.cover.width ?? undefined, height: it.cover.height ?? undefined }] : [] },
  };
}

export default async function ItineraryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const it = await getItinerary(slug);
  if (!it) notFound();
  const t = await getTranslations("itinerary");
  const tt = await getTranslations("themes");

  const stops = it.chapters.map((c, i) => ({
    id: c.id,
    position: c.geom,
    label: String(i + 1),
    name: c.placeName ? tr(c.placeName, locale) : tr(c.title, locale),
  }));

  return (
    <>
      <Header overlay />
      <main id="main">
        <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-pietra-950 text-white">
          <div className="absolute inset-0 -z-10">
            <SmartImage media={it.cover} locale={locale} priority sizes="100vw" fallbackColor={it.color} className="object-cover opacity-85" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pietra-950 via-pietra-950/40 to-transparent" />
          <div className="mx-auto w-full max-w-5xl px-4 pt-28 pb-10 md:px-8">
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: it.color }}>
              {tt(it.theme)}
            </span>
            <h1 className="mt-4 text-5xl leading-[1.02] font-light md:text-7xl">{tr(it.title, locale)}</h1>
            <p className="mt-3 max-w-2xl text-xl text-pietra-100/90">{tr(it.subtitle, locale)}</p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="-mt-6 relative">
            <ItineraryStats
              durationMin={it.durationMin}
              lengthM={it.lengthM}
              difficulty={it.difficulty}
              stops={it.chapters.length}
              locale={locale}
              variant="large"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/itinerari/${it.slug}/racconto`}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-magliocco-700 px-6 font-semibold text-white transition hover:bg-magliocco-600"
            >
              <IconBook size={18} /> {t("readStory")}
            </Link>
            <Link
              href={`/itinerari/${it.slug}/passeggiata`}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-sila-700 px-6 font-semibold text-white transition hover:bg-sila-600"
            >
              <IconWalk size={18} /> {t("startWalk")}
            </Link>
            <OfflineButton slug={it.slug} />
          </div>

          <p className="mt-10 max-w-3xl font-serif text-2xl leading-relaxed text-pietra-800">{tr(it.intro, locale)}</p>

          <section aria-labelledby="map-title" className="mt-12">
            <h2 id="map-title" className="sr-only">
              {t("routeMap")}
            </h2>
            <div className="h-[340px] overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)] md:h-[440px]">
              <RouteOverviewMap route={it.route} stops={stops} color={it.color} label={t("routeMap")} />
            </div>
          </section>

          <section aria-labelledby="chapters-title" className="mt-14">
            <h2 id="chapters-title" className="text-3xl">
              {t("chapters")}
            </h2>
            <ol className="relative mt-8 space-y-6 border-l-2 border-dashed pl-8" style={{ borderColor: `${it.color}55` }}>
              {it.chapters.map((c, i) => (
                <li key={c.id} className="relative">
                  <span
                    className="absolute top-1 -left-[2.95rem] grid size-9 place-items-center rounded-full font-serif text-sm font-semibold text-white ring-4 ring-pietra-50"
                    style={{ backgroundColor: it.color }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <article className="flex gap-4 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
                    <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-xl sm:block">
                      <SmartImage media={c.image} locale={locale} sizes="96px" fallbackColor={it.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="eyebrow text-pietra-500">
                        {t("chapter", { n: i + 1 })} · {c.placeName ? tr(c.placeName, locale) : t("transition")}
                      </p>
                      <h3 className="mt-1 text-xl">{tr(c.title, locale)}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-pietra-600">{excerpt(tr(c.body, locale), 26)}</p>
                      {c.placeSlug && (
                        <Link
                          href={`/luoghi/${c.placeSlug}`}
                          className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-magliocco-700 hover:underline"
                        >
                          {t("openPlace")} <IconArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
