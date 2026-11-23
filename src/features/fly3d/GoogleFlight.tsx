"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bearingDeg } from "@/lib/geo";
import { publicEnv } from "@/lib/env";
import { FlightOverlay, useFlight, type FlightStatus, type FlyStop } from "./FlightControls";

/* CesiumJS (≈ 4 MB) viene caricato da CDN solo quando si apre il volo 3D. */
const CESIUM_VERSION = "1.147.0";
const CESIUM_BASE = `https://cdn.jsdelivr.net/npm/cesium@${CESIUM_VERSION}/Build/Cesium/`;

// Tipizzazione minima dell'API Cesium usata qui
/* eslint-disable @typescript-eslint/no-explicit-any */
type CesiumNS = any;
let cesiumPromise: Promise<CesiumNS> | null = null;

function loadCesium(): Promise<CesiumNS> {
  if (cesiumPromise) return cesiumPromise;
  cesiumPromise = new Promise((resolve, reject) => {
    (window as any).CESIUM_BASE_URL = CESIUM_BASE;
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${CESIUM_BASE}Widgets/widgets.css`;
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = `${CESIUM_BASE}Cesium.js`;
    s.onload = () => resolve((window as any).Cesium);
    s.onerror = () => {
      cesiumPromise = null;
      reject(new Error("Cesium non caricato"));
    };
    document.head.appendChild(s);
  });
  return cesiumPromise;
}

/** Quota media del centro di Cosenza sull'ellissoide (≈ 240 m s.l.m. + ondulazione del geoide ≈ 45 m). */
const GROUND_H = 290;

/**
 * Volo 3D con Google Photorealistic 3D Tiles (NEXT_PUBLIC_FLY3D_PROVIDER=google).
 * Richiede chiave, Map Tiles API e un account di fatturazione abilitato alle tile 3D.
 */
export function GoogleFlight({ stops }: { stops: FlyStop[] }) {
  const el = useRef<HTMLDivElement>(null);
  const viewer = useRef<any>(null);
  const cesium = useRef<CesiumNS>(null);
  const [status, setStatus] = useState<FlightStatus>("loading");

  useEffect(() => {
    let disposed = false;
    loadCesium()
      .then(async (Cesium) => {
        if (disposed || !el.current) return;
        cesium.current = Cesium;
        const v = new Cesium.Viewer(el.current, {
          globe: false,
          baseLayer: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          requestRenderMode: false,
        });
        v.scene.skyAtmosphere.show = true;
        viewer.current = v;
        Cesium.GoogleMaps.defaultApiKey = publicEnv.googleMapsKey;
        const tileset = await Cesium.createGooglePhotorealistic3DTileset({ onlyUsingWithGoogleGeocoder: true });
        if (disposed) return;
        v.scene.primitives.add(tileset);
        // vista d'insieme iniziale da sud-ovest, in quota
        const [lng, lat] = stops[0]?.position ?? [16.2547, 39.2878];
        v.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(lng - 0.012, lat - 0.02, 1500),
          orientation: { heading: Cesium.Math.toRadians(25), pitch: Cesium.Math.toRadians(-28), roll: 0 },
        });
        setStatus("ready");
      })
      .catch(() => !disposed && setStatus("error"));
    return () => {
      disposed = true;
      viewer.current?.destroy();
      viewer.current = null;
    };
  }, [stops]);

  const flyTo = useCallback(
    (i: number) => {
      const Cesium = cesium.current;
      const v = viewer.current;
      const stop = stops[i];
      if (!Cesium || !v || !stop) return;
      const prev = stops[i - 1]?.position ?? stops[i + 1]?.position ?? stop.position;
      // guarda la tappa "arrivando" dalla precedente, inclinato come un drone
      const heading = prev === stop.position ? 0 : bearingDeg(prev, stop.position);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      v.camera.flyToBoundingSphere(new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(stop.position[0], stop.position[1], GROUND_H), 60), {
        offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(heading), Cesium.Math.toRadians(-32), 420),
        duration: reduce ? 0 : 5,
      });
    },
    [stops],
  );
  const flight = useFlight(stops, status, flyTo);

  return (
    <div className="relative size-full">
      <div ref={el} className="size-full" />
      <FlightOverlay stops={stops} status={status} flight={flight} />
    </div>
  );
}
