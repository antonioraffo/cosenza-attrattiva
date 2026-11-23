"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import type { LngLat } from "@/lib/geo";
import { useMapLibre } from "@/components/map/useMapLibre";

/** Mappa del luogo dell'evento: un punto sulla mappa locale (nessun servizio esterno). */
export function EventMap({ position, label }: { position: LngLat; label: string }) {
  const locale = useLocale() as "it" | "en";
  const el = useRef<HTMLDivElement>(null);
  const map = useMapLibre(el, locale, { center: position, zoom: 16, interactive: true, cooperativeGestures: true });
  useEffect(() => {
    if (!map || map.getSource("event")) return;
    map.addSource("event", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: position } } });
    map.addLayer({ id: "event-halo", type: "circle", source: "event", paint: { "circle-radius": 18, "circle-color": "#9c37b5", "circle-opacity": 0.2 } });
    map.addLayer({
      id: "event-dot",
      type: "circle",
      source: "event",
      paint: { "circle-radius": 8, "circle-color": "#9c37b5", "circle-stroke-color": "#ffffff", "circle-stroke-width": 3 },
    });
  }, [map, position]);
  return <div ref={el} className="size-full bg-neutro-100" role="region" aria-label={label} />;
}
