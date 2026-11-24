"use client";

/* eslint-disable @next/next/no-img-element -- logo SVG statico */
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { initializeDrawing } from "./effects/drawing";

type Kind = "duomo" | "ponte";

/** Disegni al tratto (gli stessi dell'intro silhouette): nero #1d1d1d e verde #0f7663. */
const DRAWINGS: Record<Kind, string> = {
  duomo: "/home/duomo-silhouette-lines.svg",
  ponte: "/home/ponte-calatrava-silhouette-lines.svg",
};

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
 * Hero della home: logo, claim e disegno al tratto che sta per intero nella prima schermata (100svh
 * meno l'header). Il disegno si traccia da solo e si ripete in loop (effects/drawing.ts); il selettore
 * Antica / Contemporanea passa dal Duomo al Ponte di Calatrava.
 * Due card accompagnano il disegno: la curiosità (una diversa a ogni giro) e la scheda del luogo.
 * Da 1200 px stanno ai lati del disegno, sotto sopra e sotto; compaiono quando le linee sono quasi
 * complete e se ne vanno con la dissolvenza del loop. Il loop si può mettere in pausa (WCAG 2.2.2) e si
 * ferma da solo con il puntatore o il focus su una card.
 */
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

  useEffect(() => (root.current ? initializeDrawing(root.current, DRAWINGS[kind]) : undefined), [kind]);

  // pausa scelta dall'utente: effects/drawing.ts legge data-drawing-paused
  useEffect(() => {
    root.current?.dispatchEvent(new CustomEvent("drawing:pause", { detail: paused }));
  }, [paused, kind]);

  return (
    <section ref={root} className="ca-hero-draw" data-drawing-kind={kind} aria-labelledby="hero-title">
      <div className="ca-hero-draw-brand">
        <img src="/brand/logo-h.svg" alt="Cosenza attrattiva" width={1384} height={437} fetchPriority="high" decoding="async" />
        <h1 id="hero-title" className="ca-hero-draw-claim">
          {title}
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
