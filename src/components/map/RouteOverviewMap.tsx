"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { bbox, type LngLat } from "@/lib/geo";
import { addItineraryLayers, setItineraryProgress, type StopFeature } from "./itineraryLayers";
import { useMapLibre } from "./useMapLibre";

/** Mappa riassuntiva del percorso (pagina itinerario). */
export function RouteOverviewMap({
  route,
  stops,
  color,
  label,
}: {
  route: LngLat[];
  stops: StopFeature[];
  color: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale() as "it" | "en";
  const map = useMapLibre(ref, locale, { interactive: true, dragRotate: false, pitchWithRotate: false });

  useEffect(() => {
    if (!map) return;
    addItineraryLayers(map, route, stops, color);
    setItineraryProgress(map, route, 0, stops, -1);
    const [minX, minY, maxX, maxY] = bbox([...route, ...stops.map((s) => s.position)]);
    map.fitBounds([[minX, minY], [maxX, maxY]], { padding: 40, duration: 0 });
    map.scrollZoom.disable();
  }, [map, route, stops, color]);

  return <div ref={ref} role="region" aria-label={label} className="size-full bg-pietra-100" />;
}
