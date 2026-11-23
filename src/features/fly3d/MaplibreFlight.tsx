"use client";

import { useLocale } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";
import { bearingDeg } from "@/lib/geo";
import { cosenzaStyle3D } from "@/lib/map/style";
import { hasWebGL2, useMapLibre } from "@/components/map/useMapLibre";
import { FlightOverlay, useFlight, type FlightStatus, type FlyStop } from "./FlightControls";

/**
 * Volo 3D con MapLibre (NEXT_PUBLIC_FLY3D_PROVIDER=maplibre, predefinito): camera inclinata "a drone"
 * sopra il rilievo e gli edifici estrusi della mappa locale. Nessuna chiave né servizio esterno,
 * quindi nessun consenso richiesto. Stessa coreografia del volo Google: si arriva a ogni tappa
 * dalla direzione della precedente.
 */
export function MaplibreFlight({ stops }: { stops: FlyStop[] }) {
  const locale = useLocale() as "it" | "en";
  const el = useRef<HTMLDivElement>(null);
  const [supported] = useState(() => typeof window === "undefined" || hasWebGL2());
  const start = stops[0]?.position ?? [16.2547, 39.2878];
  const options = useMemo(
    () => ({
      style: cosenzaStyle3D(window.location.origin, locale),
      // vista d'insieme iniziale da sud-ovest, in quota (come il volo Google)
      center: start,
      zoom: 13.6,
      pitch: 60,
      bearing: 25,
      maxPitch: 80,
      minZoom: 11,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo alla creazione della mappa
    [],
  );
  const map = useMapLibre(el, locale, options);
  const status: FlightStatus = !supported ? "error" : map ? "ready" : "loading";

  const flyTo = useCallback(
    (i: number) => {
      const stop = stops[i];
      if (!map || !stop) return;
      const prev = stops[i - 1]?.position ?? stops[i + 1]?.position ?? stop.position;
      const bearing = prev === stop.position ? map.getBearing() : bearingDeg(prev, stop.position);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const camera = { center: stop.position, zoom: 16.4, pitch: 66, bearing };
      if (reduce) map.jumpTo(camera);
      else map.flyTo({ ...camera, duration: 5000, curve: 1.6, essential: true });
    },
    [map, stops],
  );
  const flight = useFlight(stops, status, flyTo);

  return (
    <div className="relative size-full bg-neutro-900">
      <div ref={el} className="size-full" />
      <FlightOverlay stops={stops} status={status} flight={flight} />
    </div>
  );
}
