"use client";

import { useTranslations } from "next-intl";
import type { Map as MLMap, MapMouseEvent } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { bearingDeg, lineLengthM, locateOnLine, pointAlong, type LngLat } from "@/lib/geo";
import { positionStore, setSimulatedPosition } from "@/lib/stores/position";
import { IconPause, IconPlay, IconTarget } from "@/components/ui/icons";

const WALK_SPEED = 1.4; // m/s, passo d'uomo
const SPEEDS = [1, 5, 15, 40];

/**
 * Simulatore di posizione (solo con NEXT_PUBLIC_DEMO_TOOLS): percorre l'itinerario,
 * salta alle tappe o sposta la posizione toccando la mappa. Alimenta lo stesso
 * store del GPS, quindi geofence, bussola e timbri si comportano come dal vivo.
 */
export function DemoSimulator({ map, route, stops }: { map: MLMap | null; route: LngLat[]; stops: LngLat[] }) {
  const t = useTranslations("demo");
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(15);
  const [tapMode, setTapMode] = useState(false);
  const along = useRef(0);
  const total = lineLengthM(route);

  // riprende dal punto del percorso più vicino alla posizione attuale
  const syncAlong = () => {
    const p = positionStore.get().position;
    if (p) along.current = locateOnLine(route, p).alongM;
  };

  useEffect(() => {
    if (!playing) return;
    syncAlong();
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const prev = pointAlong(route, along.current);
      along.current = Math.min(total, along.current + WALK_SPEED * speed * dt);
      const p = pointAlong(route, along.current);
      setSimulatedPosition(p, bearingDeg(prev, p));
      if (along.current >= total) setPlaying(false);
    }, 400);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, route, total]);

  useEffect(() => {
    if (!map || !tapMode) return;
    const onClick = (e: MapMouseEvent) => setSimulatedPosition([e.lngLat.lng, e.lngLat.lat]);
    map.on("click", onClick);
    map.getCanvas().style.cursor = "crosshair";
    return () => {
      map.off("click", onClick);
      map.getCanvas().style.cursor = "";
    };
  }, [map, tapMode]);

  const jump = (i: number) => {
    setPlaying(false);
    const s = stops[i]!;
    // pochi metri prima della tappa, lungo il percorso: l'arrivo scatta in modo naturale
    const a = Math.max(0, locateOnLine(route, s).alongM - 60);
    along.current = a;
    setSimulatedPosition(pointAlong(route, a));
  };

  return (
    <div className="absolute top-28 right-3 z-30 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full bg-arancio-500 px-3 py-1.5 text-xs font-bold tracking-wider text-neutro-950 shadow-[var(--shadow-float)]"
      >
        {t("badge")} · {t("title")}
      </button>
      {open && (
        <div className="w-64 rounded-2xl bg-neutro-900/95 p-4 text-sm text-white shadow-[var(--shadow-float)] backdrop-blur">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-arancio-500 font-semibold text-neutro-950"
          >
            {playing ? <IconPause size={16} /> : <IconPlay size={16} />} {playing ? t("pause") : t("walkRoute")}
          </button>
          <fieldset className="mt-3">
            <legend className="text-xs text-neutro-300">{t("speed")}</legend>
            <div className="mt-1 grid grid-cols-4 gap-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={speed === s}
                  onClick={() => setSpeed(s)}
                  className={`min-h-9 rounded-lg text-xs font-semibold ${speed === s ? "bg-white text-neutro-900" : "bg-neutro-800"}`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </fieldset>
          <p className="mt-3 text-xs text-neutro-300">{t("jumpTo")}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {stops.map((_, i) => (
              <button key={i} type="button" onClick={() => jump(i)} className="size-9 rounded-lg bg-neutro-800 text-xs font-semibold hover:bg-neutro-700">
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={tapMode}
            onClick={() => setTapMode((m) => !m)}
            className={`mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-full border text-xs font-semibold ${
              tapMode ? "border-arancio-300 bg-arancio-500/20" : "border-neutro-600"
            }`}
          >
            <IconTarget size={16} /> {t("tapMap")}
          </button>
        </div>
      )}
    </div>
  );
}
