import "server-only";
import { getTranslations } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { EXPLORE_ORIGIN, groupOf, pillarOf, walkMinutesFrom } from "@/lib/explore";
import { listPlacesFull } from "@/server/queries";
import type { ExplorePlace } from "./ExploreView";

/** Luoghi per Esplora (pagina e sezione in home), ordinati per minuti a piedi da Piazza dei Bruzi. */
export async function explorePlaces(locale: string): Promise<ExplorePlace[]> {
  const t = await getTranslations("explore");
  return (await listPlacesFull())
    .map((p) => ({
      slug: p.slug,
      name: tr(p.name, locale),
      summary: tr(p.summary, locale),
      sintesi: tr(p.sintesi, locale) || tr(p.summary, locale),
      category: p.category,
      categoryLabel: t(`category.${p.category}`),
      group: groupOf(p.category),
      pillar: pillarOf(p.category),
      position: p.geom,
      minutes: walkMinutesFrom(EXPLORE_ORIGIN, p.geom),
      image: p.image ? { url: p.image.url, alt: tr(p.image.alt, locale) } : null,
    }))
    .sort((a, b) => a.minutes - b.minutes);
}
