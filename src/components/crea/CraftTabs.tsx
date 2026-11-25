"use client";

import { useRef, useState } from "react";
import { PillarIcon } from "@/components/layout/PillarIcon";

/**
 * Mestieri di "Bottega Cosenza" (dal prototipo: scegli un mestiere e cambia l'immagine), come schede
 * accessibili (pattern APG "tabs": frecce, Home/End, attivazione automatica).
 */
export function CraftTabs({
  crafts,
  label,
  photoTodo,
}: {
  crafts: { key: string; name: string; text: string }[];
  label: string;
  photoTodo: string;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    const n = crafts.length;
    const next = (i + n) % n;
    setActive(next);
    tabs.current[next]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const to = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: crafts.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    select(to);
  };
  const c = crafts[active]!;
  return (
    <div className="ca-crafts">
      <div role="tablist" aria-label={label} className="ca-chips ca-crafts-tabs" onKeyDown={onKey}>
        {crafts.map((cr, i) => (
          <button
            key={cr.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`craft-tab-${cr.key}`}
            aria-selected={i === active}
            aria-controls={`craft-panel-${cr.key}`}
            tabIndex={i === active ? 0 : -1}
            className="ca-chip ca-chip--dark"
            onClick={() => setActive(i)}
          >
            {cr.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`craft-panel-${c.key}`} aria-labelledby={`craft-tab-${c.key}`} className="ca-crafts-panel" tabIndex={0}>
        <p className="ca-crafts-text">
          <strong>{c.name}.</strong> {c.text}
        </p>
        <figure className="ca-crafts-visual" aria-hidden="true">
          <PillarIcon pillar="crea" size={120} />
          <figcaption>{photoTodo}</figcaption>
        </figure>
      </div>
    </div>
  );
}
