// Copia il worker di MapLibre tra gli asset statici: Turbopack non risolve
// correttamente `new URL("./maplibre-gl-worker.mjs", import.meta.url)` del pacchetto.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("public/map", { recursive: true });
copyFileSync("node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", "public/map/maplibre-gl-worker.mjs");
