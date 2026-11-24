import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EXPLORE_ORIGIN } from "@/lib/explore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExploreView } from "@/components/explore/ExploreView";
import { explorePlaces } from "@/components/explore/explorePlaces";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });
  return { title: t("title"), description: t("intro") };
}

/** Esplora (Cosenza Connect): elenco e mappa di tutti i luoghi, con filtri, tempi a piedi e cuore "salva". */
export default async function ExplorePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("explore");
  const places = await explorePlaces(locale);

  return (
    <>
      <Header />
      <main id="main" className="site-container ca-xp-page">
        <div>
          <p className="ca-pillar-badge ca-pillar-badge--connect">{t("eyebrow")}</p>
          <h1 className="ca-page-title">{t("title")}</h1>
          <p className="ca-section-intro">{t("intro")}</p>
        </div>
        <ExploreView places={places} origin={EXPLORE_ORIGIN} />
      </main>
      <Footer />
    </>
  );
}
