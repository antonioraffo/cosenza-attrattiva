"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { PillarIcon, type Pillar } from "./PillarIcon";

export interface MegaPillar {
  pillar: Pillar;
  label: string;
  description: string;
  href: string;
  cta: string;
  items: { href: string; label: string }[];
}

/**
 * Megamenu «Scopri» (desktop): a sinistra i tre pilastri (icona + nome), a destra il riquadro del
 * pilastro attivo (colore del pilastro, testo bianco ≥ 5,3:1) con spiegazione e sottovoci.
 * - Si apre al clic o da tastiera (Invio, Spazio, freccia giù); si chiude con Esc (il focus torna
 *   al pulsante), con un clic fuori o scegliendo una voce.
 * - All'apertura è attivo il primo pilastro (Vive); il pilastro attivo cambia passando con il mouse, con il focus o con le frecce su/giù
 *   (schema a schede verticali: tablist + tabpanel); Tab entra nel riquadro.
 */
export function MegaMenu({ label, pillars, listLabel }: { label: string; pillars: MegaPillar[]; listLabel: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const panelId = `${id}-panel`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  // a ogni apertura si riparte dal primo pilastro
  const openAndFocus = () => {
    setActive(0);
    setOpen(true);
    requestAnimationFrame(() => tabs.current[0]?.focus());
  };
  const move = (to: number) => {
    const n = (to + pillars.length) % pillars.length;
    setActive(n);
    tabs.current[n]?.focus();
  };
  const current = pillars[active]!;

  return (
    <div ref={root} className="site-mega">
      <button
        ref={button}
        type="button"
        className="site-nav-link site-mega-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (!open) setActive(0);
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openAndFocus();
          }
        }}
      >
        <span>{label}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      <div id={panelId} className="site-mega-panel" hidden={!open}>
        <div className="site-mega-inner">
          <div className="site-mega-list" role="tablist" aria-orientation="vertical" aria-label={listLabel}>
            {pillars.map((p, i) => (
              <button
                key={p.pillar}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${p.pillar}`}
                aria-selected={active === i}
                aria-controls={`${id}-pane`}
                tabIndex={active === i ? 0 : -1}
                className="site-mega-tab"
                data-pillar={p.pillar}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    move(i + 1);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    move(i - 1);
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    move(0);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    move(pillars.length - 1);
                  }
                }}
              >
                <PillarIcon pillar={p.pillar} size={22} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
          <div
            id={`${id}-pane`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${current.pillar}`}
            className="site-mega-pane"
            data-pillar={current.pillar}
          >
            <p className="site-mega-title">{current.label}</p>
            <p className="site-mega-desc">{current.description}</p>
            <ul className="site-mega-items">
              {current.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} onClick={() => setOpen(false)}>
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={current.href} className="site-mega-cta" onClick={() => setOpen(false)}>
              {current.cta}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
