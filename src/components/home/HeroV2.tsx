"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { DEFAULT_START, TIME_OPTIONS } from "@/lib/plan";
import { initializeDrawing } from "./effects/drawing";
import { claimLines, DRAWINGS, type HeroScene, type Kind } from "./HeroDrawing";
import type { FeaturedItem } from "./featured";

/**
 * Hero v2 (hero predefinito, ?template=1; da HANDOFF-hero-v2): il disegno al tratto diventa una filigrana a tutta
 * larghezza, ancorata in basso come uno skyline, dietro a claim e colonna destra (switch Antica /
 * Contemporanea, foto del luogo, curiosità). Ciclo: il disegno si traccia (effects/drawing.ts con le opzioni
 * della filigrana) → la foto del luogo si rivela → pausa → luogo successivo. Sotto, lo slot «In evidenza»
 * (featured.ts) con il conto alla rovescia, solo lato client.
 * Pausa: ferma disegno, curiosità e avanzamento; con prefers-reduced-motion parte in pausa e a disegno completo.
 */
const KINDS: Kind[] = ["duomo", "ponte"];
const PHOTOS: Record<Kind, string> = { duomo: "/media/duomo-1.jpg", ponte: "/media/ponte-calatrava-1.jpg" };
const DRAW_MS = 4500;
const HOLD_MS = 9000;
const FADE_MS = 450;
const FACT_MS = 4200;

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

const arrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export interface HeroV2Labels {
  eyebrow: string;
  lead: string;
  time: string;
  timeOptions: Record<(typeof TIME_OPTIONS)[number], string>;
  nav: string;
  scene: Record<Kind, string>;
  era: Record<Kind, string>;
  placeKicker: Record<Kind, string>;
  art: Record<Kind, string>;
  curiosity: string;
  discover: string;
  drawing: string;
  step: Record<Kind, string>;
  pause: string;
  play: string;
  featured: {
    from: string;
    countdownLabel: string;
    started: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    discover: string;
    next: string;
  };
}

export function HeroV2({
  title,
  scenes,
  labels,
  featured,
}: {
  title: string;
  scenes: Record<Kind, HeroScene>;
  labels: HeroV2Labels;
  featured: FeaturedItem | null;
}) {
  const root = useRef<HTMLElement>(null);
  const [kind, setKind] = useState<Kind>("duomo");
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);
  // null = nessuna scelta dell'utente: in pausa solo con prefers-reduced-motion
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? reduced;
  const [fact, setFact] = useState({ kind, i: 0 });
  const scene = scenes[kind];
  const factIndex = fact.kind === kind ? fact.i : 0;


  useEffect(() => {
    if (!root.current) return;
    return initializeDrawing(root.current, DRAWINGS[kind], {
      align: "bottom",
      drawMs: DRAW_MS,
      holdMs: HOLD_MS,
      fadeMs: FADE_MS,
      linePx: 1.3,
      inkAlpha: 0.2,
      accentAlpha: 0.55,
      // a fine giro (disegno completo + pausa) si passa al luogo successivo
      onComplete: () => setKind((k) => KINDS[(KINDS.indexOf(k) + 1) % KINDS.length] ?? "duomo"),
    });
  }, [kind]);

  useEffect(() => {
    root.current?.dispatchEvent(new CustomEvent("drawing:pause", { detail: paused }));
  }, [paused, kind]);

  // curiosità a rotazione
  const facts = scene.facts;
  useEffect(() => {
    if (paused || facts.length < 2) return;
    const id = window.setInterval(() => setFact((f) => ({ kind, i: ((f.kind === kind ? f.i : 0) + 1) % facts.length })), FACT_MS);
    return () => window.clearInterval(id);
  }, [paused, kind, facts.length]);

  const lines = claimLines(title);

  return (
    <section ref={root} className="ca-hero2" data-hero-template="1" data-drawing-kind={kind} data-paused={paused || undefined} aria-labelledby="hero-title">
      <div className="ca-hero2-top">
        <div key={kind} className="ca-hero2-watermark" data-drawing-art role="img" aria-label={labels.art[kind]} />
        <div className="site-container">
          <div className="ca-hero2-grid">
            <div className="ca-hero2-copy">
              <span className="ca-hero2-eyebrow">
                <i aria-hidden="true" />
                {labels.eyebrow}
              </span>
              <h1 id="hero-title" className="ca-hero2-claim">
                {lines.map((line, i) => (
                  <span key={i}>
                    <span className="ca-hero-claim-line" style={{ "--i": i } as CSSProperties} data-accent={i === lines.length - 1 || undefined}>
                      <span>{line}</span>
                    </span>
                    {i < lines.length - 1 && " "}
                  </span>
                ))}
              </h1>
              <p className="ca-hero2-lead">{labels.lead}</p>
              <div className="ca-hero2-time">
                <span>{labels.time}</span>
                {TIME_OPTIONS.map((o) => (
                  <Link key={o} className="ca-hero2-chip" href={`/il-tuo-tempo?t=${o}&ora=${DEFAULT_START}`}>
                    {labels.timeOptions[o]}
                  </Link>
                ))}
              </div>
            </div>

            <div className="ca-hero2-stage">
              <div className="ca-hero2-switch">
                <div className="ca-hero2-seg" role="group" aria-label={labels.nav}>
                  {KINDS.map((k) => (
                    <button key={k} type="button" aria-pressed={kind === k} onClick={() => k !== kind && setKind(k)}>
                      {labels.scene[k]}
                    </button>
                  ))}
                </div>
                <span className="ca-hero2-step" aria-hidden="true">
                  {String(KINDS.indexOf(kind) + 1).padStart(2, "0")} / {String(KINDS.length).padStart(2, "0")}
                </span>
                <span className="sr-only">{labels.step[kind]}</span>
                <button
                  type="button"
                  className="ca-hero2-pause"
                  aria-pressed={paused}
                  aria-label={paused ? labels.play : labels.pause}
                  title={paused ? labels.play : labels.pause}
                  onClick={() => setUserPaused(!paused)}
                >
                  {paused ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 5l12 7-12 7z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
                    </svg>
                  )}
                </button>
                <div className="ca-hero2-progress" aria-hidden="true">
                  <i />
                </div>
              </div>

              <Link key={`place-${kind}`} className="ca-hero2-tile ca-hero2-photo" href={scene.href}>
                <span className="ca-hero2-photo-wait" aria-hidden="true">
                  {labels.drawing}
                </span>
                <Image src={PHOTOS[kind]} alt="" fill sizes="(max-width: 1080px) 50vw, 440px" />
                <span className="ca-hero2-photo-meta">
                  <span className="ca-hero2-kicker">{labels.placeKicker[kind]}</span>
                  <span className="ca-hero2-photo-title">{scene.title}</span>
                  <span className="ca-hero2-photo-text">{scene.description}</span>
                  <span className="ca-hero2-more">
                    {labels.discover} {arrow}
                  </span>
                </span>
              </Link>

              <aside className="ca-hero2-tile ca-hero2-fact" aria-label={labels.curiosity}>
                <p className="ca-hero2-kicker">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
                  </svg>
                  {labels.curiosity}
                </p>
                <div className="ca-hero2-facts" aria-live="polite">
                  {facts.map((f, i) => (
                    <div key={`${kind}-${i}`} className="ca-hero2-fact-item" data-on={i === factIndex || undefined} aria-hidden={i !== factIndex}>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  ))}
                </div>
                {facts.length > 1 && (
                  <div className="ca-hero2-dots" aria-hidden="true">
                    {facts.map((_, i) => (
                      <i key={`${kind}-${i}-${i === factIndex ? fact.i : "x"}`} data-state={i < factIndex ? "done" : i === factIndex ? "on" : undefined}>
                        <b style={{ animationDuration: `${FACT_MS}ms` }} />
                      </i>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>

      {featured && (
        <div className="site-container">
          <FeaturedSlot item={featured} labels={labels.featured} />
        </div>
      )}
    </section>
  );
}

const pin = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
const cal = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

function FeaturedSlot({ item, labels }: { item: FeaturedItem; labels: HeroV2Labels["featured"] }) {
  return (
    <article className="ca-feature" aria-labelledby="feature-title">
      <div className="ca-feature-media">
        {item.image && <Image src={item.image} alt="" fill sizes="(max-width: 640px) 100vw, 240px" />}
        {item.date && (
          <div className="ca-feature-date">
            <b>{item.date.day}</b>
            <small>{item.date.month}</small>
          </div>
        )}
      </div>
      <div className="ca-feature-body">
        <span className="ca-feature-badge">
          <i aria-hidden="true" />
          {item.label}
        </span>
        <h2 id="feature-title">{item.title}</h2>
        <div className="ca-feature-meta">
          {item.place && (
            <span>
              {pin}
              {item.place}
            </span>
          )}
          {item.time && (
            <span>
              {cal}
              {labels.from.replace("{time}", item.time)}
            </span>
          )}
          {item.category && <span>· {item.category}</span>}
        </div>
      </div>
      <div className="ca-feature-side">
        {item.kind === "evento" && item.countdownTo && <Countdown to={item.countdownTo} label={item.countdownLabel} labels={labels} />}
        <div className="ca-feature-ctas">
          <Link className="ca-feature-btn" href={item.href}>
            {labels.discover} {arrow}
          </Link>
          <Link className="ca-feature-all" href={item.allHref}>
            {item.allLabel}
          </Link>
        </div>
      </div>
      {item.next.length > 0 && (
        <div className="ca-feature-next">
          <strong>{labels.next}</strong>
          {item.next.map((n) => (
            <span key={n.href}>
              <span className="ca-feature-sep" aria-hidden="true">
                •
              </span>
              <Link href={n.href}>
                {n.date} — {n.title}
              </Link>
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

/** conto alla rovescia: solo nel browser (sul server e in idratazione mostra "--") */
function Countdown({ to, label, labels }: { to: string; label: string; labels: HeroV2Labels["featured"] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const first = window.setTimeout(() => setNow(Date.now()), 0);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  const left = now === null ? null : Math.max(0, Math.floor((new Date(to).getTime() - now) / 1000));
  const parts: [string, number | null][] = [
    [labels.days, left === null ? null : Math.floor(left / 86400)],
    [labels.hours, left === null ? null : Math.floor((left % 86400) / 3600)],
    [labels.minutes, left === null ? null : Math.floor((left % 3600) / 60)],
    [labels.seconds, left === null ? null : left % 60],
  ];
  return (
    <div>
      <div className="ca-countdown-label">{left === 0 ? labels.started : label}</div>
      <div className="ca-countdown" role="timer" aria-label={labels.countdownLabel}>
        {parts.map(([unit, v]) => (
          <div key={unit}>
            <b>{v === null ? "--" : String(v).padStart(2, "0")}</b>
            <small>{unit}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
