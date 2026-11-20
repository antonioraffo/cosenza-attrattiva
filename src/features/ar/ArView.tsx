"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { angleDiff, bearingDeg, distanceM, formatDistance, type LngLat } from "@/lib/geo";
import { tr } from "@/lib/i18n";
import { publicEnv } from "@/lib/env";
import { useDeviceHeading } from "@/lib/orientation";
import { positionStore, setSimulatedPosition, startGps } from "@/lib/stores/position";
import type { ArConfig, Localized } from "@/server/db/schema";
import { FullscreenModal } from "../Modal";
import { IconCamera, IconCompass } from "@/components/ui/icons";

interface ApiPlace {
  slug: string;
  name: Localized;
  category: string;
  position: LngLat;
  ar: ArConfig | null;
}

const MAX_DIST = 2500;
const MAX_LABELS = 10;

/**
 * AR geolocalizzata web (approccio "location-based", tipo LocAR.js): video della fotocamera,
 * rotta dalla bussola e posizione GPS proiettano le etichette dei luoghi nella loro direzione.
 * Senza fotocamera/sensori: vista bussola, ruotabile trascinando o con le frecce.
 */
function ArScene({ focusSlug, fallbackViewpoint }: { focusSlug?: string; fallbackViewpoint?: LngLat }) {
  const t = useTranslations("immersive");
  const locale = useLocale() as "it" | "en";
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [camera, setCamera] = useState<"off" | "on" | "failed">("off");
  const [places, setPlaces] = useState<ApiPlace[]>([]);
  const [manualHeading, setManualHeading] = useState(0);
  const [selected, setSelected] = useState<string | null>(focusSlug ?? null);
  const { heading: sensorHeading, beta, status: sensor, request } = useDeviceHeading();
  const pos = positionStore.useStore((s) => s.position);
  const portrait = typeof window !== "undefined" ? window.innerHeight > window.innerWidth : true;
  const hfov = portrait ? 48 : 64;
  const drag = useRef<{ x: number; h: number } | null>(null);

  useEffect(() => {
    fetch("/api/places")
      .then((r) => r.json())
      .then((p: ApiPlace[]) => setPlaces(p))
      .catch(() => setPlaces([]));
  }, []);

  const start = async () => {
    setStarted(true);
    void request(); // permesso bussola (iOS) sullo stesso gesto
    if (positionStore.get().status !== "active") {
      if (publicEnv.demoTools && fallbackViewpoint) setSimulatedPosition(fallbackViewpoint);
      else startGps();
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      if (video.current) {
        video.current.srcObject = stream;
        await video.current.play();
      }
      setCamera("on");
    } catch {
      setCamera("failed");
    }
  };

  useEffect(() => {
    const v = video.current;
    return () => {
      (v?.srcObject as MediaStream | null)?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  const heading = sensor === "active" && sensorHeading !== null ? sensorHeading : manualHeading;

  const visible = useMemo(() => {
    if (!pos) return [];
    return places
      .map((p) => ({ ...p, d: distanceM(pos, p.position), b: bearingDeg(pos, p.position) }))
      .filter((p) => p.d < MAX_DIST || p.slug === focusSlug)
      .sort((a, b) => a.d - b.d)
      .slice(0, MAX_LABELS);
  }, [places, pos, focusSlug]);

  // inclinazione: con il telefono verticale beta ≈ 90°
  const tilt = beta !== null && sensor === "active" ? Math.max(-30, Math.min(30, beta - 90)) : 0;
  const selectedPlace = visible.find((p) => p.slug === selected) ?? null;
  const focus = visible.find((p) => p.slug === focusSlug);
  const focusDiff = focus ? angleDiff(heading, focus.b) : 0;

  if (!started) {
    return (
      <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_30%,#3a0e1b,#14110e)] p-6">
        <div className="max-w-sm text-center">
          <IconCamera size={44} className="mx-auto text-oro-300" />
          <p className="mt-4 leading-relaxed text-pietra-100">{t("arIntro")}</p>
          <button type="button" onClick={start} className="mt-6 min-h-12 rounded-full bg-oro-500 px-6 font-semibold text-pietra-950">
            {t("arStart")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative size-full touch-none overflow-hidden bg-[radial-gradient(circle_at_50%_120%,#244c35,#14110e_70%)]"
      tabIndex={0}
      aria-label={t("arTitle")}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setManualHeading((h) => (h - 5 + 360) % 360);
        if (e.key === "ArrowRight") setManualHeading((h) => (h + 5) % 360);
      }}
      onPointerDown={(e) => {
        if (sensor !== "active") drag.current = { x: e.clientX, h: manualHeading };
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        setManualHeading((drag.current.h - (dx / window.innerWidth) * hfov + 360) % 360);
      }}
      onPointerUp={() => (drag.current = null)}
    >
      <video ref={video} playsInline muted className={`absolute inset-0 size-full object-cover ${camera === "on" ? "" : "hidden"}`} />

      {/* orizzonte e rosa dei venti */}
      <div className="pointer-events-none absolute inset-x-0 top-16 z-10 flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 font-mono text-sm text-white backdrop-blur">
          <IconCompass size={16} /> {Math.round(heading)}°
        </div>
      </div>

      {/* etichette dei luoghi */}
      {visible.map((p) => {
        const diff = angleDiff(heading, p.b);
        if (Math.abs(diff) > hfov / 2 + 8) return null;
        const x = 50 + (diff / hfov) * 100;
        const near = Math.min(1, p.d / 1500);
        const y = 58 - near * 22 + tilt * 1.2;
        const isFocus = p.slug === focusSlug;
        return (
          <button
            key={p.slug}
            type="button"
            onClick={() => setSelected(p.slug)}
            className="absolute z-10 -translate-x-1/2 -translate-y-full text-left transition-[left,top] duration-150 ease-linear"
            style={{ left: `${x}%`, top: `${y}%`, zIndex: Math.round(3000 - p.d) }}
          >
            <span
              className={`block rounded-2xl px-3 py-2 shadow-lg backdrop-blur ${
                isFocus ? "bg-magliocco-700/90 text-white ring-2 ring-oro-300" : "bg-white/85 text-pietra-900"
              }`}
              style={{ transform: `scale(${1.15 - near * 0.4})` }}
            >
              <span className="block font-serif text-[15px] leading-tight whitespace-nowrap">{tr(p.name, locale)}</span>
              <span className={`block text-xs ${isFocus ? "text-oro-300" : "text-pietra-500"}`}>
                {t("arDistance", { distance: formatDistance(p.d, locale) })}
              </span>
            </span>
            <span className={`mx-auto block h-8 w-0.5 ${isFocus ? "bg-oro-300" : "bg-white/80"}`} />
            <span className={`mx-auto block size-2.5 rounded-full ${isFocus ? "bg-oro-300" : "bg-white"}`} />
          </button>
        );
      })}

      {/* freccia verso il luogo in evidenza se fuori campo */}
      {focus && Math.abs(focusDiff) > hfov / 2 && (
        <div
          className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-magliocco-700/90 px-3 py-2 text-sm font-semibold text-white"
          style={focusDiff > 0 ? { right: 8 } : { left: 8 }}
        >
          {focusDiff > 0 ? "→" : "←"} {tr(focus.name, locale)}
        </div>
      )}

      {/* stato sensori */}
      <div className="absolute inset-x-0 top-28 z-10 px-4 text-center text-sm text-white/90">
        {camera === "failed" && <p className="mx-auto max-w-sm rounded-xl bg-black/50 p-2">{t("arNoCamera")}</p>}
        {sensor === "unsupported" && <p className="mx-auto mt-2 max-w-sm rounded-xl bg-black/50 p-2">{t("arNoSensors")}</p>}
        {sensor === "active" && camera === "on" && <p className="mx-auto max-w-xs text-xs text-white/70">{t("arCalibrate")}</p>}
      </div>

      {/* timeline del luogo selezionato */}
      <AnimatePresence>
        {selectedPlace?.ar && (
          <motion.aside
            key={selectedPlace.slug}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="absolute inset-x-0 bottom-0 z-20 max-h-[48%] overflow-y-auto rounded-t-3xl bg-pietra-950/90 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-white backdrop-blur-md"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow text-oro-300">{t("arTimeline")}</p>
                <h3 className="mt-1 text-2xl">{tr(selectedPlace.ar.headline, locale)}</h3>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="min-h-11 rounded-full px-3 text-sm text-pietra-300">
                ✕
              </button>
            </div>
            <ol className="relative mt-4 space-y-3 border-l border-oro-500/50 pl-5">
              {selectedPlace.ar.timeline.map((e, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="relative"
                >
                  <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full bg-oro-500" />
                  <span className="font-serif text-lg text-oro-300">{e.year}</span>
                  <p className="text-sm leading-relaxed text-pietra-100">{tr(e.text, locale)}</p>
                </motion.li>
              ))}
            </ol>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArModal({
  focusSlug,
  fallbackViewpoint,
  onClose,
}: {
  focusSlug?: string;
  fallbackViewpoint?: LngLat;
  onClose: () => void;
}) {
  const t = useTranslations("immersive");
  return (
    <FullscreenModal title={t("arTitle")} onClose={onClose}>
      <ArScene focusSlug={focusSlug} fallbackViewpoint={fallbackViewpoint} />
    </FullscreenModal>
  );
}
