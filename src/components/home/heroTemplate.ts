import type { FillPalette } from "./effects/fills";

/**
 * Varianti dell'hero, scelte con ?template= nell'indirizzo della home (anteprime da confrontare):
 *   1  disegno al tratto che si colora con il verde del logo (predefinito, anche senza parametro)
 *   2  lo stesso disegno con i quattro colori del logo
 *   3  da definire: per ora uguale all'1
 * Un valore mancante o non valido vale 1. Il vecchio ?colori=logo vale ancora come 2.
 */
export type HeroTemplate = 1 | 2 | 3;

export const HERO_TEMPLATES: readonly HeroTemplate[] = [1, 2, 3];

export function readHeroTemplate(search: string): HeroTemplate {
  const params = new URLSearchParams(search);
  const n = Number(params.get("template"));
  if ((HERO_TEMPLATES as readonly number[]).includes(n)) return n as HeroTemplate;
  return params.get("colori") === "logo" ? 2 : 1;
}

/** colori dei riempimenti per ogni template */
export const TEMPLATE_PALETTE: Record<HeroTemplate, FillPalette> = { 1: "verde", 2: "logo", 3: "verde" };
