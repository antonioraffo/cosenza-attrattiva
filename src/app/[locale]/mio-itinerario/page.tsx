import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { parsePlacesParam } from "@/lib/mine";
import { listPlacesFull } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MyItineraryView, type MinePlace } from "@/components/mine/MyItineraryView";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ p?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mine" });
  return { title: t("title"), robots: { index: false } };
}

/**
 * "Il mio itinerario": le tappe salvate sul telefono, oppure quelle ricevute con un link (?p=…).
 * Mappa con la sequenza delle tappe, minuti a piedi stimati, condivisione e passeggiata.
 */
export default async function MyItineraryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { p } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("explore");
  const places: MinePlace[] = (await listPlacesFull()).map((pl) => ({
    slug: pl.slug,
    name: tr(pl.name, locale),
    summary: tr(pl.summary, locale),
    categoryLabel: t(`category.${pl.category}`),
    position: pl.geom,
    image: pl.image?.url ?? null,
  }));
  const shared = p ? parsePlacesParam(p, new Set(places.map((x) => x.slug))) : null;

  return (
    <>
      <Header />
      <main id="main" className="site-container ca-xp-page">
        <MyItineraryView places={places} shared={shared} />
      </main>
      <Footer />
    </>
  );
}
