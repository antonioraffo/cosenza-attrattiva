import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { mdToHtml } from "@/lib/markdown";
import { stripMarkdown } from "@/lib/text";
import { getItinerary } from "@/server/queries";
import { WalkView, type WalkChapter } from "@/components/walk/WalkView";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const it = await getItinerary(slug);
  const t = await getTranslations({ locale, namespace: "walk" });
  return it ? { title: `${t("title")} · ${tr(it.title, locale)}` } : {};
}

export default async function WalkPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const it = await getItinerary(slug);
  if (!it) notFound();

  // la passeggiata usa solo le tappe geolocalizzate; senza almeno due si legge come racconto
  if (it.locatedCount < 2) redirect(`/${locale}/itinerari/${slug}/racconto`);

  const chapters: WalkChapter[] = [];
  for (const c of it.chapters) {
    const html = mdToHtml(tr(c.body, locale));
    if (!c.geom) {
      // tappa non geolocalizzata: "lettura" agganciata all'ultima tappa sulla mappa
      chapters.at(-1)?.readings.push({ id: c.id, title: tr(c.title, locale), html });
      continue;
    }
    chapters.push({
      id: c.id,
      title: tr(c.title, locale),
      html,
      plain: stripMarkdown(tr(c.body, locale)),
      audioSrc: c.audioUrl ? tr(c.audioUrl, locale) || null : null,
      placeSlug: c.placeSlug,
      placeName: c.placeName ? tr(c.placeName, locale) : null,
      image: c.image ? { url: c.image.url, alt: tr(c.image.alt, locale) } : null,
      position: c.geom,
      radiusM: c.placeSlug ? c.geofenceRadiusM : 30,
      readings: [],
    });
  }

  return (
    <WalkView
      slug={it.slug}
      title={tr(it.title, locale)}
      color={it.color}
      route={it.route ?? chapters.map((c) => c.position)}
      chapters={chapters}
    />
  );
}
