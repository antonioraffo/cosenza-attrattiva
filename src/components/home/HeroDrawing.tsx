"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { initializeDrawing } from "./effects/drawing";
import { FILLS, type FillPalette } from "./effects/fills";

type Kind = "duomo" | "ponte";

/** Disegni al tratto (gli stessi dell'intro silhouette): nero #1d1d1d e verde #0f7663. */
const DRAWINGS: Record<Kind, string> = {
  duomo: "/home/duomo-silhouette-lines.svg",
  ponte: "/home/ponte-calatrava-silhouette-lines.svg",
};

/**
 * Ritagli (viewBox): nel Duomo l'asse della facciata (la croce, x≈624) non è al centro del disegno
 * largo 1535; tagliando il lato destro a 1248 la facciata sta al centro e l'hero torna simmetrico.
 */
const CROPS: Partial<Record<Kind, string>> = { duomo: "0 0 1248 1025" };

export interface HeroScene {
  title: string;
  description: string;
  href: string;
  facts: { title: string; text: string }[];
}

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);

/**
 * Hero della home: claim e disegno al tratto che sta per intero nella prima schermata (100svh
 * meno l'header). Il disegno si traccia da solo e si ripete in loop (effects/drawing.ts); il selettore
 * Antica / Contemporanea passa dal Duomo al Ponte di Calatrava. Dopo il tratto le parti principali si
 * colorano (effects/fills.ts): verde del logo di default, i quattro colori del logo con `?colori=logo`.
 * Due card accompagnano il disegno: la curiosità (una diversa a ogni giro) e la scheda del luogo.
 * Da 1200 px stanno ai lati del disegno, sotto sopra e sotto; compaiono quando le linee sono quasi
 * complete e se ne vanno con la dissolvenza del loop. Il loop si può mettere in pausa (WCAG 2.2.2) e si
 * ferma da solo con il puntatore o il focus su una card.
 */
/**
 * Il claim in tre righe, come nella demo di Stefano: «Cosenza, / città da / vivere.». Fino alla virgola,
 * poi il resto, poi l'ultima parola (in verde).
 */
function claimLines(title: string): string[] {
  const comma = title.indexOf(",");
  const head = comma >= 0 ? title.slice(0, comma + 1) : "";
  const words = title.slice(head.length).trim().split(/\s+/);
  const last = words.pop() ?? "";
  return [head, words.join(" "), last].filter(Boolean);
}

export function HeroDrawing({
  title,
  scenes,
  labels,
}: {
  title: string;
  scenes: Record<Kind, HeroScene>;
  labels: {
    nav: string;
    duomo: string;
    ponte: string;
    announce: Record<Kind, string>;
    art: Record<Kind, string>;
    curiosity: string;
    place: string;
    discover: string;
    pause: string;
    play: string;
  };
}) {
  const root = useRef<HTMLElement>(null);
  const [kind, setKind] = useState<Kind>("duomo");
  const [announcement, setAnnouncement] = useState("");
  const [paused, setPaused] = useState(false);
  const scene = scenes[kind];

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

  useEffect(() => {
    if (!root.current) return;
    // anteprima della variante con i colori del logo: ?colori=logo
    const palette: FillPalette = new URLSearchParams(window.location.search).get("colori") === "logo" ? "logo" : "verde";
    return initializeDrawing(root.current, DRAWINGS[kind], FILLS[kind], palette, CROPS[kind]);
  }, [kind]);

  // pausa scelta dall'utente: effects/drawing.ts legge data-drawing-paused
  useEffect(() => {
    root.current?.dispatchEvent(new CustomEvent("drawing:pause", { detail: paused }));
  }, [paused, kind]);

  return (
    <section ref={root} className="ca-hero-draw" data-drawing-kind={kind} aria-labelledby="hero-title">
      <div className="ca-hero-draw-brand">
        <h1 id="hero-title" className="ca-hero-draw-claim">
          {claimLines(title).map((line, i, all) => (
            <span key={i}>
              <span className="ca-hero-claim-line" style={{ "--i": i } as CSSProperties} data-accent={i === all.length - 1 || undefined}>
                <span>{line}</span>
              </span>
              {i < all.length - 1 && " "}
            </span>
          ))}
        </h1>
      </div>
      <div className="ca-hero-draw-stage">
        <article key={`place-${kind}`} className="ca-hero-card ca-hero-card--place" data-drawing-hold aria-labelledby="hero-place-title">
          <p className="ca-hero-card-eyebrow">{labels.place}</p>
          <h2 id="hero-place-title">{scene.title}</h2>
          <p className="ca-hero-card-text">{scene.description}</p>
          <Link className="ca-hero-card-link" href={scene.href}>
            <span>{labels.discover}</span>
            {arrow}
          </Link>
        </article>
        <div key={kind} className="ca-hero-draw-art" data-drawing-art role="img" aria-label={labels.art[kind]} />
        <aside key={`fact-${kind}`} className="ca-hero-card ca-hero-card--fact" data-drawing-hold aria-label={labels.curiosity}>
          <p className="ca-hero-card-eyebrow" aria-hidden="true">
            {labels.curiosity}
          </p>
          {scene.facts.map((fact, i) => (
            <div key={i} className="ca-hero-fact" data-fact={i}>
              <h3>{fact.title}</h3>
              <p className="ca-hero-card-text">{fact.text}</p>
            </div>
          ))}
        </aside>
      </div>
      <div className="ca-hero-draw-controls">
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
        </div>
        <button
          type="button"
          className="ca-hero-draw-pause"
          aria-pressed={paused}
          aria-label={labels.pause}
          title={paused ? labels.play : labels.pause}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </section>
  );
}
