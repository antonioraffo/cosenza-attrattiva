import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EXPLORE_ORIGIN } from "@/lib/explore";
import { ExploreView } from "@/components/explore/ExploreView";
import { explorePlaces } from "@/components/explore/explorePlaces";
import { IconArrowRight } from "@/components/ui/icons";

/** «Esplora a piedi» in home (modello della demo di Stefano): filtri, schede con cuore e minuti a piedi, mappa. */
export async function ExploreSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.explore");
  const places = await explorePlaces(locale);

  return (
    <section id="esplora" className="ca-section ca-section--white ca-homexp" aria-labelledby="esplora-title">
      <div className="site-container">
        <div className="ca-section-heading">
          <div>
            <h2 id="esplora-title">{t("title")}</h2>
            <p className="ca-section-intro">{t("intro")}</p>
          </div>
          <Link href="/esplora" className="ca-heading-action">
            {t("all")} <IconArrowRight size={18} />
          </Link>
        </div>
        <ExploreView places={places} origin={EXPLORE_ORIGIN} compact />
      </div>
    </section>
  );
}
