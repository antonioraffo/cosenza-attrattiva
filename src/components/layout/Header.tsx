import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { features } from "@/lib/env";
import { IconSearch, IconStamp } from "@/components/ui/icons";
import { HeaderMenu } from "./HeaderMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { PillarIcon, type Pillar } from "./PillarIcon";

export const PILLARS: Pillar[] = ["vive", "connect", "crea"];

/**
 * Header di sito sul modello di vivicosenza: barra bianca fissa con ombra (80/76/72 px),
 * logo a sinistra, tre voci dei pilastri (icona + etichetta) e azioni a destra; sotto 960 px
 * le voci passano nel menu a hamburger (HeaderMenu).
 */
export async function Header() {
  const t = await getTranslations("nav");
  const links = PILLARS.map((p) => ({ pillar: p, href: `/#${p}`, label: t(p) }));

  return (
    <header className="site-header" id="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="site-brand" aria-label={`Cosenza attrattiva – ${t("home")}`}>
          <Logo className="site-brand-logo" />
        </Link>

        <nav className="site-nav" aria-label={t("main")}>
          {links.map((l) => (
            <Link key={l.pillar} href={l.href} className="site-nav-link">
              <PillarIcon pillar={l.pillar} size={20} />
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          {features.assistant && (
            <Link href="/chiedi" className="site-icon-button" aria-label={t("ask")} title={t("ask")}>
              <IconSearch size={22} />
            </Link>
          )}
          <span className="site-header-locale">
            <LocaleSwitcher />
          </span>
          <Link href="/passaporto" className="site-header-cta">
            <IconStamp size={18} />
            <span>{t("passport")}</span>
          </Link>
          <HeaderMenu
            links={links}
            labels={{ open: t("openMenu"), close: t("closeMenu"), nav: t("mobileNav"), passport: t("passport") }}
          >
            <LocaleSwitcher />
          </HeaderMenu>
        </div>
      </div>
    </header>
  );
}
