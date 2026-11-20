import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  const chapters: WalkChapter[] = it.chapters.map((c) => ({
    id: c.id,
    title: tr(c.title, locale),
    html: mdToHtml(tr(c.body, locale)),
    plain: stripMarkdown(tr(c.body, locale)),
    audioSrc: c.audioUrl ? tr(c.audioUrl, locale) || null : null,
    placeSlug: c.placeSlug,
    placeName: c.placeName ? tr(c.placeName, locale) : null,
    image: c.image ? { url: c.image.url, alt: tr(c.image.alt, locale) } : null,
    position: c.geom,
    radiusM: c.placeSlug ? c.geofenceRadiusM : 30,
  }));

  return (
    <WalkView
      slug={it.slug}
      title={tr(it.title, locale)}
      color={it.color}
      route={it.route}
      chapters={chapters}
    />
  );
}
