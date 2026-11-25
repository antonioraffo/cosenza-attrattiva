/*
 * Riempimenti colorati dell'hero: le parti più rilevanti del disegno (coordinate del viewBox degli SVG
 * in public/home) si colorano dopo il tratto. Le linee del disegno sono segmenti aperti, quindi le forme
 * sono disegnate a parte: rettangoli, ellissi e poligoni sopra gli elementi.
 *
 * Due palette: "verde" (predefinita, solo il verde del logo a intensità diverse) e "logo" (i quattro
 * colori del marchio). `tone` va da 0 (parte grande, tenue) a 3 (dettaglio, pieno).
 */

export type FillPalette = "verde" | "logo";
type Hue = "verde" | "azzurro" | "viola" | "arancio";

export interface Fill {
  d: string;
  tone: 0 | 1 | 2 | 3;
  /** colore nella palette "logo" */
  hue: Hue;
}

const HUES: Record<Hue, string> = { verde: "#128771", azzurro: "#1a98c4", viola: "#9c37b5", arancio: "#dd7b19" };
const ALPHA = [0.12, 0.2, 0.3, 0.5] as const;

export const fillColor = (f: Fill, palette: FillPalette) => HUES[palette === "logo" ? f.hue : "verde"];
export const fillAlpha = (f: Fill) => ALPHA[f.tone];

const rect = (x: number, y: number, x2: number, y2: number) => `M${x} ${y}H${x2}V${y2}H${x}Z`;
const ellipse = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
const poly = (...p: [number, number][]) => `M${p.map(([x, y]) => `${x} ${y}`).join("L")}Z`;

/** in ordine di comparsa: prima le parti grandi, poi i dettagli */
export const FILLS: Record<"duomo" | "ponte", Fill[]> = {
  duomo: [
    // parte alta della facciata, fino al cornicione, con le falde dei tetti laterali
    { d: poly([403, 200], [622, 148], [824, 234], [826, 404], [1015, 500], [205, 495], [206, 455], [400, 392]), tone: 0, hue: "verde" },
    // i quattro pilastri della facciata
    { d: rect(184, 548, 245, 878) + rect(389, 552, 445, 878) + rect(785, 556, 840, 878) + rect(990, 570, 1047, 878), tone: 1, hue: "azzurro" },
    // colonne e portali
    {
      d: rect(250, 768, 285, 878) + rect(355, 768, 387, 878) + rect(497, 733, 558, 878) + rect(667, 733, 736, 878) + rect(838, 770, 870, 878) + rect(937, 770, 974, 878),
      tone: 2,
      hue: "arancio",
    },
    // i tre rosoni
    { d: ellipse(613, 394, 88, 88) + ellipse(318, 590, 50, 50) + ellipse(902, 600, 50, 50), tone: 2, hue: "viola" },
    // le due finestre ovali
    { d: ellipse(416, 697, 13, 19) + ellipse(812, 700, 13, 18), tone: 3, hue: "viola" },
  ],
  ponte: [
    // il ventaglio degli stralli
    { d: poly([200, 140], [210, 198], [272, 301], [396, 373], [623, 446], [933, 518], [1536, 627], [1536, 742], [448, 770], [205, 150]), tone: 0, hue: "azzurro" },
    // l'impalcato
    { d: poly([66, 786], [305, 763], [342, 776], [1536, 741], [1536, 797], [340, 808], [66, 801]), tone: 1, hue: "verde" },
    // l'antenna
    { d: poly([197, 136], [188, 160], [194, 262], [250, 765], [262, 765], [208, 152]), tone: 3, hue: "arancio" },
  ],
};
