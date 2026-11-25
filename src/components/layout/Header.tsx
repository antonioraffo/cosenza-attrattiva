import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { features } from "@/lib/env";
import { IconSearch, IconStamp } from "@/components/ui/icons";
import { HeaderMenu } from "./HeaderMenu";
import { LogoMark } from "./Logo";
import { MegaMenu, type MegaPillar } from "./MegaMenu";
import { type Pillar } from "./PillarIcon";
import { ScrollReset } from "./ScrollReset";
import { MyItineraryButton, MyItineraryDrawer } from "@/components/mine/MyItineraryButton";

export const PILLARS: Pillar[] = ["vive", "connect", "crea"];

/**
 * Header di sito sul modello di vivicosenza: barra bianca fissa con ombra (80/76/72 px),
 * marchio a sinistra (solo il simbolo, senza scritta), menu Scopri (megamenu dei pilastri) · Eventi · Pianifica al centro e azioni a destra; sotto 960 px
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
      { href: "/esplora", label: t("explore") },
      { href: "/il-tuo-tempo", label: t("time") },
      { href: "/itinerari", label: t("subItinerari") },
      { href: "/ritorno-a-cosenza", label: t("subRadici") },
    ],
    crea: [
      { href: "/fatto-a-cosenza", label: t("subFatto") },
      { href: "/itinerari/le-mani-di-cosenza", label: t("subMani") },
    ],
  };
  // «Scopri»: i tre pilastri con spiegazione e sottovoci (megamenu su desktop, accordion su mobile)
  const pillars: MegaPillar[] = PILLARS.map((p) => ({
    pillar: p,
    label: t(p),
    description: t(`mega.${p}`),
    href: `/#${p}`,
    cta: t("mega.goTo", { label: t(p) }),
    items: sub[p],
  }));
  // voci dirette: Eventi → calendario della città, Pianifica → il giro su misura del tuo tempo
  const links = [
    { href: "/eventi", label: t("events") },
    { href: "/il-tuo-tempo", label: t("plan") },
  ];

  return (
    <header className="site-header" id="site-header">
      <ScrollReset />
      {!features.passport && <MyItineraryDrawer />}
      <div className="site-container site-header-inner">
        <Link href="/" className="site-brand" aria-label={`Cosenza attrattiva – ${t("home")}`}>
          <LogoMark className="site-brand-logo" />
        </Link>

        <nav className="site-nav" aria-label={t("main")}>
          <MegaMenu label={t("discover")} pillars={pillars} listLabel={t("mega.list")} />
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="site-nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          {features.assistant && (
            <Link href="/chiedi" className="site-icon-button" aria-label={t("ask")} title={t("ask")}>
              <IconSearch size={22} />
            </Link>
          )}
          {features.passport ? (
            <Link href="/passaporto" className="site-header-cta">
              <IconStamp size={18} />
              <span>{t("passport")}</span>
            </Link>
          ) : (
            <MyItineraryButton />
          )}
          <HeaderMenu
            pillars={pillars}
            links={links}
            labels={{ open: t("openMenu"), close: t("closeMenu"), nav: t("mobileNav"), passport: t("passport"), discover: t("discover") }}
            passport={features.passport}
          />
        </div>
      </div>
    </header>
  );
}
