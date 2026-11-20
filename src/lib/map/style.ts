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

export const COSENZA_CENTER: [number, number] = [16.2547, 39.2945];
/** Limiti dell'estratto PMTiles (con margine). */
export const COSENZA_BOUNDS: [[number, number], [number, number]] = [
  [16.17, 39.19],
  [16.37, 39.35],
];
