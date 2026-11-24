import "server-only";
import { setDefaultResultOrder } from "node:dns";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";
import { distanceM, type LngLat } from "@/lib/geo";

// nel container l'IPv6 non è instradato: senza questo fetch verso OSRM resta appeso fino al timeout
setDefaultResultOrder("ipv4first");
setDefaultAutoSelectFamilyAttemptTimeout(3000);

const OSRM = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";
const MAX_CACHE = 200;
const cache = new Map<string, WalkingRoute>();

export interface WalkingRoute {
  coordinates: LngLat[];
  distanceM: number;
  /** "osrm" = percorso pedonale reale; "straight" = linea retta (servizio non raggiungibile). */
  source: "osrm" | "straight";
}

const straight = (points: LngLat[]): WalkingRoute => ({
  coordinates: points,
  distanceM: Math.round(points.slice(1).reduce((m, p, i) => m + distanceM(points[i]!, p), 0)),
  source: "straight",
});

/**
 * Percorso pedonale reale tra le tappe (OSRM, profilo "foot", © OpenStreetMap). Si inviano solo le
 * coordinate dei luoghi scelti, mai la posizione del visitatore. Risultati in cache in memoria;
 * se il servizio non risponde entro 5 s si torna alla linea retta (non in cache, si riprova).
 */
export async function walkingRoute(points: LngLat[]): Promise<WalkingRoute> {
  if (points.length < 2) return straight(points);
  const coords = points.map(([lng, lat]) => `${lng.toFixed(6)},${lat.toFixed(6)}`).join(";");
  const hit = cache.get(coords);
  if (hit) return hit;
  try {
    const res = await fetch(`${OSRM}/${coords}?overview=full&geometries=geojson`, {
      headers: { "User-Agent": "CosenzaAttrattivaDemo/0.1 (local tourism demo)" },
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) return straight(points);
    const json = (await res.json()) as { routes?: { geometry: { coordinates: LngLat[] }; distance: number }[] };
    const r = json.routes?.[0];
    if (!r) return straight(points);
    const route: WalkingRoute = {
      coordinates: r.geometry.coordinates.map(([x, y]) => [+x.toFixed(6), +y.toFixed(6)] as LngLat),
      distanceM: Math.round(r.distance),
      source: "osrm",
    };
    if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
    cache.set(coords, route);
    return route;
  } catch {
    return straight(points);
  }
}
