"use client";

import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ExpressionSpecification, GeoJSONSource, LngLatBoundsLike } from "maplibre-gl";
import { bbox, type LngLat } from "@/lib/geo";
import type { Plan } from "@/lib/plan";
import { useMapLibre } from "@/components/map/useMapLibre";
import type { TimeItinerary } from "./TimePlanner";

type Feature = {
  type: "Feature";
  properties: Record<string, string>;
  geometry: { type: "LineString"; coordinates: LngLat[] } | { type: "Point"; coordinates: LngLat };
};

/**
 * Mappa del giro: il percorso pedonale di ogni itinerario nel suo colore, numerato nell'ordine del giro,
 * e i trasferimenti a piedi tratteggiati (dalla fine di un itinerario all'inizio del successivo).
 * `active` evidenzia l'itinerario sotto il puntatore nella linea del tempo.
 */
export function TimeMap({ plan, itineraries, active, label }: { plan: Plan; itineraries: Map<string, TimeItinerary>; active: string | null; label: string }) {
  const locale = useLocale() as "it" | "en";
  const el = useRef<HTMLDivElement>(null);
  // la mappa (WebGL) parte solo quando sta per entrare nello schermo: su mobile è sotto la piega
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: "200px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);
  const map = useMapLibre(el, locale, { cooperativeGestures: true }, near && plan.slugs.length > 0);

  const { data, points } = useMemo(() => {
    const features: Feature[] = [];
    const points: LngLat[] = [];
    let n = 0;
    for (const day of plan.days) {
      let lastEnd: LngLat | null = null;
      for (const item of day.items) {
        if (item.type !== "itinerary") continue;
        const it = itineraries.get(item.slug);
        if (!it) continue;
        n++;
        const stops = it.stops.map((s) => s.position).filter((p): p is LngLat => !!p);
        const line = it.route ?? stops;
        if (lastEnd && stops[0])
          features.push({ type: "Feature", properties: { kind: "transfer" }, geometry: { type: "LineString", coordinates: [lastEnd, stops[0]] } });
        if (line.length > 1)
          features.push({ type: "Feature", properties: { kind: "route", slug: it.slug, color: it.color }, geometry: { type: "LineString", coordinates: line } });
        for (const s of stops) features.push({ type: "Feature", properties: { kind: "stop", slug: it.slug, color: it.color }, geometry: { type: "Point", coordinates: s } });
        if (stops[0])
          features.push({ type: "Feature", properties: { kind: "start", slug: it.slug, color: it.color, n: String(n) }, geometry: { type: "Point", coordinates: stops[0] } });
        points.push(...line);
        lastEnd = stops.at(-1) ?? lastEnd;
      }
    }
    return { data: { type: "FeatureCollection" as const, features }, points };
  }, [plan, itineraries]);

  useEffect(() => {
    if (!map) return;
    const src = map.getSource("time") as GeoJSONSource | undefined;
    if (src) src.setData(data);
    else {
      map.addSource("time", { type: "geojson", data });
      map.addLayer({
        id: "time-transfer",
        type: "line",
        source: "time",
        filter: ["==", ["get", "kind"], "transfer"],
        paint: { "line-color": "#5b5551", "line-width": 2.5, "line-dasharray": [1.5, 1.5] },
      });
      map.addLayer({
        id: "time-route",
        type: "line",
        source: "time",
        filter: ["==", ["get", "kind"], "route"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ["get", "color"], "line-width": 4 },
      });
      map.addLayer({
        id: "time-stop",
        type: "circle",
        source: "time",
        filter: ["==", ["get", "kind"], "stop"],
        paint: { "circle-radius": 4.5, "circle-color": "#ffffff", "circle-stroke-color": ["get", "color"], "circle-stroke-width": 2.5 },
      });
      map.addLayer({
        id: "time-start",
        type: "circle",
        source: "time",
        filter: ["==", ["get", "kind"], "start"],
        paint: { "circle-radius": 12, "circle-color": ["get", "color"], "circle-stroke-color": "#ffffff", "circle-stroke-width": 2.5 },
      });
      map.addLayer({
        id: "time-n",
        type: "symbol",
        source: "time",
        filter: ["==", ["get", "kind"], "start"],
        layout: { "text-field": ["get", "n"], "text-size": 12, "text-font": ["Noto Sans Medium"], "text-allow-overlap": true, "icon-allow-overlap": true },
        paint: { "text-color": "#ffffff" },
      });
    }
    if (points.length > 1) map.fitBounds(bbox(points) as LngLatBoundsLike, { padding: 40, maxZoom: 16, duration: 0 });
  }, [map, data, points]);

  // evidenzia l'itinerario attivo, attenua gli altri
  useEffect(() => {
    if (!map || !map.getLayer("time-route")) return;
    const on: ExpressionSpecification = ["==", ["get", "slug"], active ?? ""];
    map.setPaintProperty("time-route", "line-width", active ? ["case", on, 6, 3] : 4);
    map.setPaintProperty("time-route", "line-opacity", active ? ["case", on, 1, 0.45] : 1);
  }, [map, active, data]);

  return <div ref={el} className="ca-time-map" role="region" aria-label={label} />;
}
