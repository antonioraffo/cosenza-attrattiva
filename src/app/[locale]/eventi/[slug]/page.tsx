import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { mdToHtml } from "@/lib/markdown";
import { eventDateLine } from "@/lib/events";
import { getEvent } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmartImage } from "@/components/ui/SmartImage";
import { EventMap } from "@/components/events/EventMap";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/icons";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const e = await getEvent(slug);
  return e ? { title: tr(e.title, locale), description: tr(e.summary, locale) } : {};
}

/** Pagina di un evento: per i grandi eventi è la "pagina dedicata" della proposta di sintesi. */
export default async function EventPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const e = await getEvent(slug);
  if (!e) notFound();
  const t = await getTranslations("events");
  const title = tr(e.title, locale);
  const where = e.placeName ? tr(e.placeName, locale).split(" – ")[0] : e.venue;
  const directions = e.geom ? `https://www.openstreetmap.org/directions?route=%3B${e.geom[1]}%2C${e.geom[0]}#map=17/${e.geom[1]}/${e.geom[0]}` : null;

  return (
    <>
      <Header />
      <main id="main">
        <section className="relative isolate overflow-hidden bg-neutro-900 text-white">
          {e.cover && (
            <div className="absolute inset-0 -z-10 opacity-60">
              <SmartImage media={e.cover} locale={locale} priority sizes="100vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutro-950 via-neutro-950/50 to-neutro-950/20" />
          <div className="site-container py-16 md:py-24">
            <Link href="/eventi" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/90 hover:underline">
              <IconArrowLeft size={16} /> {t("back")}
            </Link>
            <p className="eyebrow mt-6 flex flex-wrap items-center gap-2 text-white/90">
              {e.major && <span className="ca-event-major !mb-0">{t("majorBadge")}</span>}
              {t(`category.${e.category}`)} · {t(`pillar.${e.pillar}`)}
            </p>
            <h1 className="mt-3 max-w-4xl text-5xl leading-[1.05] tracking-[-0.045em] md:text-7xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-xl text-white/90">{tr(e.summary, locale)}</p>
          </div>
        </section>

        <div className="site-container grid gap-10 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-px overflow-hidden rounded-2xl bg-neutro-200">
              <div className="bg-white p-4">
                <dt className="text-xs text-neutro-500">{t("when")}</dt>
                <dd className="mt-1 font-semibold">{eventDateLine(e, locale)}</dd>
              </div>
              {where && (
                <div className="bg-white p-4">
                  <dt className="text-xs text-neutro-500">{t("where")}</dt>
                  <dd className="mt-1 font-semibold">
                    {e.placeSlug ? (
                      <Link href={`/luoghi/${e.placeSlug}`} className="text-primario-700 hover:underline">
                        {where}
                      </Link>
                    ) : (
                      where
                    )}
                  </dd>
                </div>
              )}
              {e.schedule && (
                <div className="bg-white p-4">
                  <dt className="text-xs text-neutro-500">{t("schedule")}</dt>
                  <dd className="mt-1 font-semibold">{tr(e.schedule, locale)}</dd>
                </div>
              )}
            </dl>
            <div className="prose-plain mt-8 text-lg text-neutro-800" dangerouslySetInnerHTML={{ __html: mdToHtml(tr(e.description, locale)) }} />
            {e.sourceUrl && (
              <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primario-700 hover:underline">
                {t("source")} ↗
              </a>
            )}
            {e.demo && <p className="ca-demo-note mt-6">{t("demoNote")}</p>}
          </div>

          {e.geom && (
            <aside>
              <div className="h-72 overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
                <EventMap position={e.geom} label={`${t("where")}: ${where ?? title}`} />
              </div>
              {directions && (
                <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-primario-700 hover:underline">
                  {t("directions")} ↗
                </a>
              )}
            </aside>
          )}
        </div>

        {(e.nearby.length > 0 || e.itineraries.length > 0) && (
          <div className="bg-neutro-50">
            <div className="site-container grid gap-12 py-14 lg:grid-cols-2">
              {e.nearby.length > 0 && (
                <section aria-labelledby="nearby-title">
                  <h2 id="nearby-title" className="text-3xl">
                    {t("nearby")}
                  </h2>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {e.nearby.map((p) => (
                      <li key={p.slug} className="relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
                        <div className="relative aspect-[4/3]">
                          <SmartImage media={p.image} locale={locale} sizes="(min-width: 1024px) 20vw, 45vw" />
                        </div>
                        <div className="p-4">
                          <Link href={`/luoghi/${p.slug}`} className="ca-card-link font-display text-lg font-semibold">
                            {tr(p.name, locale).split(" – ")[0]}
                          </Link>
                          <p className="text-sm text-neutro-500">{t("walk", { min: Math.max(1, Math.round(p.distance / 75)) })}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {e.itineraries.length > 0 && (
                <section aria-labelledby="near-it-title">
                  <h2 id="near-it-title" className="text-3xl">
                    {t("itineraries")}
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {e.itineraries.map((it) => (
                      <li key={it.slug}>
                        <Link
                          href={`/itinerari/${it.slug}`}
                          className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-l-4 border-neutro-200 bg-white p-4 hover:border-neutro-400"
                          style={{ borderLeftColor: it.color }}
                        >
                          <span>
                            <span className="block font-display text-lg font-semibold text-neutro-900">
                              {tr(it.title, locale)}
                            </span>
                            <span className="text-sm text-neutro-600">{tr(it.subtitle, locale)}</span>
                          </span>
                          <IconArrowRight size={18} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
