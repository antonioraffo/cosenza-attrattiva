import { layers, namedFlavor } from "@protomaps/basemaps";
import type { StyleSpecification } from "maplibre-gl";

/** Palette "pietra di Cosenza": toni caldi e desaturati per far risaltare i percorsi. */
const flavor = {
  ...namedFlavor("light"),
  background: "#efe9df",
  earth: "#f3eee6",
  water: "#a7c4cc",
  park_a: "#dde6d3",
  park_b: "#d1dec6",
  wood_a: "#d6e1cb",
  wood_b: "#cbd9be",
  scrub_a: "#e1e6d2",
  scrub_b: "#d8dfc7",
  pedestrian: "#ebe4d8",
  buildings: "#e0d6c8",
  hospital: "#efe2df",
  school: "#ece5d6",
  industrial: "#e9e4dc",
  minor_a: "#ffffff",
  minor_b: "#fbf8f3",
  minor_service: "#fbf8f3",
  other: "#f8f4ee",
  link: "#ffffff",
  major: "#ffffff",
  highway: "#f7eddc",
  railway: "#c8bcab",
  boundaries: "#bcae9c",
  roads_label_minor: "#8a7b68",
  roads_label_major: "#6d604f",
  city_label: "#3a3129",
  subplace_label: "#7f6d56",
};

export function cosenzaStyle(origin: string, locale: "it" | "en"): StyleSpecification {
  return {
    version: 8,
    glyphs: `${origin}/map/fonts/{fontstack}/{range}.pbf`,
    sprite: `${origin}/map/sprites/v4/light`,
    sources: {
      protomaps: {
        type: "vector",
        url: `pmtiles://${origin}/map/cosenza.pmtiles`,
        attribution:
          '<a href="https://protomaps.com">Protomaps</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    },
    // i POI generici distraggono dal racconto: li togliamo
    layers: layers("protomaps", flavor, { lang: locale }).filter((l) => !l.id.startsWith("pois")),
  };
}

/**
 * Stile «schematico» dalla mappa della demo di Stefano (Città da vivere): fondo sabbia, fiumi azzurri larghi,
 * strade chiare e sottili, niente edifici, POI, numeri civici o nomi di strade minori. Solo per la home.
 */
const schematicFlavor = {
  ...flavor,
  background: "#f4f1ec",
  earth: "#f4f1ec",
  water: "#b5d9e8",
  park_a: "#e9e3d8",
  park_b: "#e9e3d8",
  wood_a: "#ece6db",
  wood_b: "#ece6db",
  scrub_a: "#efeae1",
  scrub_b: "#efeae1",
  pedestrian: "#ece6dc",
  hospital: "#f4f1ec",
  school: "#f4f1ec",
  industrial: "#f4f1ec",
  minor_a: "#e6e0d5",
  minor_b: "#e6e0d5",
  minor_service: "#ebe6dd",
  other: "#ebe6dd",
  link: "#ddd6ca",
  major: "#ddd6ca",
  highway: "#d6cebf",
  minor_casing: "#f4f1ec",
  major_casing_early: "#f4f1ec",
  major_casing_late: "#f4f1ec",
  highway_casing_early: "#f4f1ec",
  highway_casing_late: "#f4f1ec",
  railway: "#ddd6ca",
  roads_label_major: "#8a857c",
  ocean_label: "#3d7286",
  subplace_label: "#8a857c",
  city_label: "#4a4a4a",
};
const SCHEMATIC_HIDDEN = /^(buildings|pois|address_label|roads_labels_minor|roads_oneway|roads_shields|roads_rail|boundaries|landuse_(hospital|school|industrial))/;

export function cosenzaSchematicStyle(origin: string, locale: "it" | "en"): StyleSpecification {
  const base = cosenzaStyle(origin, locale);
  return {
    ...base,
    layers: layers("protomaps", schematicFlavor, { lang: locale })
      .filter((l) => !SCHEMATIC_HIDDEN.test(l.id))
      .map((l) => {
        // fiumi più larghi e in corsivo azzurro, come nello schema
        if (l.id === "water_river" || l.id === "water_stream") return { ...l, paint: { ...l.paint, "line-color": "#b5d9e8", "line-width": ["interpolate", ["linear"], ["zoom"], 12, 3, 16, 12] } } as typeof l;
        if (l.id === "water_waterway_label") return { ...l, paint: { ...l.paint, "text-color": "#3d7286" }, layout: { ...l.layout, "text-font": ["Noto Sans Italic"] } } as typeof l;
        return l;
      }),
  };
}

export const COSENZA_CENTER: [number, number] = [16.2547, 39.2945];
/** Limiti dell'estratto PMTiles (con margine). */
export const COSENZA_BOUNDS: [[number, number], [number, number]] = [
  [16.17, 39.19],
  [16.37, 39.35],
];

/**
 * Variante 3D dello stile per il volo MapLibre: rilievo dai Terrain Tiles locali (public/map/terrain,
 * scripts/map/terrain.sh), ombreggiatura del terreno, edifici estrusi con l'altezza OSM e cielo.
 * Nessun servizio esterno: funziona con qualunque account e, una volta in cache, offline.
 */
export function cosenzaStyle3D(origin: string, locale: "it" | "en"): StyleSpecification {
  const base = cosenzaStyle(origin, locale);
  const dem = {
    type: "raster-dem" as const,
    tiles: [`${origin}/map/terrain/{z}/{x}/{y}.png`],
    encoding: "terrarium" as const,
    tileSize: 256,
    minzoom: 8,
    maxzoom: 13,
    bounds: [COSENZA_BOUNDS[0][0], COSENZA_BOUNDS[0][1], COSENZA_BOUNDS[1][0], COSENZA_BOUNDS[1][1]] as [number, number, number, number],
    attribution: 'Rilievo: <a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a> (SRTM, GMTED)',
  };
  const layers = base.layers.flatMap((l) => {
    if (l.id !== "buildings") return [l];
    return [
      {
        id: "hillshade",
        type: "hillshade" as const,
        source: "hillshade",
        paint: { "hillshade-shadow-color": "#5b4a39", "hillshade-highlight-color": "#fffaf2", "hillshade-exaggeration": 0.35 },
      },
      {
        id: "buildings-3d",
        type: "fill-extrusion" as const,
        source: "protomaps",
        "source-layer": "buildings",
        minzoom: 13,
        filter: ["in", "kind", "building", "building_part"],
        paint: {
          "fill-extrusion-color": "#e6dccd",
          "fill-extrusion-height": ["coalesce", ["get", "height"], 9],
          "fill-extrusion-base": ["coalesce", ["get", "min_height"], 0],
          "fill-extrusion-opacity": 0.92,
        },
      },
    ];
  }) as StyleSpecification["layers"];
  return {
    ...base,
    sources: { ...base.sources, terrain: dem, hillshade: { ...dem, attribution: "" } },
    terrain: { source: "terrain", exaggeration: 1.25 },
    sky: {
      "sky-color": "#a9cbe0",
      "horizon-color": "#efe4d3",
      "fog-color": "#efe9df",
      "sky-horizon-blend": 0.6,
      "horizon-fog-blend": 0.7,
      "fog-ground-blend": 0.4,
    },
    layers,
  };
}
