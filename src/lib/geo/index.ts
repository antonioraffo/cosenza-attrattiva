/** Funzioni geografiche pure (nessuna dipendenza dal browser): testate con Vitest. */
export type LngLat = [number, number];

const R = 6_371_008.8; // raggio medio terrestre (m)
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** Distanza in metri (formula dell'haversine). */
export function distanceM([lng1, lat1]: LngLat, [lng2, lat2]: LngLat): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Rotta iniziale da a verso b, in gradi 0–360 (0 = nord, 90 = est). */
export function bearingDeg([lng1, lat1]: LngLat, [lng2, lat2]: LngLat): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return normalizeDeg(toDeg(Math.atan2(y, x)));
}

export function normalizeDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

/** Differenza angolare con segno in (-180, 180]: positivo = target a destra. */
export function angleDiff(from: number, to: number): number {
  const d = normalizeDeg(to - from);
  return d > 180 ? d - 360 : d;
}

/** Punto cardinale (8 settori) per una rotta. */
export function cardinal(deg: number, locale: "it" | "en" = "it"): string {
  const it = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const en = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(normalizeDeg(deg) / 45) % 8;
  return (locale === "it" ? it : en)[i]!;
}

/** Lunghezza di una polilinea in metri. */
export function lineLengthM(line: LngLat[]): number {
  let total = 0;
  for (let i = 1; i < line.length; i++) total += distanceM(line[i - 1]!, line[i]!);
  return total;
}

/**
 * Proiezione di un punto sulla polilinea: distanza lungo il percorso (m) del punto
 * più vicino. Approssimazione equirettangolare locale, adeguata a scala urbana.
 */
export function locateOnLine(line: LngLat[], p: LngLat): { alongM: number; offM: number } {
  let best = { alongM: 0, offM: Infinity };
  let acc = 0;
  const kx = Math.cos(toRad(p[1])) * 111_320;
  const ky = 110_540;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1]!;
    const b = line[i]!;
    const ax = (a[0] - p[0]) * kx, ay = (a[1] - p[1]) * ky;
    const bx = (b[0] - p[0]) * kx, by = (b[1] - p[1]) * ky;
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
    const cx = ax + t * dx, cy = ay + t * dy;
    const off = Math.hypot(cx, cy);
    const segLen = Math.sqrt(len2);
    if (off < best.offM) best = { alongM: acc + t * segLen, offM: off };
    acc += segLen;
  }
  return best;
}

/** Spezza la polilinea alla distanza `alongM`: restituisce [fatto, rimanente]. */
export function splitLineAt(line: LngLat[], alongM: number): [LngLat[], LngLat[]] {
  if (line.length < 2) return [line, line];
  let acc = 0;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1]!;
    const b = line[i]!;
    const seg = distanceM(a, b);
    if (acc + seg >= alongM) {
      const t = seg === 0 ? 0 : (alongM - acc) / seg;
      const mid: LngLat = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      return [[...line.slice(0, i), mid], [mid, ...line.slice(i)]];
    }
    acc += seg;
  }
  return [line, [line[line.length - 1]!]];
}

/** Punto alla distanza `alongM` lungo la polilinea (per il simulatore di passeggiata). */
export function pointAlong(line: LngLat[], alongM: number): LngLat {
  const [done] = splitLineAt(line, Math.max(0, alongM));
  return done[done.length - 1]!;
}

/** Bounding box [minLng, minLat, maxLng, maxLat]. */
export function bbox(points: LngLat[]): [number, number, number, number] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX, maxY];
}

/** Formattazione leggibile di una distanza. */
export function formatDistance(m: number, locale: "it" | "en" = "it"): string {
  if (m < 1000) return `${Math.round(m / 5) * 5} m`;
  return `${(m / 1000).toLocaleString(locale === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 1 })} km`;
}
