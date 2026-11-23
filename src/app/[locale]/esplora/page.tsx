import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { EXPLORE_ORIGIN, groupOf, pillarOf, walkMinutesFrom } from "@/lib/explore";
import { listPlacesFull } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ExploreView, type ExplorePlace } from "@/components/explore/ExploreView";

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
  const places: ExplorePlace[] = (await listPlacesFull())
    .map((p) => ({
      slug: p.slug,
      name: tr(p.name, locale),
      summary: tr(p.summary, locale),
      category: p.category,
      categoryLabel: t(`category.${p.category}`),
      group: groupOf(p.category),
      pillar: pillarOf(p.category),
      position: p.geom,
      minutes: walkMinutesFrom(EXPLORE_ORIGIN, p.geom),
      image: p.image ? { url: p.image.url, alt: tr(p.image.alt, locale) } : null,
    }))
    .sort((a, b) => a.minutes - b.minutes);

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
