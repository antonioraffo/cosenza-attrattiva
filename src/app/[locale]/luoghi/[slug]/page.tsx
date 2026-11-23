import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { mdToHtml } from "@/lib/markdown";
import { stripMarkdown } from "@/lib/text";
import { getPlace } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListenButton } from "@/components/audio/ListenButton";
import { CheckInButton } from "@/components/place/CheckInButton";
import { ThenNowSlider } from "@/components/place/ThenNowSlider";
import { ImmersiveActions } from "@/components/place/ImmersiveActions";
import { SmartImage } from "@/components/ui/SmartImage";
import { IconArrowRight, IconClock, IconPin, IconSparkle } from "@/components/ui/icons";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getPlace(slug);
  if (!p) return {};
  return {
    title: tr(p.name, locale),
    description: tr(p.summary, locale),
    openGraph: { images: p.gallery[0] ? [{ url: p.gallery[0].url }] : [] },
  };
}

export default async function PlacePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getPlace(slug);
  if (!p) notFound();
  const t = await getTranslations("place");
  const tt = await getTranslations("themes");
  const name = tr(p.name, locale);
  const [cover, ...rest] = p.gallery;
  const loc = locale as "it" | "en";

  return (
    <>
      <Header />
      <main id="main">
        <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-neutro-950 text-white">
          <div className="absolute inset-0 -z-10">
            <SmartImage media={cover} locale={locale} priority sizes="100vw" fallbackLabel={name} className="object-cover opacity-85" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutro-950 via-neutro-950/35 to-transparent" />
          <div className="mx-auto w-full max-w-4xl px-4 pt-28 pb-10 md:px-8">
            {p.neighborhood && (
              <p className="eyebrow text-arancio-300">
                {t("neighborhood")} · {tr(p.neighborhood.name, locale)}
              </p>
            )}
            <h1 className="mt-3 text-5xl leading-[1.08] tracking-[-0.045em] md:text-6xl">{name}</h1>
            <p className="mt-3 max-w-2xl text-lg text-neutro-100/90">{tr(p.summary, locale)}</p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ListenButton id={`place-${p.slug}`} title={name} text={stripMarkdown(tr(p.body, locale))} lang={loc} />
            <ImmersiveActions
              place={{
                slug: p.slug,
                name,
                center: p.geom,
                streetview: p.streetview,
                ar: p.ar,
              }}
            />
          </div>

          <section aria-labelledby="story-title" className="mt-10">
            <h2 id="story-title" className="text-3xl">
              {t("story")}
            </h2>
            <div className="prose-story mt-5 text-neutro-800" dangerouslySetInnerHTML={{ __html: mdToHtml(tr(p.body, locale)) }} />
          </section>

          {rest.length > 0 && (
            <section aria-labelledby="gallery-title" className="mt-12">
              <h2 id="gallery-title" className="text-3xl">
                {t("gallery")}
              </h2>
              <ul className="scrollbar-none -mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
                {p.gallery.map((m) => (
                  <li key={m.url} className="w-[85%] shrink-0 snap-center md:w-[48%]">
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutro-200">
                        <Image src={m.url} alt={tr(m.alt, locale)} fill sizes="(min-width: 768px) 420px, 85vw" className="object-cover" />
                      </div>
                      <figcaption className="mt-1.5 text-xs text-neutro-500">
                        {m.sourceUrl ? (
                          <a href={m.sourceUrl} className="hover:underline" rel="noopener" target="_blank">
                            {m.credit}
                          </a>
                        ) : (
                          m.credit
                        )}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.historic && cover && (
            <section aria-labelledby="thennow-title" className="mt-12">
              <h2 id="thennow-title" className="text-3xl">
                {t("thenNow")}
              </h2>
              {p.historicCaption && (
                <p className="mt-2 text-neutro-600">
                  {p.historicYear && <strong className="font-semibold">{p.historicYear} · </strong>}
                  {tr(p.historicCaption, locale)}
                </p>
              )}
              <div className="mt-5">
                <ThenNowSlider
                  then={{ url: p.historic.url, alt: tr(p.historic.alt, locale) }}
                  now={{ url: cover.url, alt: tr(cover.alt, locale) }}
                  labels={{ then: `${t("then")}${p.historicYear ? ` · ${p.historicYear}` : ""}`, now: t("now"), hint: t("thenNowHint") }}
                />
              </div>
              <p className="mt-2 text-xs text-neutro-500">{p.historic.credit}</p>
            </section>
          )}

          {p.curiosities.length > 0 && (
            <section aria-labelledby="curio-title" className="mt-12 rounded-[var(--radius-card)] bg-arancio-300/25 p-6 md:p-8">
              <h2 id="curio-title" className="flex items-center gap-2 text-3xl">
                <IconSparkle className="text-arancio-700" /> {t("curiosities")}
              </h2>
              <ul className="mt-5 space-y-4">
                {p.curiosities.map((c, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-neutro-800">
                    <span className="font-display text-2xl leading-none text-arancio-700" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span>{tr(c, locale)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="info-title" className="mt-12">
            <h2 id="info-title" className="text-3xl">
              {t("info")}
            </h2>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-neutro-200 md:grid-cols-3">
              <div className="bg-white p-5">
                <dt className="flex items-center gap-1.5 text-sm font-semibold text-neutro-500">
                  <IconClock size={16} /> {t("hours")}
                </dt>
                <dd className="mt-1.5 text-neutro-800">{p.openingHours ? tr(p.openingHours, locale) : "—"}</dd>
              </div>
              <div className="bg-white p-5">
                <dt className="text-sm font-semibold text-neutro-500">{t("accessibility")}</dt>
                <dd className="mt-1.5 text-neutro-800">
                  {p.accessibility?.stepFree === true && <strong className="block font-semibold text-primario-700">{t("stepFree")}</strong>}
                  {p.accessibility?.stepFree === false && <strong className="block font-semibold text-primario-700">{t("notStepFree")}</strong>}
                  {p.accessibility ? tr(p.accessibility.notes, locale) : "—"}
                </dd>
              </div>
              <div className="bg-white p-5">
                <dt className="flex items-center gap-1.5 text-sm font-semibold text-neutro-500">
                  <IconPin size={16} /> {t("address")}
                </dt>
                <dd className="mt-1.5 text-neutro-800">
                  {p.address}
                  {!p.coordsVerified && <span className="mt-1 block text-xs text-neutro-500">{t("coordsUnverified")}</span>}
                </dd>
              </div>
            </dl>
          </section>

          <section className="mt-10">
            <CheckInButton slug={p.slug} name={name} center={p.geom} radiusM={p.geofenceRadiusM} locale={loc} />
          </section>

          {p.itineraries.length > 0 && (
            <section aria-labelledby="in-it-title" className="mt-12">
              <h2 id="in-it-title" className="text-3xl">
                {t("inItineraries")}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.itineraries.map((it) => (
                  <li key={it.slug}>
                    <Link
                      href={`/itinerari/${it.slug}`}
                      className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border-l-4 bg-white p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition"
                      style={{ borderColor: it.color }}
                    >
                      <span>
                        <span className="eyebrow block text-neutro-500">{tt(it.theme)}</span>
                        <span className="font-display text-lg">{tr(it.title, locale)}</span>
                      </span>
                      <IconArrowRight size={18} className="shrink-0 text-neutro-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {p.nearby.length > 0 && (
            <section aria-labelledby="nearby-title" className="mt-12">
              <h2 id="nearby-title" className="text-3xl">
                {t("nearby")}
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {p.nearby.map((n) => (
                  <li key={n.slug}>
                    <Link href={`/luoghi/${n.slug}`} className="group block">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutro-200">
                        <SmartImage media={n.image} locale={locale} sizes="200px" className="object-cover transition group-hover:scale-105" />
                      </div>
                      <p className="mt-2 font-display leading-tight">{tr(n.name, locale)}</p>
                      <p className="text-xs text-neutro-500">{t("meters", { m: n.distance })}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
