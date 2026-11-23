"use client";

import { useEffect, useRef } from "react";
import { initializeLowerEffects } from "./effects/lower";

/** Parte bassa della home: risale sopra l'ultimo pannello e ospita gli effetti allo scroll. */
export function LowerRoot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initializeLowerEffects(ref.current) : undefined), []);
  return (
    <div ref={ref} id="contenuti" className="ca-lower">
      {children}
    </div>
  );
}
