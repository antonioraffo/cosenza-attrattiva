import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { getItinerary, listItineraries, listPlacesLite } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PassportView } from "@/components/passport/PassportView";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "passport" });
  return { title: t("title") };
}

export default async function PassportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("passport");
  const [summaries, places] = await Promise.all([listItineraries(), listPlacesLite()]);
  const details = await Promise.all(summaries.map((s) => getItinerary(s.slug)));

  const itineraries = details
    .filter((d) => d !== null)
    .map((d) => ({
      slug: d.slug,
      title: tr(d.title, locale),
      color: d.color,
      places: [...new Set(d.chapters.map((c) => c.placeSlug).filter((s): s is string => Boolean(s)))],
    }));
  const placeNames = Object.fromEntries(places.map((p) => [p.slug, tr(p.name, locale)]));

  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-5xl px-4 pt-10 md:px-8">
        <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
        <p className="mt-3 max-w-xl text-pietra-600">{t("subtitle")}</p>
        <PassportView itineraries={itineraries} placeNames={placeNames} />
      </main>
      <Footer />
    </>
  );
}
