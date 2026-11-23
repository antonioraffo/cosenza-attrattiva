"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/icons";

/**
 * Carosello degli itinerari come vivicosenza: traccia orizzontale con frecce (una card per volta,
 * disabilitate agli estremi), ←/→/Home/End sulla traccia focalizzabile, swipe con scroll-snap.
 * Lo scroll-jacking della rotella del riferimento è stato escluso per accessibilità.
 * Sopra la traccia, il filtro per tema degli itinerari.
 */
export function ItineraryCarousel({
  cards,
  themes,
  labels,
}: {
  cards: { slug: string; theme: string; node: React.ReactNode }[];
  themes: Record<string, string>;
  labels: { label: string; prev: string; next: string; filter: string; all: string; empty: string; counts: Record<number, string> };
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const shown = active ? cards.filter((c) => c.theme === active) : cards;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [shown.length]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 24;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (first.offsetWidth + gap), behavior: reduce ? "instant" : "smooth" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const el = e.currentTarget;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      step(e.key === "ArrowRight" ? 1 : -1);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      el.scrollTo({ left: e.key === "Home" ? 0 : el.scrollWidth });
    }
  };

  const select = (theme: string | null) => {
    setActive(theme);
    track.current?.scrollTo({ left: 0 });
  };

  return (
    <>
      <div className="site-container ca-itinerary-controls" data-ir="controls">
        <div role="group" aria-label={labels.filter} className="ca-chips">
          <button type="button" className="ca-chip" aria-pressed={active === null} onClick={() => select(null)}>
            {labels.all}
          </button>
          {Object.entries(themes).map(([key, label]) => (
            <button key={key} type="button" className="ca-chip" aria-pressed={active === key} onClick={() => select(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="ca-carousel-arrows">
          <button type="button" className="ca-round-button ca-round-button--primary" aria-label={labels.prev} disabled={edges.start} onClick={() => step(-1)}>
            <IconArrowLeft size={20} />
          </button>
          <button type="button" className="ca-round-button ca-round-button--primary" aria-label={labels.next} disabled={edges.end} onClick={() => step(1)}>
            <IconArrowRight size={20} />
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {labels.counts[shown.length] ?? shown.length}
      </p>
      <div
        ref={track}
        className="ca-itinerary-track"
        role="region"
        aria-label={labels.label}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {shown.map((c) => (
          <div key={c.slug} className="ca-itinerary-item">
            {c.node}
          </div>
        ))}
      </div>
      {shown.length === 0 && <p className="site-container text-neutro-500">{labels.empty}</p>}
    </>
  );
}
