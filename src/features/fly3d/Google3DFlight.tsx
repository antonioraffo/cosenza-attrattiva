"use client";

import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { bearingDeg } from "@/lib/geo";
import { publicEnv } from "@/lib/env";
import { loadGoogleMaps } from "../google/loadMaps";
import { FlightOverlay, useFlight, type FlightStatus, type FlyStop } from "./FlightControls";

/** Quota media del centro di Cosenza sul livello del mare, per il punto guardato dalla camera. */
const GROUND_ALT = 250;

/**
 * Volo 3D con il 3D Maps della Maps JavaScript API (NEXT_PUBLIC_FLY3D_PROVIDER=google3d):
 * rendering fotorealistico, disponibile anche per gli account di fatturazione dello Spazio
 * economico europeo (a differenza delle Photorealistic 3D Tiles della Map Tiles API).
 * Stessa coreografia degli altri motori: si arriva a ogni tappa dalla direzione della precedente.
 */
export function Google3DFlight({ stops }: { stops: FlyStop[] }) {
  const locale = useLocale();
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.maps3d.Map3DElement | null>(null);
  const [status, setStatus] = useState<FlightStatus>("loading");

  useEffect(() => {
    let disposed = false;
    let ready: number | undefined;
    loadGoogleMaps(publicEnv.googleMapsKey, locale)
      .then(async () => {
        const { Map3DElement } = (await google.maps.importLibrary("maps3d")) as google.maps.Maps3DLibrary;
        if (disposed || !el.current) return;
        const [lng, lat] = stops[0]?.position ?? [16.2547, 39.2878];
        // vista d'insieme iniziale da sud-ovest, in quota (come gli altri motori)
        const m = new Map3DElement({
          center: { lat, lng, altitude: GROUND_ALT },
          range: 2600,
          tilt: 62,
          heading: 25,
          mode: "SATELLITE",
        } as google.maps.maps3d.Map3DElementOptions);
        m.style.display = "block";
        m.style.width = "100%";
        m.style.height = "100%";
        const markReady = () => !disposed && setStatus("ready");
        m.addEventListener("gmp-steadychange", markReady, { once: true });
        m.addEventListener("gmp-error", () => !disposed && setStatus("error"));
        ready = window.setTimeout(markReady, 6000);
        el.current.replaceChildren(m);
        map.current = m;
      })
      .catch(() => !disposed && setStatus("error"));
    return () => {
      disposed = true;
      window.clearTimeout(ready);
      map.current?.remove();
      map.current = null;
    };
  }, [stops, locale]);

  const flyTo = useCallback(
    (i: number) => {
      const m = map.current;
      const stop = stops[i];
      if (!m || !stop) return;
      const prev = stops[i - 1]?.position ?? stops[i + 1]?.position ?? stop.position;
      const heading = prev === stop.position ? 0 : bearingDeg(prev, stop.position);
      const endCamera = { center: { lat: stop.position[1], lng: stop.position[0], altitude: GROUND_ALT }, range: 520, tilt: 60, heading };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) Object.assign(m, endCamera);
      else m.flyCameraTo({ endCamera, durationMillis: 5000 });
    },
    [stops],
  );
  const flight = useFlight(stops, status, flyTo);

  return (
    <div className="relative size-full bg-neutro-900">
      <div ref={el} className="size-full" />
      <FlightOverlay stops={stops} status={status} flight={flight} />
    </div>
  );
}
