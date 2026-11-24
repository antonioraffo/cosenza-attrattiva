import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatKm } from "@/lib/format";
import { buildPlan, TIME_OPTIONS } from "@/lib/plan";
import { getPlanData } from "@/server/queries";
import { IconArrowRight, IconClock } from "@/components/ui/icons";

/** Fascia «Quanto tempo hai?» sotto l'hero: tre scelte con i numeri veri del giro proposto. */
export async function TimeBar({ locale }: { locale: string }) {
  const t = await getTranslations("time");
  const { itineraries, links } = await getPlanData(locale);

  return (
    <section className="ca-section ca-timebar" aria-labelledby="timebar-title">
      <div className="site-container ca-timebar-inner">
        <div className="ca-timebar-heading">
          <h2 id="timebar-title">
            <IconClock size={26} /> {t("question")}
          </h2>
          <p>{t("homeIntro")}</p>
        </div>
        <ul className="ca-timebar-options">
          {TIME_OPTIONS.map((o) => {
            const plan = buildPlan(itineraries, links, o);
            return (
              <li key={o}>
                <Link href={`/il-tuo-tempo?t=${o}`} className="ca-timebar-option">
                  <strong>{t(`options.${o}`)}</strong>
                  <span>{t("homeStat", { count: plan.slugs.length, km: formatKm(plan.walkM, locale) })}</span>
                  <span className="ca-timebar-cta">
                    {t("homeCta")} <IconArrowRight size={16} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
