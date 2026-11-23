// Ottimizza i disegni al tratto della home (public/home/*-silhouette-lines.svg).
// - Il livello "ghost" (disegno completo a bassa opacità, mai animato tratto per tratto) diventa un
//   solo <path> per colore: da 1.232 a 2 nodi DOM, stesso aspetto.
// - Gli attributi ripetuti sui tratti animati (vector-effect, stroke-dasharray, valori iniziali)
//   passano al CSS (src/app/home-hero.css); restano solo d, colore, pathLength e data-start/end.
// - Il colore d'accento di vivicosenza (#962d30) diventa il verde del marchio (#0f7663).
// Uso: node scripts/optimize-silhouette.mjs <sorgente.svg> <destinazione.svg>
import { readFile, writeFile } from "node:fs/promises";

const [src, dest] = process.argv.slice(2);
let svg = await readFile(src, "utf8");
svg = svg.replaceAll("#962d30", "#0f7663");

const ghostRe = /(<g data-silhouette-ghost=""[^>]*>)([\s\S]*?)(<\/g>)/;
const [, open, body, close] = svg.match(ghostRe);
const byColor = new Map();
for (const m of body.matchAll(/<path[^>]*?stroke="([^"]+)"[^>]*?d="([^"]+)"[^>]*\/>/g)) {
  byColor.set(m[1], [...(byColor.get(m[1]) ?? []), m[2]]);
}
const merged = [...byColor].map(([c, ds]) => `<path vector-effect="non-scaling-stroke" stroke="${c}" d="${ds.join("")}"/>`).join("");
svg = svg.replace(ghostRe, `${open}${merged}${close}`);

svg = svg.replace(/<path data-silhouette-stroke="\d+"([^>]*)\/>/g, (_, attrs) => {
  const keep = ["data-start", "data-end", "stroke", "d"].map((k) => attrs.match(new RegExp(` ${k}="[^"]*"`))?.[0] ?? "").join("");
  return `<path data-silhouette-stroke="" pathLength="1"${keep}/>`;
});
svg = svg.replace(/>\s+</g, "><");
await writeFile(dest, svg);
console.log(`${src} → ${dest}: ${(svg.length / 1024).toFixed(0)} KB`);
