"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Navigatore di sezione ("In evidenza") di vivicosenza: pillola fissa in basso con anello di
 * avanzamento; apre il menu "Vai alla sezione". Compare quando l'intro è superata e sparisce
 * vicino al footer o con il menu del sito aperto.
 */
export function SectionNav({
  sections,
  labels,
}: {
  sections: { id: string; label: string }[];
  labels: { label: string; open: string; close: string };
}) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const intro = document.querySelector("[data-silhouette-intro]");
      const footer = document.getElementById("site-footer");
      const menuOpen = document.querySelector("#mobile-nav:not([hidden])");
      const y = window.scrollY;
      const start = intro ? intro.getBoundingClientRect().bottom + y - window.innerHeight * 0.5 : 0;
      const end = footer ? footer.getBoundingClientRect().top + y - window.innerHeight : document.body.scrollHeight;
      setVisible(y > start && y < end && !menuOpen);
      setProgress(Math.max(0, Math.min(1, (y - start) / Math.max(1, end - start))));
      let idx = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) idx = i;
      });
      setCurrent(idx);
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const show = visible || open;
  return (
    <div ref={root} className={`ca-section-nav${show ? " is-visible" : ""}`} inert={!show}>
      <nav id="section-nav-menu" className="ca-section-nav-menu" aria-label={labels.open} hidden={!open}>
        <p>{labels.open}</p>
        <ul>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={i === current ? "location" : undefined} onClick={() => setOpen(false)}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        className="ca-section-nav-pill"
        aria-expanded={open}
        aria-controls="section-nav-menu"
        aria-label={open ? labels.close : `${labels.label} – ${labels.open}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="ca-section-nav-ring" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="15.9" pathLength="100" />
          <circle cx="18" cy="18" r="15.9" pathLength="100" style={{ strokeDashoffset: 100 - progress * 100 }} />
          <g transform="translate(13 13)" fill="currentColor">
            <circle cx="2" cy="2" r="1.3" />
            <circle cx="8" cy="2" r="1.3" />
            <circle cx="2" cy="8" r="1.3" />
            <circle cx="8" cy="8" r="1.3" />
          </g>
        </svg>
        <span>{sections[current]?.label ?? labels.label}</span>
        <svg className="ca-section-nav-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="m7 14 5-5 5 5" />
        </svg>
      </button>
    </div>
  );
}
