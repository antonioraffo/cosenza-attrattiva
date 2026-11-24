"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { IconClose, IconMenu, IconStamp } from "@/components/ui/icons";
import { PillarIcon } from "./PillarIcon";
import type { MegaPillar } from "./MegaMenu";
import { MyItineraryButton } from "@/components/mine/MyItineraryButton";

/**
 * Menu mobile (≤ 960 px) come vivicosenza: hamburger 44×44 che diventa X, pannello sotto la barra
 * mostrato/nascosto con l'attributo `hidden` (nessuna animazione); si chiude con Esc, click fuori
 * o click su una voce. «Scopri» ha lo stesso contenuto del megamenu: Vive, Connect e Crea come
 * accordion (aria-expanded/aria-controls) con spiegazione e sottovoci; poi Eventi e Pianifica.
 */
export function HeaderMenu({
  pillars,
  links,
  labels,
  passport = true,
  children,
}: {
  passport?: boolean;
  pillars: MegaPillar[];
  links: { href: string; label: string }[];
  labels: { open: string; close: string; nav: string; passport: string; discover: string };
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panel.current?.contains(target) && !button.current?.contains(target)) setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 961px)");
    const onWide = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="site-icon-button site-menu-toggle"
        aria-label={open ? labels.close : labels.open}
        aria-controls="mobile-nav"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <IconClose size={24} /> : <IconMenu size={24} />}
      </button>
      <nav ref={panel} id="mobile-nav" className="site-mobile-nav" aria-label={labels.nav} hidden={!open}>
        <p className="site-mobile-heading">{labels.discover}</p>
        <ul className="site-mobile-pillars">
          {pillars.map((p) => {
            const isOpen = expanded === p.pillar;
            const sub = `${id}-${p.pillar}`;
            return (
              <li key={p.pillar} data-pillar={p.pillar}>
                <button
                  type="button"
                  className="site-mobile-link site-mobile-accordion"
                  aria-expanded={isOpen}
                  aria-controls={sub}
                  onClick={() => setExpanded(isOpen ? null : p.pillar)}
                >
                  <PillarIcon pillar={p.pillar} size={22} />
                  <span>{p.label}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="m7 10 5 5 5-5" />
                  </svg>
                </button>
                <div id={sub} className="site-mobile-pane" hidden={!isOpen}>
                  <p>{p.description}</p>
                  <ul className="site-mobile-sub">
                    {p.items.map((it) => (
                      <li key={it.href}>
                        <Link href={it.href} onClick={() => setOpen(false)}>
                          {it.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={p.href} onClick={() => setOpen(false)}>
                        {p.cta}
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
        <ul className="site-mobile-plain">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="site-mobile-link" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="site-mobile-actions">
          {passport ? (
            <Link href="/passaporto" className="site-header-cta site-header-cta--block" onClick={() => setOpen(false)}>
              <IconStamp size={18} />
              <span>{labels.passport}</span>
            </Link>
          ) : (
            <MyItineraryButton block onNavigate={() => setOpen(false)} />
          )}
          {children}
        </div>
      </nav>
    </>
  );
}
