"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { angleDiff } from "@/lib/geo";
import { tr } from "@/lib/i18n";
import { publicEnv } from "@/lib/env";
import type { StreetViewConfig } from "@/server/db/schema";
import { ConsentGate } from "../ConsentGate";
import { FullscreenModal } from "../Modal";
import { loadGoogleMaps } from "../google/loadMaps";

type Hotspot = StreetViewConfig["hotspots"][number];

/** Proiezione heading/pitch → coordinate schermo per la POV corrente. */
function project(h: Hotspot, pov: google.maps.StreetViewPov, zoom: number, w: number, hpx: number) {
  const fovH = 180 / 2 ** Math.max(zoom, 0.0001); // gradi orizzontali visibili
  const fovV = (fovH * hpx) / w;
  const dx = angleDiff(pov.heading ?? 0, h.heading);
  const dy = h.pitch - (pov.pitch ?? 0);
  return { x: w / 2 + (dx / fovH) * w, y: hpx / 2 - (dy / fovV) * hpx, visible: Math.abs(dx) < fovH / 2 + 5 && Math.abs(dy) < fovV / 2 + 5 };
}

function Panorama({ config, placeName }: { config: StreetViewConfig; placeName: string }) {
  const t = useTranslations("immersive");
  const locale = useLocale();
  const el = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pov, setPov] = useState({ heading: config.heading, pitch: config.pitch, zoom: 1 });
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [open, setOpen] = useState<Hotspot | null>(null);

  useEffect(() => {
    let pano: google.maps.StreetViewPanorama | null = null;
    let disposed = false;
    loadGoogleMaps(publicEnv.googleMapsKey, locale)
      .then(async () => {
        const { StreetViewPanorama, StreetViewService, StreetViewSource } = (await google.maps.importLibrary(
          "streetView",
        )) as google.maps.StreetViewLibrary;
        if (disposed || !el.current) return;
        // cerca il panorama outdoor più vicino al punto di vista configurato
        const svc = new StreetViewService();
        const { data } = await svc.getPanorama({
          location: { lat: config.lat, lng: config.lng },
          radius: 60,
          sources: [StreetViewSource.OUTDOOR],
        });
        pano = new StreetViewPanorama(el.current, {
          pano: data.location?.pano,
          pov: { heading: config.heading, pitch: config.pitch },
          zoom: 1,
          addressControl: false,
          fullscreenControl: false,
          motionTracking: false,
          motionTrackingControl: false,
          showRoadLabels: false,
          linksControl: true,
          panControl: false,
          zoomControl: false,
        });
        const sync = () => {
          const p = pano!.getPov();
          setPov({ heading: p.heading ?? 0, pitch: p.pitch ?? 0, zoom: pano!.getZoom() ?? 1 });
        };
        pano.addListener("pov_changed", sync);
        pano.addListener("zoom_changed", sync);
        setStatus("ready");
      })
      .catch(() => !disposed && setStatus("error"));
    const ro = new ResizeObserver(([e]) => e && setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    if (el.current) ro.observe(el.current);
    return () => {
      disposed = true;
      ro.disconnect();
      if (pano) google.maps.event.clearInstanceListeners(pano);
    };
  }, [config, locale]);

  return (
    <div className="relative size-full">
      <div ref={el} className="size-full" />
      {status === "loading" && <p className="absolute inset-0 grid place-items-center text-pietra-300">{t("loading")}</p>}
      {status === "error" && <p className="absolute inset-0 grid place-items-center p-6 text-center text-pietra-200">{t("error")}</p>}
      {status === "ready" && (
        <>
          {config.hotspots.map((h, i) => {
            const p = project(h, { heading: pov.heading, pitch: pov.pitch }, pov.zoom, size.w, size.h);
            if (!p.visible) return null;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(h)}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: p.x, top: p.y }}
                aria-label={tr(h.label, locale)}
              >
                <span className="absolute inset-0 rounded-full bg-oro-300 motion-safe:animate-[pulse-ring_1.8s_ease-out_infinite]" />
                <span className="relative grid size-10 place-items-center rounded-full border-2 border-white bg-oro-500/90 font-serif text-sm font-bold text-pietra-950 shadow-lg">
                  {i + 1}
                </span>
                <span className="absolute top-12 left-1/2 hidden -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs whitespace-nowrap text-white group-hover:block">
                  {tr(h.label, locale)}
                </span>
              </button>
            );
          })}
          <p className="pointer-events-none absolute inset-x-0 bottom-4 z-10 text-center text-sm text-white drop-shadow">
            {t("svHotspotHint")}
          </p>
        </>
      )}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute inset-x-0 bottom-0 z-30 max-h-[60%] overflow-y-auto rounded-t-3xl bg-pietra-50 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-pietra-900 md:inset-x-auto md:right-4 md:bottom-4 md:w-96 md:rounded-3xl"
            aria-live="polite"
          >
            <p className="eyebrow text-magliocco-600">{placeName}</p>
            <h3 className="mt-1 text-2xl">{tr(open.label, locale)}</h3>
            <p className="mt-3 leading-relaxed text-pietra-700">{tr(open.text, locale)}</p>
            <button type="button" onClick={() => setOpen(null)} className="mt-5 min-h-11 rounded-full border border-pietra-300 px-5 text-sm font-semibold">
              {t("close")}
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StreetViewModal({
  config,
  placeName,
  onClose,
}: {
  config: StreetViewConfig;
  placeName: string;
  onClose: () => void;
}) {
  const t = useTranslations("immersive");
  return (
    <FullscreenModal title={t("svTitle", { place: placeName })} onClose={onClose}>
      <ConsentGate>
        <Panorama config={config} placeName={placeName} />
      </ConsentGate>
    </FullscreenModal>
  );
}
