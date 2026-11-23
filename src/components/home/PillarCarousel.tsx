"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/icons";

/**
 * Carosello orizzontale accessibile (pattern APG "carousel"): scroll-snap nativo per swipe e
 * trackpad, frecce prev/next, indicatori di posizione, ←/→/Home/End sulla traccia.
 * Lo scroll orizzontale resta dentro la traccia: la pagina non scorre di lato.
 */
export function PillarCarousel({
  label,
  slides,
  labels,
}: {
  label: string;
  slides: { id: string; title: string; node: React.ReactNode }[];
  labels: { prev: string; next: string; goTo: string[]; slide: string[] };
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const el = track.current;
    const slide = el?.children[index] as HTMLElement | undefined;
    if (!el || !slide) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft - pad, behavior: reduce ? "instant" : "smooth" });
  }, []);

  // indice attivo = slide più vicina al bordo di aggancio
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
        const x = el.scrollLeft + pad + el.offsetLeft;
        let best = 0;
        let dist = Infinity;
        [...el.children].forEach((c, i) => {
          const d = Math.abs((c as HTMLElement).offsetLeft - x);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = el.children.length - 1;
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // ancore #vive / #connect / #crea: porta in vista la card anche dentro la traccia
  useEffect(() => {
    const sync = () => {
      const i = slides.findIndex((s) => `#${s.id}` === window.location.hash);
      if (i >= 0) goTo(i);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [slides, goTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const n = slides.length;
    const to = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    goTo(Math.max(0, Math.min(n - 1, to)));
  };

  return (
    <div className="ca-carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={track} className="ca-carousel-track" tabIndex={0} onKeyDown={onKeyDown} aria-label={label}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            id={s.id}
            className="ca-carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${labels.slide[i]}: ${s.title}`}
          >
            {s.node}
          </div>
        ))}
      </div>
      <div className="site-container ca-carousel-controls">
        <div className="ca-carousel-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="ca-carousel-dot"
              aria-label={labels.goTo[i]}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="ca-carousel-arrows">
          <button type="button" className="ca-round-button" aria-label={labels.prev} disabled={active === 0} onClick={() => goTo(active - 1)}>
            <IconArrowLeft size={20} />
          </button>
          <button
            type="button"
            className="ca-round-button"
            aria-label={labels.next}
            disabled={active === slides.length - 1}
            onClick={() => goTo(active + 1)}
          >
            <IconArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
