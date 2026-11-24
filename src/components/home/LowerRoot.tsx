"use client";

import { useEffect, useRef } from "react";
import { initializeLowerEffects } from "./effects/lower";

/**
 * Parte bassa della home: ospita gli effetti allo scroll (titoli che si scrivono, blocchi che entrano).
 * `overlap` la fa risalire sopra l'ultimo pannello sticky (home con i pannelli MAB/Duomo/San Domenico).
 */
export function LowerRoot({ children, overlap = true }: { children: React.ReactNode; overlap?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initializeLowerEffects(ref.current) : undefined), []);
  return (
    <div ref={ref} id="contenuti" className={overlap ? "ca-lower" : "ca-lower ca-lower--flat"}>
      {children}
    </div>
  );
}
