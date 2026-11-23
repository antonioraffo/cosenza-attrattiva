import { distanceM, type LngLat } from "@/lib/geo";
import type { Pillar } from "@/components/layout/PillarIcon";

/** Gruppi di filtro di Esplora (dal prototipo "Città da vivere"), per categoria del luogo. */
export const EXPLORE_GROUPS = {
  arte: ["chiesa", "museo", "monumento", "opera-arte", "architettura", "teatro", "scienza"],
  piazze: ["piazza", "strada", "quartiere"],
  gusto: ["cantina"],
  natura: ["parco", "paesaggio"],
} as const;
export type ExploreGroup = keyof typeof EXPLORE_GROUPS;

export function groupOf(category: string): ExploreGroup {
  for (const [g, cats] of Object.entries(EXPLORE_GROUPS)) if ((cats as readonly string[]).includes(category)) return g as ExploreGroup;
  return "arte";
}

/**
 * Pilastro di ogni luogo: strade e piazze sono la città che "vive" (eventi, passeggio, commercio),
 * le cantine sono produzione locale ("crea"), tutto il resto è patrimonio da "connettere".
 */
export function pillarOf(category: string): Pillar {
  if (category === "strada" || category === "piazza") return "vive";
  if (category === "cantina") return "crea";
  return "connect";
}

/** Punto di riferimento per i tempi a piedi: Piazza dei Bruzi (Palazzo dei Bruzi, sede del Comune), coordinate approssimate. */
export const EXPLORE_ORIGIN: LngLat = [16.2538, 39.2949];

/** Minuti a piedi stimati (linea d'aria × 1,3, 75 m al minuto). */
export function walkMinutesFrom(origin: LngLat, to: LngLat) {
  return Math.max(1, Math.round((distanceM(origin, to) * 1.3) / 75));
}
