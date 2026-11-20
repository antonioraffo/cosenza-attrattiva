"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LngLat } from "@/lib/geo";
import { bearingDeg } from "@/lib/geo";
import { publicEnv } from "@/lib/env";
import { ConsentGate } from "../ConsentGate";
import { FullscreenModal } from "../Modal";
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay } from "@/components/ui/icons";

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

export interface FlyStop {
  name: string;
  position: LngLat;
}

/** Quota media del centro di Cosenza sull'ellissoide (≈ 240 m s.l.m. + ondulazione del geoide ≈ 45 m). */
const GROUND_H = 290;

function Flight({ stops }: { stops: FlyStop[] }) {
  const t = useTranslations("immersive");
  const el = useRef<HTMLDivElement>(null);
  const viewer = useRef<any>(null);
  const cesium = useRef<CesiumNS>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [index, setIndex] = useState(-1);
  const indexRef = useRef(-1);
  const [auto, setAuto] = useState(false);

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
      indexRef.current = i;
      setIndex(i);
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

  // tour automatico: una tappa ogni 9 s
  useEffect(() => {
    if (!auto || status !== "ready") return;
    const next = () => flyTo((indexRef.current + 1) % stops.length);
    next();
    const id = window.setInterval(next, 9000);
    return () => window.clearInterval(id);
  }, [auto, status, stops.length, flyTo]);

  return (
    <div className="relative size-full">
      <div ref={el} className="size-full" />
      {status === "loading" && <p className="absolute inset-0 grid place-items-center text-pietra-300">{t("loading")}</p>}
      {status === "error" && <p className="absolute inset-0 grid place-items-center p-6 text-center">{t("error")}</p>}
      {status === "ready" && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="mb-3 min-h-8 text-center font-serif text-2xl text-white drop-shadow" aria-live="polite">
            {index >= 0 ? `${index + 1}. ${stops[index]!.name}` : ""}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => flyTo(Math.max(0, index - 1))}
              disabled={index <= 0}
              aria-label={t("flyPrev")}
              className="grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur disabled:opacity-40"
            >
              <IconArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-oro-500 px-6 font-semibold text-pietra-950"
            >
              {auto ? <IconPause size={18} /> : <IconPlay size={18} />} {t("flyStart")}
            </button>
            <button
              type="button"
              onClick={() => flyTo(Math.min(stops.length - 1, index + 1))}
              disabled={index >= stops.length - 1}
              aria-label={t("flyNext")}
              className="grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur disabled:opacity-40"
            >
              <IconArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Fly3DModal({ title, stops, onClose }: { title: string; stops: FlyStop[]; onClose: () => void }) {
  const t = useTranslations("immersive");
  return (
    <FullscreenModal title={t("flyTitle", { title })} onClose={onClose}>
      <ConsentGate>
        <Flight stops={stops} />
      </ConsentGate>
    </FullscreenModal>
  );
}
