import type { GeoJSONSource, Map as MLMap } from "maplibre-gl";
import { lineLengthM, splitLineAt, type LngLat } from "@/lib/geo";

export interface StopFeature {
  id: number;
  position: LngLat;
  label: string;
  name: string;
}

/** Linea GeoJSON; con meno di due punti (itinerario senza percorso) una collezione vuota. */
const line = (coordinates: LngLat[]) =>
  coordinates.length >= 2
    ? { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates } }
    : { type: "FeatureCollection" as const, features: [] };

/** Aggiunge percorso (fatto/rimanente) e tappe numerate. Idempotente. */
export function addItineraryLayers(map: MLMap, route: LngLat[], stops: StopFeature[], color: string) {
  if (map.getSource("route-rest")) return;
  map.addSource("route-rest", { type: "geojson", data: line(route) });
  map.addSource("route-done", { type: "geojson", data: line(route.slice(0, 1)) });
  map.addSource("stops", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: stops.map((s) => ({
        type: "Feature",
        id: s.id,
        properties: { label: s.label, name: s.name },
        geometry: { type: "Point", coordinates: s.position },
      })),
    },
  });

  map.addLayer({
    id: "route-casing",
    type: "line",
    source: "route-rest",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#ffffff", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 5, 18, 12], "line-opacity": 0.9 },
  });
  map.addLayer({
    id: "route-rest",
    type: "line",
    source: "route-rest",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": color,
      "line-opacity": 0.45,
      "line-width": ["interpolate", ["linear"], ["zoom"], 13, 2, 18, 5],
      "line-dasharray": [1.5, 1.6],
    },
  });
  map.addLayer({
    id: "route-done",
    type: "line",
    source: "route-done",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": color, "line-width": ["interpolate", ["linear"], ["zoom"], 13, 3.5, 18, 8] },
  });
  map.addLayer({
    id: "stops-halo",
    type: "circle",
    source: "stops",
    paint: {
      "circle-radius": ["case", ["boolean", ["feature-state", "active"], false], 22, 0],
      "circle-color": color,
      "circle-opacity": 0.22,
      "circle-radius-transition": { duration: 400 },
    },
  });
  map.addLayer({
    id: "stops",
    type: "circle",
    source: "stops",
    paint: {
      "circle-radius": ["case", ["boolean", ["feature-state", "active"], false], 14, 11],
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "active"], false],
        color,
        ["boolean", ["feature-state", "done"], false],
        color,
        "#ffffff",
      ],
      "circle-stroke-color": color,
      "circle-stroke-width": 2.5,
    },
  });
  map.addLayer({
    id: "stops-label",
    type: "symbol",
    source: "stops",
    layout: {
      "text-field": ["get", "label"],
      "text-font": ["Noto Sans Medium"],
      "text-size": 12,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": [
        "case",
        ["any", ["boolean", ["feature-state", "active"], false], ["boolean", ["feature-state", "done"], false]],
        "#ffffff",
        color,
      ],
    },
  });
}

/** Aggiorna il tratto percorso fino a `fraction` (0–1) e lo stato delle tappe. */
export function setItineraryProgress(map: MLMap, route: LngLat[], fraction: number, stops: StopFeature[], activeIndex: number) {
  stops.forEach((s, i) => {
    map.setFeatureState({ source: "stops", id: s.id }, { active: i === activeIndex, done: i < activeIndex });
  });
  if (route.length < 2) return;
  const total = lineLengthM(route);
  const [done, rest] = splitLineAt(route, total * Math.max(0, Math.min(1, fraction)));
  (map.getSource("route-done") as GeoJSONSource | undefined)?.setData(line(done));
  (map.getSource("route-rest") as GeoJSONSource | undefined)?.setData(line(rest.length > 1 ? rest : route.slice(-1)));
}

export function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
