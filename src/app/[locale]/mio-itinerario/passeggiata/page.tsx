import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { mdToHtml } from "@/lib/markdown";
import { stripMarkdown } from "@/lib/text";
import { parsePlacesParam, shareParam } from "@/lib/mine";
import { listPlacesFull } from "@/server/queries";
import { WalkView, type WalkChapter } from "@/components/walk/WalkView";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ p?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "walk" });
  const tm = await getTranslations({ locale, namespace: "mine" });
  return { title: `${t("title")} · ${tm("title")}`, robots: { index: false } };
}

/**
 * Passeggiata sulle tappe scelte dal visitatore (?p=slug1,slug2,…): stessa esperienza degli
 * itinerari curati (mappa, arrivo per geofence, audio), con un percorso in linea retta tra le tappe.
 */
export default async function MyWalkPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { p } = await searchParams;
  setRequestLocale(locale);
  const all = await listPlacesFull();
  const slugs = parsePlacesParam(p, new Set(all.map((x) => x.slug)));
  if (slugs.length < 2) redirect(`/${locale}/mio-itinerario${slugs.length ? `?p=${shareParam(slugs)}` : ""}`);
  const tm = await getTranslations("mine");

  const chapters: WalkChapter[] = slugs.map((slug) => {
    const pl = all.find((x) => x.slug === slug)!;
    const body = tr(pl.body, locale);
    return {
      id: pl.id,
      title: tr(pl.name, locale),
      html: mdToHtml(body),
      plain: stripMarkdown(body),
      audioSrc: pl.audioUrl ? tr(pl.audioUrl, locale) || null : null,
      placeSlug: pl.slug,
      placeName: tr(pl.name, locale),
      image: pl.image ? { url: pl.image.url, alt: tr(pl.image.alt, locale) } : null,
      position: pl.geom,
      radiusM: pl.geofenceRadiusM,
      readings: [],
    };
  });

  return (
    <WalkView
      slug="mio-itinerario"
      title={tm("title")}
      color="#0f7663"
      route={chapters.map((c) => c.position)}
      chapters={chapters}
      backHref={`/mio-itinerario?p=${shareParam(slugs)}`}
    />
  );
}
