"use client";

/* eslint-disable @next/next/no-img-element -- logo SVG statico */
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { initializeSilhouette, type SilhouetteScene } from "./effects/silhouette";

type Kind = "duomo" | "ponte";

/** Geometria dei disegni al tratto (coordinate nel viewBox dell'SVG), come in vivicosenza. */
const SCENES: Record<Kind, SilhouetteScene> = {
  duomo: {
    drawingUrl: "/home/duomo-silhouette-lines.svg",
    width: 1535,
    height: 1025,
    centerX: 615,
    curiosities: [
      { start: 0.16, x: 525, y: 260 },
      { start: 0.44, x: 710, y: 350 },
      { start: 0.72, x: 615, y: 590, placement: "above-point" },
    ],
  },
  ponte: {
    drawingUrl: "/home/ponte-calatrava-silhouette-lines.svg",
    width: 1536,
    height: 1024,
    centerX: 768,
    wide: true,
    curiosities: [
      { start: 0.16, x: 210, y: 420 },
      { start: 0.44, x: 1120, y: 610 },
      { start: 0.72, x: 768, y: 780, placement: "above-point" },
    ],
  },
};

export interface SceneText {
  label: string;
  title: string;
  description: string;
  href: string;
  facts: { title: string; text: string }[];
}

export function SilhouetteIntro({
  scenes,
  labels,
}: {
  scenes: Record<Kind, SceneText>;
  labels: { nav: string; duomo: string; ponte: string; discover: string; curiosities: string; claim: string; announce: Record<Kind, string> };
}) {
  const root = useRef<HTMLElement>(null);
  const [kind, setKind] = useState<Kind>("duomo");
  const [announcement, setAnnouncement] = useState("");
  const switched = useRef(false);
  const text = scenes[kind];

  useEffect(() => {
    const intro = root.current;
    if (!intro) return;
    const dispose = initializeSilhouette(intro, SCENES[kind]);
    if (switched.current) {
      // come nel riferimento: si riparte dall'inizio della scena e i pannelli si rimisurano
      const header = document.querySelector("#site-header .site-header-inner")?.getBoundingClientRect().height ?? 80;
      window.scrollTo({ top: Math.max(0, window.scrollY + intro.getBoundingClientRect().top - header), behavior: "instant" });
      intro.querySelector<HTMLButtonElement>(`[data-silhouette-switch="${kind}"]`)?.focus({ preventScroll: true });
      window.dispatchEvent(new Event("resize"));
    }
    return dispose;
  }, [kind]);

  const choose = (next: Kind) => {
    if (next === kind) return;
    switched.current = true;
    setKind(next);
    setAnnouncement(labels.announce[next]);
  };

  return (
    <section ref={root} className="cs-silhouette-intro" data-silhouette-intro data-silhouette-kind={kind} aria-label={text.label}>
      <div className="cs-silhouette-stage" data-silhouette-stage>
        <Fragment key={kind}>
          <div className="cs-silhouette-art" data-silhouette-art aria-hidden="true" />
          <div className="cs-silhouette-logo">
            <img src="/brand/logo-h.svg" alt="Cosenza attrattiva" width={1384} height={437} fetchPriority="high" decoding="async" />
            {/* claim del masterplan, dove vivi-cosenza ha il suo payoff ("una città da scoprire") */}
            <p className="cs-silhouette-claim" aria-hidden="true">
              {labels.claim}
            </p>
          </div>
          <div className="cs-silhouette-place" data-silhouette-place aria-hidden="true" inert>
            <h2>{text.title}</h2>
            <p>{text.description}</p>
            <Link className="cs-silhouette-place-link" href={text.href} tabIndex={-1}>
              {labels.discover}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
          <div className="cs-silhouette-markers">
            {text.facts.map((_, i) => (
              <span key={i} className="cs-silhouette-marker" data-silhouette-marker={i} aria-hidden="true">
                <span className="cs-silhouette-marker-core" />
              </span>
            ))}
          </div>
          <div className="cs-silhouette-facts" role="group" aria-label={labels.curiosities}>
            {text.facts.map((fact, i) => (
              <article
                key={i}
                className={`cs-silhouette-fact cs-silhouette-fact--${i + 1}`}
                data-silhouette-fact
                aria-labelledby={`cs-silhouette-fact-title-${i}`}
                aria-hidden="true"
              >
                <div className="cs-silhouette-fact-copy">
                  <h3 id={`cs-silhouette-fact-title-${i}`}>{fact.title}</h3>
                  <p>{fact.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Fragment>
        <div className="cs-silhouette-nav" role="group" aria-label={labels.nav}>
          {(["duomo", "ponte"] as const).map((k) => (
            <button
              key={k}
              className="cs-silhouette-nav-button"
              type="button"
              data-silhouette-switch={k}
              aria-pressed={kind === k}
              onClick={() => choose(k)}
            >
              <span>{labels[k]}</span>
            </button>
          ))}
          <span className="cs-silhouette-announcement" role="status" aria-live="polite">
            {announcement}
          </span>
        </div>
      </div>
      <div className="cs-silhouette-runway" data-silhouette-runway aria-hidden="true" />
    </section>
  );
}
