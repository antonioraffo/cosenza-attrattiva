"use client";

import { useEffect, useRef } from "react";
import { initializePanels } from "./effects/panels";

/** Contenitore dell'hero: avvia la logica dei pannelli sticky sul markup reso dal server. */
export function HeroRoot({ label, titles, children }: { label: string; titles: string[]; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? initializePanels(ref.current, titles) : undefined), [titles]);
  return (
    <section ref={ref} className="ca-hero" aria-label={label}>
      {children}
    </section>
  );
}
