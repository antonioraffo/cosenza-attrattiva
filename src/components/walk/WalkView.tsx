"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import type { Marker } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { bbox, bearingDeg, cardinal, distanceM, formatDistance, lineLengthM, locateOnLine, type LngLat } from "@/lib/geo";
import { createGeofenceState, smoothPosition, updateGeofences, type Fence } from "@/lib/geo/geofence";
import { publicEnv } from "@/lib/env";
import { useDeviceHeading } from "@/lib/orientation";
import { addStamp, checkBadge, passport } from "@/lib/stores/passport";
import { positionStore, setSimulatedPosition, startGps, stopPosition } from "@/lib/stores/position";
import { useAudio } from "@/components/audio/AudioProvider";
import { addItineraryLayers, reducedMotion, setItineraryProgress } from "@/components/map/itineraryLayers";
import { useMapLibre } from "@/components/map/useMapLibre";
import { Stamp } from "@/components/passport/Stamp";
import { IconArrowLeft, IconArrowUp, IconCheck, IconClose, IconCompass, IconLocate, IconWalk } from "@/components/ui/icons";
import { DemoSimulator } from "./DemoSimulator";

export interface WalkChapter {
  id: number;
  title: string;
  html: string;
  plain: string;
  audioSrc: string | null;
  placeSlug: string | null;
  placeName: string | null;
  image: { url: string; alt: string } | null;
  position: LngLat;
  radiusM: number;
}

/** Marker HTML della posizione: punto, alone di precisione e cono di direzione. */
function userMarkerEl() {
  const el = document.createElement("div");
  el.className = "user-marker";
  el.innerHTML = `
    <div class="relative size-6">
      <div data-cone class="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-full origin-bottom opacity-0 transition-opacity"
           style="background: conic-gradient(from -25deg at 50% 100%, rgba(63,122,85,.55), transparent 50deg); clip-path: polygon(50% 100%, 0 0, 100% 0);"></div>
      <span class="absolute inset-0 rounded-full bg-primario-500/40" style="animation: pulse-ring 2s ease-out infinite"></span>
      <span class="absolute inset-[3px] rounded-full border-[3px] border-white bg-primario-500 shadow-lg"></span>
    </div>`;
  return el;
}

export function WalkView({
  slug,
  title,
  color,
  route,
  chapters,
}: {
  slug: string;
  title: string;
  color: string;
  route: LngLat[];
  chapters: WalkChapter[];
}) {
  const t = useTranslations("walk");
  const ti = useTranslations("itinerary");
  const th = useTranslations("home");
  const locale = useLocale() as "it" | "en";
  const audio = useAudio();
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapLibre(mapRef, locale, { pitch: 45 });
  const pos = positionStore.useStore((s) => s.position);
  const status = positionStore.useStore((s) => s.status);
  const source = positionStore.useStore((s) => s.source);
  const accuracy = positionStore.useStore((s) => s.accuracyM);
  const stamps = passport.useStore((s) => s.stamps);
  const { heading, status: compass, request: requestCompass } = useDeviceHeading();

  const [started, setStarted] = useState(false);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [arrival, setArrival] = useState<{ index: number; newStamp: boolean } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [following, setFollowing] = useState(true);
  const [completed, setCompleted] = useState(false);
  const fenceState = useRef(createGeofenceState());
  const smoothed = useRef<LngLat | null>(null);
  const [userPos, setUserPos] = useState<LngLat | null>(null);
  const marker = useRef<Marker | null>(null);

  const stops = useMemo(
    () => chapters.map((c, i) => ({ id: c.id, position: c.position, label: String(i + 1), name: c.placeName ?? c.title })),
    [chapters],
  );
  const fences: Fence[] = useMemo(
    () => chapters.map((c) => ({ id: String(c.id), center: c.position, radiusM: c.radiusM })),
    [chapters],
  );
  const placeSlugs = useMemo(() => chapters.map((c) => c.placeSlug).filter((s): s is string => Boolean(s)), [chapters]);
  const totalM = useMemo(() => lineLengthM(route), [route]);

  // tappe già timbrate in passato contano come visitate
  const isVisited = useCallback(
    (i: number) => visited.has(i) || Boolean(chapters[i]!.placeSlug && stamps[chapters[i]!.placeSlug!]),
    [visited, stamps, chapters],
  );
  const nextIndex = chapters.findIndex((_, i) => !isVisited(i));
  const next = nextIndex >= 0 ? chapters[nextIndex]! : null;

  /* mappa: layer e vista iniziale */
  useEffect(() => {
    if (!map) return;
    addItineraryLayers(map, route, stops, color);
    const [minX, minY, maxX, maxY] = bbox(route);
    map.fitBounds([[minX, minY], [maxX, maxY]], { padding: 50, duration: 0 });
    const stopFollow = () => setFollowing(false);
    map.on("dragstart", stopFollow);
    return () => {
      map.off("dragstart", stopFollow);
    };
  }, [map, route, stops, color]);

  /* aggiornamento posizione → marker, progresso, geofence */
  useEffect(() => {
    if (!started || !pos) return;
    const p = source === "gps" ? smoothPosition(smoothed.current, pos, accuracy) : pos;
    smoothed.current = p;
    setUserPos(p);

    if (map) {
      if (!marker.current) {
        import("maplibre-gl").then((ml) => {
          if (marker.current) return;
          marker.current = new ml.Marker({ element: userMarkerEl(), rotationAlignment: "map" }).setLngLat(p).addTo(map);
        });
      } else marker.current.setLngLat(p);
      const along = locateOnLine(route, p).alongM;
      setItineraryProgress(map, route, totalM ? along / totalM : 0, stops, nextIndex);
      // segue l'utente solo per spostamenti apprezzabili: niente animazioni continue sul jitter
      const c = map.getCenter();
      if (following && distanceM([c.lng, c.lat], p) > 3) {
        map.easeTo({ center: p, zoom: Math.max(map.getZoom(), 16.5), duration: reducedMotion() ? 0 : 800 });
      }
    }

    const events = updateGeofences(fenceState.current, fences, p, source === "gps" ? accuracy : 0);
    for (const ev of events) {
      if (ev.type !== "enter") continue;
      const i = chapters.findIndex((c) => String(c.id) === ev.id);
      if (i < 0 || visited.has(i)) continue;
      const c = chapters[i]!;
      setVisited((v) => new Set(v).add(i));
      const newStamp = c.placeSlug ? addStamp(c.placeSlug, slug) : false;
      setArrival({ index: i, newStamp });
      setExpanded(false);
      navigator.vibrate?.([120, 60, 120]);
      audio.play({ id: `ch-${c.id}`, title: c.title, text: c.plain, lang: locale, src: c.audioSrc });
      if (checkBadge(slug, placeSlugs)) setCompleted(true);
      break; // una tappa alla volta
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reagisce solo ai cambi di posizione
  }, [pos, started, map]);

  /* cono di direzione del marker */
  useEffect(() => {
    const el = marker.current?.getElement().querySelector<HTMLElement>("[data-cone]");
    if (!el) return;
    if (heading === null) el.style.opacity = "0";
    else {
      el.style.opacity = "1";
      el.style.transform = `translate(-50%, -100%) rotate(${heading - (map?.getBearing() ?? 0)}deg)`;
    }
  }, [heading, map, pos]);

  useEffect(() => () => stopPosition(), []);

  const begin = (simulated: boolean) => {
    setStarted(true);
    void requestCompass();
    if (simulated) {
      // parte poco prima della prima tappa
      const first = chapters[0]!.position;
      setSimulatedPosition([first[0] - 0.0008, first[1] - 0.0006]);
    } else startGps();
  };

  const distToNext = userPos && next ? distanceM(userPos, next.position) : null;
  const bearingToNext = userPos && next ? bearingDeg(userPos, next.position) : null;
  const arrowRotation = bearingToNext === null ? 0 : heading !== null ? bearingToNext - heading : bearingToNext - (map?.getBearing() ?? 0);
  const arrived = arrival ? chapters[arrival.index]! : null;

  /* ── schermata iniziale ────────────────────────────── */
  if (!started) {
    return (
      <main id="main" className="relative grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_50%_0%,var(--color-primario-700),var(--color-neutro-950)_70%)] px-5 py-16 text-white">
        <Link href={`/itinerari/${slug}`} className="absolute top-4 left-3 grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label={ti("backToItinerary")}>
          <IconArrowLeft />
        </Link>
        <div className="max-w-md text-center">
          <IconWalk size={44} className="mx-auto text-arancio-300" />
          <p className="eyebrow mt-6 text-arancio-300">{t("title")}</p>
          <h1 className="mt-2 text-4xl tracking-[-0.045em]">{title}</h1>
          <p className="mt-5 leading-relaxed text-neutro-100/85">{t("intro")}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button type="button" onClick={() => begin(false)} className="min-h-12 w-full max-w-xs rounded-full bg-arancio-500 px-6 font-semibold text-neutro-950 hover:bg-arancio-300">
              {t("start")}
            </button>
            {publicEnv.demoTools && (
              <button type="button" onClick={() => begin(true)} className="min-h-12 w-full max-w-xs rounded-full border border-white/40 px-6 font-semibold text-white hover:bg-white/10">
                {t("startSimulated")}
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  /* ── passeggiata attiva ────────────────────────────── */
  return (
    <main id="main" className="relative h-dvh overflow-hidden bg-neutro-100">
      <div ref={mapRef} className="absolute inset-0" role="region" aria-label={ti("routeMap")} />

      {/* barra superiore con prossima tappa e bussola */}
      <div className="absolute inset-x-0 top-0 z-20 p-3 pt-[max(.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-[var(--shadow-float)] backdrop-blur">
          <Link href={`/itinerari/${slug}`} className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-neutro-100" aria-label={ti("backToItinerary")}>
            <IconArrowLeft />
          </Link>
          {status === "locating" && <p className="flex-1 text-sm text-neutro-600">{t("locating")}</p>}
          {status === "denied" && <p className="flex-1 text-sm text-primario-700">{t("denied")}</p>}
          {status === "unavailable" && <p className="flex-1 text-sm text-primario-700">{t("unavailable")}</p>}
          {status === "active" && next && (
            <>
              <div className="min-w-0 flex-1" aria-live="polite">
                <p className="eyebrow text-neutro-500">
                  {t("next")} · {nextIndex + 1}/{chapters.length}
                </p>
                <p className="truncate font-display text-lg leading-tight">{next.placeName ?? next.title}</p>
                <p className="text-sm text-neutro-600">
                  {distToNext !== null && formatDistance(distToNext, locale)}
                  {bearingToNext !== null && ` · ${t("toward", { dir: cardinal(bearingToNext, locale) })}`}
                  {source === "gps" && accuracy > 0 && <span className="text-neutro-400"> · {t("accuracy", { m: Math.round(accuracy) })}</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => compass !== "active" && requestCompass()}
                className="relative grid size-14 shrink-0 place-items-center rounded-full text-white shadow-inner"
                style={{ backgroundColor: color }}
                aria-label={
                  compass === "active"
                    ? t("compassLabel", { deg: Math.round(((arrowRotation % 360) + 360) % 360) })
                    : t("compassEnable")
                }
              >
                <IconArrowUp size={28} style={{ transform: `rotate(${arrowRotation}deg)`, transition: "transform .3s ease-out" }} />
                {compass !== "active" && <IconCompass size={14} className="absolute right-0 bottom-0 rounded-full bg-white text-neutro-700" />}
              </button>
            </>
          )}
          {status === "active" && !next && <p className="flex-1 font-display text-lg">{t("completed")}</p>}
        </div>
        {compass === "unsupported" && status === "active" && (
          <p className="mx-auto mt-2 max-w-xl rounded-xl bg-neutro-900/80 px-3 py-1.5 text-center text-xs text-white">{t("compassUnavailable")}</p>
        )}
      </div>

      {/* elenco tappe */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-[max(.75rem,env(safe-area-inset-bottom))]">
        <div className="mb-2 flex justify-end px-3">
          {!following && (
            <button
              type="button"
              onClick={() => setFollowing(true)}
              className="grid size-12 place-items-center rounded-full bg-white shadow-[var(--shadow-float)]"
              aria-label={t("recenter")}
            >
              <IconLocate />
            </button>
          )}
        </div>
        <ol aria-label={t("allStops")} className="scrollbar-none flex gap-2 overflow-x-auto px-3 pb-1">
          {chapters.map((c, i) => (
            <li key={c.id} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setFollowing(false);
                  map?.flyTo({ center: c.position, zoom: 17, duration: reducedMotion() ? 0 : 1200 });
                }}
                className={`flex min-h-12 items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-medium shadow-[var(--shadow-card)] ${
                  i === nextIndex ? "bg-neutro-900 text-white" : "bg-white text-neutro-800"
                }`}
              >
                <span
                  className="grid size-8 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: isVisited(i) ? "var(--color-primario-600)" : color }}
                >
                  {isVisited(i) ? <IconCheck size={16} /> : i + 1}
                </span>
                <span className="max-w-[11rem] truncate">{c.placeName ?? c.title}</span>
                {isVisited(i) && <span className="sr-only">{t("visited")}</span>}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {publicEnv.demoTools && <DemoSimulator map={map} route={route} stops={chapters.map((c) => c.position)} />}

      {/* card di arrivo */}
      <AnimatePresence>
        {arrived && (
          <motion.section
            role="dialog"
            aria-modal="false"
            aria-labelledby="arrival-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className={`absolute inset-x-0 bottom-0 z-40 overflow-y-auto rounded-t-[2rem] bg-neutro-50 shadow-[0_-20px_60px_rgba(0,0,0,.35)] ${expanded ? "top-12" : "max-h-[78%]"}`}
          >
            <div className="mx-auto max-w-xl p-5 pb-[max(6rem,calc(env(safe-area-inset-bottom)+6rem))]">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutro-300" />
              {arrived.image && (
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image src={arrived.image.url} alt={arrived.image.alt} fill sizes="600px" className="object-cover" />
                  {arrival?.newStamp && arrived.placeName && (
                    <div className="absolute right-3 bottom-3">
                      <Stamp name={arrived.placeName} size={96} animate color="#ffffff" />
                    </div>
                  )}
                </div>
              )}
              <p className="eyebrow text-primario-600">{t("arrived")}</p>
              <h2 id="arrival-title" className="mt-1 text-3xl">
                {arrived.title}
              </h2>
              {arrival?.newStamp && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primario-50 px-3 py-1 text-sm font-semibold text-primario-700" role="status">
                  {t("stamped")}
                </p>
              )}
              {expanded ? (
                <div className="prose-story mt-5 text-neutro-800" dangerouslySetInnerHTML={{ __html: arrived.html }} />
              ) : (
                <p className="mt-3 line-clamp-3 leading-relaxed text-neutro-700">{arrived.plain}</p>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                {!expanded && (
                  <button type="button" onClick={() => setExpanded(true)} className="min-h-12 rounded-full bg-neutro-900 px-5 font-semibold text-white">
                    {t("readChapter")}
                  </button>
                )}
                <button type="button" onClick={() => setArrival(null)} className="inline-flex min-h-12 items-center gap-1.5 rounded-full border border-neutro-300 px-5 font-semibold">
                  <IconClose size={18} /> {t("close")}
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* itinerario completato */}
      <AnimatePresence>
        {completed && !arrived && (
          <motion.div
            role="alertdialog"
            aria-labelledby="done-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 grid place-items-center bg-neutro-950/80 p-6 backdrop-blur"
          >
            <div className="max-w-sm rounded-3xl bg-neutro-50 p-8 text-center">
              <div className="mx-auto w-fit">
                <Stamp name={title} size={150} animate color={color} date={new Date().toLocaleDateString(locale)} />
              </div>
              <h2 id="done-title" className="mt-4 text-3xl">
                {t("completed")}
              </h2>
              <p className="mt-2 text-neutro-600">{t("completedText")}</p>
              <div className="mt-6 flex flex-col gap-2">
                <Link href="/passaporto" className="min-h-12 rounded-full bg-primario-700 px-6 py-3 font-semibold text-white">
                  {th("openPassport")}
                </Link>
                <button type="button" onClick={() => setCompleted(false)} className="min-h-12 rounded-full border border-neutro-300 px-6 font-semibold">
                  {t("close")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
