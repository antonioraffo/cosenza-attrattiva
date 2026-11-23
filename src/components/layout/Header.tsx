import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { features } from "@/lib/env";
import { IconSearch, IconStamp } from "@/components/ui/icons";
import { HeaderMenu } from "./HeaderMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { NavDropdown } from "./NavDropdown";
import { type Pillar } from "./PillarIcon";
import { ScrollReset } from "./ScrollReset";

export const PILLARS: Pillar[] = ["vive", "connect", "crea"];

/**
 * Header di sito sul modello di vivicosenza: barra bianca fissa con ombra (80/76/72 px),
 * logo a sinistra, tre voci dei pilastri (icona + etichetta) e azioni a destra; sotto 960 px
 * le voci passano nel menu a hamburger (HeaderMenu).
 */
export async function Header() {
  const t = await getTranslations("nav");
  // sottovoci di ogni pilastro (proposta di sintesi): Vive → eventi, Connect → itinerari e radici, Crea → Fatto a Cosenza
  const sub: Record<Pillar, { href: string; label: string }[]> = {
    vive: [
      { href: "/eventi#grandi-eventi", label: t("subGrandiEventi") },
      { href: "/eventi#calendario", label: t("subCalendario") },
    ],
    connect: [
      { href: "/#itinerari", label: t("subItinerari") },
      { href: "/ritorno-a-cosenza", label: t("subRadici") },
    ],
    crea: [
      { href: "/fatto-a-cosenza", label: t("subFatto") },
      { href: "/itinerari/le-mani-di-cosenza", label: t("subMani") },
    ],
  };
  const links = PILLARS.map((p) => ({ pillar: p, href: `/#${p}`, label: t(p), items: sub[p] }));

  return (
    <header className="site-header" id="site-header">
      <ScrollReset />
      <div className="site-container site-header-inner">
        <Link href="/" className="site-brand" aria-label={`Cosenza attrattiva – ${t("home")}`}>
          <Logo className="site-brand-logo" />
        </Link>

        <nav className="site-nav" aria-label={t("main")}>
          {links.map((l) => (
            <NavDropdown key={l.pillar} pillar={l.pillar} href={l.href} label={l.label} items={l.items} toggleLabel={t("openSub", { label: l.label })} />
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
