import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ItinerariesSection } from "@/components/home/ItinerariesSection";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homeItineraries" });
  return { title: t("title"), description: t("intro") };
}

/** Tutti gli itinerari (il carosello con filtro per tema, prima in home). */
export default async function ItinerariesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main id="main">
        <ItinerariesSection locale={locale} as="h1" />
      </main>
      <Footer />
    </>
  );
}
