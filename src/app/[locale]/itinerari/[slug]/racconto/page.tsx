import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { mdToHtml } from "@/lib/markdown";
import { stripMarkdown } from "@/lib/text";
import { getItinerary } from "@/server/queries";
import { StoryView, type StoryChapter } from "@/components/story/StoryView";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const it = await getItinerary(slug);
  return it ? { title: tr(it.title, locale), description: tr(it.subtitle, locale) } : {};
}

export default async function StoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const it = await getItinerary(slug);
  if (!it) notFound();

  const chapters: StoryChapter[] = it.chapters.map((c) => ({
    id: c.id,
    title: tr(c.title, locale),
    html: mdToHtml(tr(c.body, locale)),
    plain: stripMarkdown(tr(c.body, locale)),
    audioSrc: c.audioUrl ? (tr(c.audioUrl, locale) || null) : null,
    placeSlug: c.placeSlug,
    placeName: c.placeName ? tr(c.placeName, locale) : null,
    image: c.image ? { url: c.image.url, alt: tr(c.image.alt, locale), credit: c.image.credit ?? "" } : null,
    position: c.geom,
    camera: c.camera,
    routeFraction: c.routeFraction,
    hasStreetview: c.hasStreetview,
    hasAr: c.hasAr,
  }));

  return (
    <StoryView
      slug={it.slug}
      title={tr(it.title, locale)}
      subtitle={tr(it.subtitle, locale)}
      intro={tr(it.intro, locale)}
      color={it.color}
      route={it.route}
      cover={it.cover ? { url: it.cover.url, alt: tr(it.cover.alt, locale) } : null}
      chapters={chapters}
    />
  );
}
