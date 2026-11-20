"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, MapOptions } from "maplibre-gl";
import { COSENZA_BOUNDS, COSENZA_CENTER, cosenzaStyle } from "@/lib/map/style";

let protocolReady = false;

/** Registrazione una tantum di worker e protocollo pmtiles:// */
function setupMapLibre(maplibregl: typeof import("maplibre-gl"), Protocol: typeof import("pmtiles").Protocol) {
  if (protocolReady) return;
  maplibregl.setWorkerUrl("/map/maplibre-gl-worker.mjs");
  maplibregl.addProtocol("pmtiles", new Protocol({ metadata: true }).tile);
  protocolReady = true;
}

/** WebGL2 assente (dispositivi datati, alcuni browser headless): niente mappa, la pagina resta usabile. */
const hasWebGL2 = () => Boolean(document.createElement("canvas").getContext("webgl2"));

/**
 * Crea una mappa MapLibre (import dinamico: MapLibre resta fuori dal bundle iniziale).
 * Restituisce l'istanza dopo l'evento "load".
 */
export function useMapLibre(
  container: React.RefObject<HTMLDivElement | null>,
  locale: "it" | "en",
  options: Partial<MapOptions> = {},
  /** false = rimanda la creazione (es. finché la mappa non è vicina al viewport) */
  enabled = true,
) {
  const [map, setMap] = useState<MLMap | null>(null);
  const opts = useRef(options);

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let instance: MLMap | null = null;
    (async () => {
      const [maplibregl, { Protocol }] = await Promise.all([import("maplibre-gl"), import("pmtiles")]);
      setupMapLibre(maplibregl, Protocol);
      if (disposed || !container.current || !hasWebGL2()) return;
      const m = new maplibregl.Map({
        container: container.current,
        style: cosenzaStyle(window.location.origin, locale),
        center: COSENZA_CENTER,
        zoom: 14,
        maxBounds: COSENZA_BOUNDS,
        minZoom: 11,
        maxZoom: 19,
        attributionControl: { compact: true },
        cooperativeGestures: false,
        ...opts.current,
      });
      instance = m;
      m.on("load", () => {
        if (!disposed) setMap(m);
      });
    })();
    return () => {
      disposed = true;
      instance?.remove();
      setMap(null);
    };
  }, [container, locale, enabled]);

  return map;
}
