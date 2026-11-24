"use client";

/* eslint-disable @next/next/no-img-element -- logo SVG statico */
import { useEffect, useRef, useState } from "react";
import { initializeDrawing } from "./effects/drawing";

type Kind = "duomo" | "ponte";

/** Disegni al tratto (gli stessi dell'intro silhouette): nero #1d1d1d e verde #0f7663. */
const DRAWINGS: Record<Kind, string> = {
  duomo: "/home/duomo-silhouette-lines.svg",
  ponte: "/home/ponte-calatrava-silhouette-lines.svg",
};

/**
 * Hero della home: logo, claim e disegno al tratto che sta per intero nella prima schermata (100svh
 * meno l'header). Il disegno si traccia da solo e si ripete in loop (effects/drawing.ts); il selettore
 * Antica / Contemporanea passa dal Duomo al Ponte di Calatrava.
 */
export function HeroDrawing({
  title,
  labels,
}: {
  title: string;
  labels: { nav: string; duomo: string; ponte: string; announce: Record<Kind, string>; art: Record<Kind, string> };
}) {
  const root = useRef<HTMLElement>(null);
  const [kind, setKind] = useState<Kind>("duomo");
  const [announcement, setAnnouncement] = useState("");

  // altezza dell'header (sticky): l'hero occupa il resto della prima schermata
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("#site-header");
    const section = root.current;
    if (!header || !section) return;
    const set = () => section.style.setProperty("--hero-header-h", `${Math.round(header.getBoundingClientRect().height)}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => (root.current ? initializeDrawing(root.current, DRAWINGS[kind]) : undefined), [kind]);

  return (
    <section ref={root} className="ca-hero-draw" data-drawing-kind={kind} aria-labelledby="hero-title">
      <div className="ca-hero-draw-brand">
        <img src="/brand/logo-h.svg" alt="Cosenza attrattiva" width={1384} height={437} fetchPriority="high" decoding="async" />
        <h1 id="hero-title" className="ca-hero-draw-claim">
          {title}
        </h1>
      </div>
      <div key={kind} className="ca-hero-draw-art" data-drawing-art role="img" aria-label={labels.art[kind]} />
      <div className="ca-hero-draw-nav" role="group" aria-label={labels.nav}>
        {(["duomo", "ponte"] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            onClick={() => {
              if (k === kind) return;
              setKind(k);
              setAnnouncement(labels.announce[k]);
            }}
          >
            {labels[k]}
          </button>
        ))}
        <span className="sr-only" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </section>
  );
}
