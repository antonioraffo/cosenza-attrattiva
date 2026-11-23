"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { IconClose, IconMenu, IconStamp } from "@/components/ui/icons";
import { PillarIcon, type Pillar } from "./PillarIcon";

/**
 * Menu mobile (≤ 960 px) come vivicosenza: hamburger 44×44 che diventa X, pannello sotto la barra
 * mostrato/nascosto con l'attributo `hidden` (nessuna animazione); si chiude con Esc, click fuori
 * o click su una voce.
 */
export function HeaderMenu({
  links,
  labels,
  children,
}: {
  links: { pillar: Pillar; href: string; label: string; items: { href: string; label: string }[] }[];
  labels: { open: string; close: string; nav: string; passport: string };
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
        <ul>
          {links.map((l) => (
            <li key={l.pillar}>
              <Link href={l.href} className="site-mobile-link" onClick={() => setOpen(false)}>
                <PillarIcon pillar={l.pillar} size={22} />
                <span>{l.label}</span>
              </Link>
              <ul className="site-mobile-sub">
                {l.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} onClick={() => setOpen(false)}>
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="site-mobile-actions">
          <Link href="/passaporto" className="site-header-cta site-header-cta--block" onClick={() => setOpen(false)}>
            <IconStamp size={18} />
            <span>{labels.passport}</span>
          </Link>
          {children}
        </div>
      </nav>
    </>
  );
}
