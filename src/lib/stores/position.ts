import type { LngLat } from "@/lib/geo";
import { createStore } from "./create-store";

/**
 * Sorgente unica della posizione per passeggiata, AR e check-in. La può alimentare
 * il GPS reale (watchPosition) oppure il simulatore demo: il resto dell'app non distingue.
 * La posizione non viene mai persistita né inviata al server.
 */
export interface PositionState {
  source: "none" | "gps" | "simulated";
  status: "idle" | "locating" | "active" | "denied" | "unavailable";
  position: LngLat | null;
  accuracyM: number;
  /** Rotta di marcia (GPS o simulatore), gradi da nord */
  course: number | null;
  updatedAt: number;
}

export const positionStore = createStore<PositionState>({
  source: "none",
  status: "idle",
  position: null,
  accuracyM: 0,
  course: null,
  updatedAt: 0,
});

let watchId: number | null = null;

export function startGps() {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    positionStore.set((s) => ({ ...s, status: "unavailable" }));
    return;
  }
  stopGps();
  positionStore.set((s) => ({ ...s, source: "gps", status: "locating" }));
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      if (positionStore.get().source !== "gps") return;
      positionStore.set({
        source: "gps",
        status: "active",
        position: [pos.coords.longitude, pos.coords.latitude],
        accuracyM: pos.coords.accuracy,
        course: Number.isFinite(pos.coords.heading) ? pos.coords.heading : null,
        updatedAt: pos.timestamp,
      });
    },
    (err) => {
      positionStore.set((s) => ({ ...s, status: err.code === err.PERMISSION_DENIED ? "denied" : "unavailable" }));
    },
    { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 },
  );
}

export function stopGps() {
  if (watchId !== null) navigator.geolocation.clearWatch(watchId);
  watchId = null;
}

export function setSimulatedPosition(position: LngLat, course: number | null = null) {
  stopGps();
  positionStore.set({ source: "simulated", status: "active", position, accuracyM: 5, course, updatedAt: Date.now() });
}

export function stopPosition() {
  stopGps();
  positionStore.set({ source: "none", status: "idle", position: null, accuracyM: 0, course: null, updatedAt: 0 });
}

/** Lettura singola (check-in dalla scheda luogo): usa la simulazione se attiva. */
export function getCurrentPosition(): Promise<{ position: LngLat; accuracyM: number }> {
  const s = positionStore.get();
  if (s.source === "simulated" && s.position) return Promise.resolve({ position: s.position, accuracyM: s.accuracyM });
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("unavailable"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ position: [p.coords.longitude, p.coords.latitude], accuracyM: p.coords.accuracy }),
      reject,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );
  });
}
