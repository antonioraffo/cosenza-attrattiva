import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { features } from "@/lib/env";
import { Logo } from "./Logo";
import { ConsentManageButton } from "./ConsentBanner";
import { PillarIcon } from "./PillarIcon";

/**
 * Footer sul modello di vivicosenza: fondo scuro, marchio e recapiti del Comune, due colonne di
 * link e riga finale con copyright, crediti e attribuzioni cartografiche (obbligatorie per OSM).
 */
export async function Footer() {
  const t = await getTranslations("siteFooter");
  const tf = await getTranslations("footer");
  const tn = await getTranslations("nav");

  return (
    <footer className="ca-footer" id="site-footer">
      <div className="site-container ca-footer-grid">
        <div className="ca-footer-brand">
          <Logo light className="ca-footer-logo" />
          <address>
            <strong>{t("municipality")}</strong>
            <span>{t("address")}</span>
            <span>
              {t("phone")} <a href="tel:+3909848131">+39 0984 8131</a>
            </span>
            <span>
              {t("pec")} <a href="mailto:protocollo@pec.comune.cosenza.it">protocollo@pec.comune.cosenza.it</a>
            </span>
            <span>{t("fiscal")}</span>
          </address>
          <p className="ca-footer-project">{tf("project")}</p>
        </div>
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore">{t("explore")}</h2>
          <ul className="ca-footer-links">
            {(["vive", "connect", "crea"] as const).map((p) => (
              <li key={p}>
                <Link href={`/#${p}`}>
                  <PillarIcon pillar={p} size={14} /> {tn(p)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#itinerari">{t("itineraries")}</Link>
            </li>
            <li>
              <Link href="/eventi">{t("calendar")}</Link>
            </li>
            <li>
              <Link href="/ritorno-a-cosenza">{t("roots")}</Link>
            </li>
            <li>
              <Link href="/fatto-a-cosenza">{t("crea")}</Link>
            </li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-services">
          <h2 id="footer-services">{t("services")}</h2>
          <ul className="ca-footer-links">
            <li>
              <Link href="/passaporto">{tn("passport")}</Link>
            </li>
            {features.assistant && (
              <li>
                <Link href="/chiedi">{tn("ask")}</Link>
              </li>
            )}
            <li>
              <Link href="/crediti">{tf("credits")}</Link>
            </li>
            <li>
              <ConsentManageButton />
            </li>
          </ul>
        </nav>
      </div>
      <div className="site-container ca-footer-bottom">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        <p>{tf("mapData")}</p>
      </div>
    </footer>
  );
}
