"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LngLat } from "@/lib/geo";
import { IconArrowLeft, IconArrowRight, IconPause, IconPlay } from "@/components/ui/icons";

export interface FlyStop {
  name: string;
  position: LngLat;
}

export type FlightStatus = "loading" | "ready" | "error";

/**
 * Stato e controlli comuni ai motori del volo 3D (Google o MapLibre): tappa corrente, avanti/indietro,
 * tour automatico (una tappa ogni 9 s). Il motore fornisce solo `flyTo(i)`.
 */
export function useFlight(stops: FlyStop[], status: FlightStatus, flyTo: (i: number) => void) {
  const [index, setIndex] = useState(-1);
  const indexRef = useRef(-1);
  const [auto, setAuto] = useState(false);
  const flyRef = useRef(flyTo);
  useEffect(() => {
    flyRef.current = flyTo;
  }, [flyTo]);
  const go = useCallback((i: number) => {
    indexRef.current = i;
    setIndex(i);
    flyRef.current(i);
  }, []);

  useEffect(() => {
    if (!auto || status !== "ready") return;
    const next = () => go((indexRef.current + 1) % stops.length);
    next();
    const id = window.setInterval(next, 9000);
    return () => window.clearInterval(id);
  }, [auto, status, stops.length, go]);

  return { index, auto, setAuto, go };
}

export function FlightOverlay({
  stops,
  status,
  flight,
}: {
  stops: FlyStop[];
  status: FlightStatus;
  flight: ReturnType<typeof useFlight>;
}) {
  const t = useTranslations("immersive");
  const { index, auto, setAuto, go } = flight;
  return (
    <>
      {status === "loading" && <p className="absolute inset-0 grid place-items-center text-neutro-300">{t("loading")}</p>}
      {status === "error" && <p className="absolute inset-0 grid place-items-center p-6 text-center">{t("error")}</p>}
      {status === "ready" && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="mb-3 min-h-8 text-center font-display text-2xl text-white drop-shadow" aria-live="polite">
            {index >= 0 ? `${index + 1}. ${stops[index]!.name}` : ""}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(Math.max(0, index - 1))}
              disabled={index <= 0}
              aria-label={t("flyPrev")}
              className="grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur disabled:opacity-40"
            >
              <IconArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              aria-pressed={auto}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-arancio-500 px-6 font-semibold text-neutro-950"
            >
              {auto ? <IconPause size={18} /> : <IconPlay size={18} />} {t("flyStart")}
            </button>
            <button
              type="button"
              onClick={() => go(Math.min(stops.length - 1, index + 1))}
              disabled={index >= stops.length - 1}
              aria-label={t("flyNext")}
              className="grid size-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur disabled:opacity-40"
            >
              <IconArrowRight />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
