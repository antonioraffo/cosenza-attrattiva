"use client";

import Image from "next/image";
import { useId, useState } from "react";

interface Img {
  url: string;
  alt: string;
}

/** Confronto "Ieri e oggi": slider accessibile (input range nativo, tastiera e lettori di schermo). */
export function ThenNowSlider({
  then,
  now,
  labels,
}: {
  then: Img;
  now: Img;
  labels: { then: string; now: string; hint: string };
}) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="select-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-pietra-200 shadow-[var(--shadow-card)]">
        <Image src={now.url} alt={now.alt} fill sizes="(min-width: 768px) 700px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={then.url}
            alt={then.alt}
            fill
            sizes="(min-width: 768px) 700px, 100vw"
            className="object-cover sepia-[.35]"
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,.5)]" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-pietra-900 shadow-lg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">{labels.then}</span>
        <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">{labels.now}</span>
        <label htmlFor={id} className="sr-only">
          {labels.hint}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${labels.then} ${pos}%, ${labels.now} ${100 - pos}%`}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-2 text-center text-sm text-pietra-500">{labels.hint}</figcaption>
    </figure>
  );
}
