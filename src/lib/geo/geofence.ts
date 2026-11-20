import { distanceM, type LngLat } from "./index";

/**
 * Geofence con isteresi: si entra entro `radius`, si esce oltre `radius + hysteresis`.
 * Evita che il rumore GPS (±10–20 m in città) faccia scattare l'arrivo più volte.
 */
export interface Fence {
  id: string;
  center: LngLat;
  radiusM: number;
}

export interface GeofenceState {
  inside: Set<string>;
}

export type GeofenceEvent = { type: "enter" | "exit"; id: string; distanceM: number };

export const DEFAULT_HYSTERESIS_M = 15;
/** Letture con accuratezza peggiore di questa soglia vengono ignorate. */
export const MAX_ACCURACY_M = 60;

export function createGeofenceState(): GeofenceState {
  return { inside: new Set() };
}

export function updateGeofences(
  state: GeofenceState,
  fences: Fence[],
  position: LngLat,
  accuracyM = 0,
  hysteresisM = DEFAULT_HYSTERESIS_M,
): GeofenceEvent[] {
  if (accuracyM > MAX_ACCURACY_M) return [];
  const events: GeofenceEvent[] = [];
  for (const f of fences) {
    const d = distanceM(position, f.center);
    const wasInside = state.inside.has(f.id);
    if (!wasInside && d <= f.radiusM) {
      state.inside.add(f.id);
      events.push({ type: "enter", id: f.id, distanceM: d });
    } else if (wasInside && d > f.radiusM + hysteresisM) {
      state.inside.delete(f.id);
      events.push({ type: "exit", id: f.id, distanceM: d });
    }
  }
  return events;
}

/** true se la posizione è entro il raggio (usato per il check-in del Passaporto). */
export function isWithin(position: LngLat, fence: Pick<Fence, "center" | "radiusM">): boolean {
  return distanceM(position, fence.center) <= fence.radiusM;
}

/**
 * Media mobile esponenziale delle posizioni pesata sull'accuratezza: smussa il jitter
 * del GPS senza introdurre troppo ritardo.
 */
export function smoothPosition(prev: LngLat | null, next: LngLat, accuracyM: number): LngLat {
  if (!prev) return next;
  const alpha = Math.max(0.25, Math.min(1, 15 / Math.max(accuracyM, 1)));
  return [prev[0] + (next[0] - prev[0]) * alpha, prev[1] + (next[1] - prev[1]) * alpha];
}
