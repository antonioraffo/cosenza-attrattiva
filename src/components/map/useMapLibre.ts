"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MLMap, MapOptions } from "maplibre-gl";
import { COSENZA_BOUNDS, COSENZA_CENTER, cosenzaStyle } from "@/lib/map/style";

let protocolReady = false;

/**
 * Crea una mappa MapLibre (import dinamico: MapLibre resta fuori dal bundle iniziale).
 * Restituisce l'istanza dopo l'evento "load".
 */
export function useMapLibre(
  container: React.RefObject<HTMLDivElement | null>,
  locale: "it" | "en",
  options: Partial<MapOptions> = {},
) {
  const [map, setMap] = useState<MLMap | null>(null);
  const opts = useRef(options);

  useEffect(() => {
    let disposed = false;
    let instance: MLMap | null = null;
    (async () => {
      const [maplibregl, { Protocol }] = await Promise.all([import("maplibre-gl"), import("pmtiles")]);
      if (!protocolReady) {
        maplibregl.addProtocol("pmtiles", new Protocol({ metadata: true }).tile);
        protocolReady = true;
      }
      if (disposed || !container.current) return;
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
  }, [container, locale]);

  return map;
}
