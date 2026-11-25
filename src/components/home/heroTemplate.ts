import type { FillPalette } from "./effects/fills";

/**
 * Varianti dell'hero, scelte con ?template= nell'indirizzo della home (anteprime da confrontare):
 *   1  hero v2 (HeroV2.tsx): filigrana a tutta larghezza, foto del luogo, curiosità, slot «In evidenza»
 *      (predefinito, anche senza parametro)
 *   2  disegno al tratto (HeroDrawing.tsx) che si colora con il verde del logo
 *   3  lo stesso disegno con i quattro colori del logo
 * Un valore mancante o non valido vale 1. Il vecchio ?colori=logo vale come 3.
 */
export type HeroTemplate = 1 | 2 | 3;

export const HERO_TEMPLATES: readonly HeroTemplate[] = [1, 2, 3];

export function readHeroTemplate(search: string): HeroTemplate {
  const params = new URLSearchParams(search);
  const n = Number(params.get("template"));
  if ((HERO_TEMPLATES as readonly number[]).includes(n)) return n as HeroTemplate;
  return params.get("colori") === "logo" ? 3 : 1;
}

/** template del disegno al tratto (HeroDrawing) */
export type DrawingTemplate = 2 | 3;

/** colori dei riempimenti del disegno al tratto */
export const TEMPLATE_PALETTE: Record<DrawingTemplate, FillPalette> = { 2: "verde", 3: "logo" };
