import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { IconArrowRight } from "@/components/ui/icons";
import { CraftTabs } from "./CraftTabs";

const CRAFTS = ["ceramica", "legno", "tessile", "oreficeria", "prodotti"] as const;

/**
 * Fascia nera di "Bottega Cosenza": titolo, introduzione e i mestieri (CraftTabs).
 * Nella pagina dedicata il titolo è l'h1; in home è un h2 con il link alla pagina.
 */
export async function CreaBand({ as = "h1", withLink = false }: { as?: "h1" | "h2"; withLink?: boolean }) {
  const t = await getTranslations("crea");
  const crafts = CRAFTS.map((k) => ({ key: k, name: t(`craft.${k}.name`), text: t(`craft.${k}.text`) }));
  const Title = as;

  return (
    <section className="ca-crea-hero" aria-labelledby="crea-title">
      <div className="site-container ca-crea-grid">
        <div>
          <p className="ca-pillar-badge ca-pillar-badge--crea">{t("eyebrow")}</p>
          <Title id="crea-title" className="ca-page-title">
            {t("title")}
          </Title>
          <p className="ca-crea-intro">{t("intro")}</p>
          {withLink && (
            <Link href="/fatto-a-cosenza" className="ca-crea-more">
              {t("discover")} <IconArrowRight size={18} />
            </Link>
          )}
          {as === "h1" && <h2 className="sr-only">{t("crafts")}</h2>}
        </div>
        <CraftTabs crafts={crafts} label={t("craftsLabel")} photoTodo={t("photoTodo")} />
      </div>
    </section>
  );
}
