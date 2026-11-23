"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { PillarIcon, type Pillar } from "./PillarIcon";

/**
 * Voce del menu principale con sottomenu, come vivicosenza: il link porta all'area del pilastro,
 * il pulsante a freccia (28×44, aria-expanded) apre il pannello delle sottovoci.
 * Si chiude con Esc, con un clic fuori o scegliendo una voce.
 */
export function NavDropdown({
  pillar,
  href,
  label,
  items,
  toggleLabel,
}: {
  pillar: Pillar;
  href: string;
  label: string;
  items: { href: string; label: string }[];
  toggleLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();

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

  return (
    <div ref={root} className="site-nav-item">
      <Link href={href} className="site-nav-link">
        <PillarIcon pillar={pillar} size={20} />
        <span>{label}</span>
      </Link>
      <button
        ref={button}
        type="button"
        className="site-nav-toggle"
        aria-expanded={open}
        aria-controls={id}
        aria-label={toggleLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      <ul id={id} className="site-nav-panel" hidden={!open}>
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} onClick={() => setOpen(false)}>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
