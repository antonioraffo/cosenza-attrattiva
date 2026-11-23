"use client";

import { useEffect, useState } from "react";
import type { LngLat } from "@/lib/geo";
import type { Localized } from "@/server/db/schema";

export interface ApiPlace {
  slug: string;
  name: Localized;
  category: string;
  position: LngLat;
  image: string | null;
}

let cache: Promise<ApiPlace[]> | null = null;

/** Elenco dei luoghi (API pubblica, in cache nel service worker) per mostrare le tappe salvate. */
export function usePlaces(enabled = true) {
  const [places, setPlaces] = useState<ApiPlace[] | null>(null);
  useEffect(() => {
    if (!enabled) return;
    cache ??= fetch("/api/places")
      .then((r) => r.json() as Promise<ApiPlace[]>)
      .catch(() => {
        cache = null;
        return [];
      });
    let alive = true;
    void cache.then((p) => alive && setPlaces(p));
    return () => {
      alive = false;
    };
  }, [enabled]);
  return places;
}

/** Minuti a piedi stimati su una spezzata (distanza in linea d'aria × 1,3, 75 m al minuto). */
export function walkMinutes(points: LngLat[]) {
  let m = 0;
  for (let i = 1; i < points.length; i++) {
    const [a, b] = [points[i - 1]!, points[i]!];
    const dy = (b[1] - a[1]) * 111_320;
    const dx = (b[0] - a[0]) * 111_320 * Math.cos((a[1] * Math.PI) / 180);
    m += Math.hypot(dx, dy);
  }
  return Math.max(1, Math.round((m * 1.3) / 75));
}
