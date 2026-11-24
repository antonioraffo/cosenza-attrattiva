"use client";

/* eslint-disable @next/next/no-img-element -- miniature già ottimizzate in public/media */
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, LngLatBoundsLike } from "maplibre-gl";
import { Link } from "@/i18n/navigation";
import { bbox, type LngLat } from "@/lib/geo";
import { formatKm } from "@/lib/format";
import { WALK_M_PER_MIN } from "@/lib/plan";
import { moveSaved, myItinerary, setSaved, shareParam, toggleSaved } from "@/lib/stores/my-itinerary";
import { useMapLibre } from "@/components/map/useMapLibre";
import { IconArrowRight, IconWalk } from "@/components/ui/icons";
import { walkMinutes } from "./useSavedPlaces";
import { useOrigin } from "@/components/mine/useOrigin";
import { whatsappHref } from "./MyItineraryButton";

export interface MinePlace {
  slug: string;
  name: string;
  summary: string;
  categoryLabel: string;
  position: LngLat;
  image: string | null;
}

/**
 * Vista di "Il mio itinerario". Con `shared` mostra le tappe ricevute da un link (senza toccare
 * quelle salvate finché non si sceglie "Salva nel mio itinerario"); altrimenti quelle del telefono.
 */
export function MyItineraryView({ places, shared }: { places: MinePlace[]; shared: string[] | null }) {
  const t = useTranslations("mine");
  const origin = useOrigin();
  const locale = useLocale() as "it" | "en";
  const saved = myItinerary.useStore((s) => s.places);
  const slugs = shared ?? saved;
  const editable = shared === null;
  const list = useMemo(() => slugs.map((s) => places.find((p) => p.slug === s)).filter((p) => p !== undefined), [slugs, places]);
  const param = shareParam(list.map((p) => p.slug));
  // percorso pedonale reale (OSRM) tra le tappe; finché non arriva, linea retta e minuti stimati
  const [real, setReal] = useState<{ key: string; coordinates: LngLat[]; distanceM: number } | null>(null);
  const route = real?.key === param ? real : null;
  useEffect(() => {
    if (list.length < 2) return;
    let alive = true;
    fetch(`/api/walking-route?p=${param}`)
      .then((r) => r.json() as Promise<{ coordinates: LngLat[]; distanceM: number; source: string }>)
      .then((r) => alive && r.source === "osrm" && setReal({ key: param, coordinates: r.coordinates, distanceM: r.distanceM }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [param, list.length]);
  const minutes = list.length > 1 ? (route ? Math.round(route.distanceM / WALK_M_PER_MIN) : walkMinutes(list.map((p) => p.position))) : 0;
  const el = useRef<HTMLDivElement>(null);
  const map = useMapLibre(el, locale, { cooperativeGestures: true }, list.length > 0);

  useEffect(() => {
    if (!map) return;
    const data = {
      type: "FeatureCollection" as const,
      features: [
        ...(list.length > 1
          ? [{ type: "Feature" as const, properties: { n: "" }, geometry: { type: "LineString" as const, coordinates: route?.coordinates ?? list.map((p) => p.position) } }]
          : []),
        ...list.map((p, i) => ({ type: "Feature" as const, properties: { n: String(i + 1) }, geometry: { type: "Point" as const, coordinates: p.position } })),
      ],
    };
    const src = map.getSource("mine") as GeoJSONSource | undefined;
    if (src) src.setData(data);
    else {
      map.addSource("mine", { type: "geojson", data });
      map.addLayer({
        id: "mine-line",
        type: "line",
        source: "mine",
        filter: ["==", ["geometry-type"], "LineString"],
        paint: { "line-color": "#0f7663", "line-width": 3, "line-dasharray": [2, 1.5] },
      });
      map.addLayer({
        id: "mine-dot",
        type: "circle",
        source: "mine",
        filter: ["==", ["geometry-type"], "Point"],
        paint: { "circle-radius": 12, "circle-color": "#0f7663", "circle-stroke-color": "#ffffff", "circle-stroke-width": 2.5 },
      });
      map.addLayer({
        id: "mine-n",
        type: "symbol",
        source: "mine",
        filter: ["==", ["geometry-type"], "Point"],
        layout: { "text-field": ["get", "n"], "text-size": 12, "text-font": ["Noto Sans Medium"], "text-allow-overlap": true },
        paint: { "text-color": "#ffffff" },
      });
    }
    // tratteggio = linea retta provvisoria; continua = percorso pedonale reale
    map.setPaintProperty("mine-line", "line-dasharray", route ? undefined : [2, 1.5]);
    if (list.length === 1) map.jumpTo({ center: list[0]!.position, zoom: 16 });
    else if (list.length > 1) map.fitBounds(bbox(route?.coordinates ?? list.map((p) => p.position)) as LngLatBoundsLike, { padding: 56, maxZoom: 17, duration: 0 });
  }, [map, list, route]);

  const shareUrl = `${origin}/${locale}/mio-itinerario?p=${param}`;
  const shareText = t("shareText", { places: list.map((p) => p.name.split(" – ")[0]).join(", ") });

  return (
    <>
      <div>
        <p className="ca-pillar-badge ca-pillar-badge--connect">Cosenza Connect</p>
        <h1 className="ca-page-title">{shared ? t("sharedTitle") : t("title")}</h1>
        <p className="ca-section-intro">{shared ? t("sharedText") : t("localNote")}</p>
      </div>

      {list.length === 0 ? (
        <div className="ca-drawer-empty">
          <p>{t("empty")}</p>
          <Link href="/esplora" className="ca-heading-action">
            {t("explore")} <IconArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div className="ca-mine-actions">
            {list.length > 1 ? (
              <Link href={`/mio-itinerario/passeggiata?p=${param}`} className="ca-mine-btn">
                <IconWalk size={18} />
                <span>{t("walk")}</span>
              </Link>
            ) : (
              <p className="ca-demo-note">{t("walkNeedsTwo")}</p>
            )}
            {shared ? (
              <button type="button" className="ca-mine-btn ca-mine-btn--outline" onClick={() => setSaved([...saved, ...shared])}>
                {t("keep")}
              </button>
            ) : (
              <a href={whatsappHref(shareText, shareUrl)} target="_blank" rel="noopener noreferrer" className="ca-mine-btn ca-drawer-whatsapp">
                {t("share")}
              </a>
            )}
          </div>
          <p className="ca-demo-note">
            {t("count", { count: list.length })}
            {minutes > 0 && ` · ${route ? t("minutesReal", { min: minutes, km: formatKm(route.distanceM, locale) }) : t("minutes", { min: minutes })}`}
          </p>
          <div className="ca-xp-layout">
            <ol className="ca-xp-list">
              {list.map((p, i) => (
                <li key={p.slug} className="ca-place-card">
                  {p.image ? <img src={p.image} alt="" width={112} height={92} loading="lazy" /> : <span aria-hidden="true" className="ca-place-noimg" />}
                  <div>
                    <h2 className="ca-place-title">
                      <span className="ca-drawer-n" aria-hidden="true">
                        {i + 1}
                      </span>
                      <Link href={`/luoghi/${p.slug}`}>{p.name}</Link>
                    </h2>
                    <p>{p.summary}</p>
                    <p className="ca-place-meta">
                      <span>{p.categoryLabel}</span>
                    </p>
                    {editable && (
                      <span className="ca-drawer-tools ca-mine-tools">
                        <button type="button" aria-label={`${t("up")}: ${p.name}`} disabled={i === 0} onClick={() => moveSaved(p.slug, -1)}>
                          ↑
                        </button>
                        <button type="button" aria-label={`${t("down")}: ${p.name}`} disabled={i === list.length - 1} onClick={() => moveSaved(p.slug, 1)}>
                          ↓
                        </button>
                        <button type="button" aria-label={`${t("remove")}: ${p.name}`} onClick={() => toggleSaved(p.slug)}>
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <div ref={el} className="ca-xp-map" role="region" aria-label={t("map")} />
          </div>
        </>
      )}
    </>
  );
}
