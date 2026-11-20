import { describe, expect, it } from "vitest";
import { distanceM, type LngLat } from "@/lib/geo";
import { createGeofenceState, isWithin, smoothPosition, updateGeofences, type Fence } from "@/lib/geo/geofence";

const center: LngLat = [16.2547, 39.2878];
const fences: Fence[] = [{ id: "duomo", center, radiusM: 40 }];
/** Punto a `m` metri a nord del centro */
const north = (m: number): LngLat => [center[0], center[1] + m / 111_195];

describe("geofence con isteresi", () => {
  it("entra una sola volta anche con jitter al bordo", () => {
    const st = createGeofenceState();
    expect(updateGeofences(st, fences, north(100))).toEqual([]);
    const enter = updateGeofences(st, fences, north(35));
    expect(enter).toHaveLength(1);
    expect(enter[0]).toMatchObject({ type: "enter", id: "duomo" });
    // oscillazione attorno al raggio: nessun nuovo evento
    expect(updateGeofences(st, fences, north(45))).toEqual([]);
    expect(updateGeofences(st, fences, north(38))).toEqual([]);
    expect(updateGeofences(st, fences, north(52))).toEqual([]);
  });

  it("esce solo oltre raggio + isteresi", () => {
    const st = createGeofenceState();
    updateGeofences(st, fences, north(10));
    expect(updateGeofences(st, fences, north(54))).toEqual([]);
    expect(updateGeofences(st, fences, north(60))).toMatchObject([{ type: "exit", id: "duomo" }]);
  });

  it("ignora letture troppo imprecise", () => {
    const st = createGeofenceState();
    expect(updateGeofences(st, fences, north(5), 200)).toEqual([]);
    expect(st.inside.size).toBe(0);
  });

  it("gestisce più recinti indipendenti", () => {
    const st = createGeofenceState();
    const two: Fence[] = [...fences, { id: "vicino", center: north(30), radiusM: 20 }];
    const ev = updateGeofences(st, two, north(25));
    expect(ev.map((e) => e.id).sort()).toEqual(["duomo", "vicino"]);
  });
});

describe("isWithin (check-in Passaporto)", () => {
  it("accetta dentro il raggio, rifiuta fuori", () => {
    expect(isWithin(north(39), { center, radiusM: 40 })).toBe(true);
    expect(isWithin(north(41), { center, radiusM: 40 })).toBe(false);
  });
});

describe("smoothPosition", () => {
  it("con alta precisione segue la lettura", () => {
    const p = smoothPosition(center, north(20), 5);
    expect(distanceM(p, north(20))).toBeLessThan(0.5);
  });
  it("con bassa precisione smorza il salto", () => {
    const p = smoothPosition(center, north(40), 60);
    const d = distanceM(center, p);
    expect(d).toBeGreaterThan(5);
    expect(d).toBeLessThan(20);
  });
});
