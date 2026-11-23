"use client";

import { useId, useState } from "react";

/**
 * Card evento editoriale come vivicosenza: senza foto, data grande, titolo, luogo, categoria;
 * "Scopri di più" apre i dettagli e colora la card (anche al passaggio del mouse).
 */
export function EventCard({
  dates,
  title,
  place,
  category,
  description,
  schedule,
  source,
  labels,
}: {
  dates: { day: string; month: string }[];
  title: string;
  place: string;
  category: string;
  description: string;
  schedule: string;
  source: string;
  labels: { more: string; less: string; source: string };
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const id = useId();
  const expanded = open || hover;
  return (
    <article
      className={`ca-event-card${expanded ? " is-open" : ""}`}
      aria-labelledby={`${id}-title`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="ca-event-surface">
        <p className="ca-event-date">
          {dates.map((d, i) => (
            <span key={i} className="ca-event-date-group">
              {i > 0 && (
                <span className="ca-event-date-sep" aria-hidden="true">
                  –
                </span>
              )}
              <span className="ca-event-date-point">
                <strong>{d.day}</strong>
                <span>{d.month}</span>
              </span>
            </span>
          ))}
        </p>
        <div className="ca-event-main">
          <h3 id={`${id}-title`}>{title}</h3>
          <p className="ca-event-place">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {place}
          </p>
          <div className="ca-event-reveal" id={`${id}-details`} hidden={!expanded}>
            <p>{description}</p>
            <p className="ca-event-schedule">{schedule}</p>
            <a href={source} target="_blank" rel="noopener noreferrer" className="ca-event-source">
              {labels.source}
              <span className="sr-only"> – {title}</span> ↗
            </a>
          </div>
        </div>
        <div className="ca-event-footer">
          <span className="ca-event-category">{category}</span>
          <button
            type="button"
            className="ca-event-toggle"
            aria-expanded={expanded}
            aria-controls={`${id}-details`}
            onClick={() => setOpen((o) => !o)}
          >
            <span>
              {expanded ? labels.less : labels.more}
              <span className="sr-only">: {title}</span>
            </span>
            <span className="ca-event-toggle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
