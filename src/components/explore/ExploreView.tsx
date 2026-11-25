"use client";

/* eslint-disable @next/next/no-img-element -- miniature già ottimizzate in public/media */
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { Link } from "@/i18n/navigation";
import type { LngLat } from "@/lib/geo";
import { EXPLORE_GROUPS, type ExploreGroup } from "@/lib/explore";
import type { Pillar } from "@/components/layout/PillarIcon";
import { useMapLibre } from "@/components/map/useMapLibre";
import { SaveButton } from "@/components/mine/SaveButton";
import { myItinerary } from "@/lib/stores/my-itinerary";

export interface ExplorePlace {
  slug: string;
  name: string;
  summary: string;
  /** Una riga per la mini card della home. */
  sintesi: string;
  category: string;
  categoryLabel: string;
  group: ExploreGroup;
  pillar: Pillar;
  position: LngLat;
  minutes: number;
  image: { url: string; alt: string } | null;
}

const GROUPS = Object.keys(EXPLORE_GROUPS) as ExploreGroup[];

/**
 * Elenco + mappa sincronizzati: passando su una scheda si evidenzia il punto, toccando un punto si va alla scheda.
 * `compact` (home, «Esplora a piedi»): elenco a scorrimento di altezza fissa accanto alla mappa, nomi in h3,
 * mappa creata solo quando si avvicina allo schermo; la mini card mostra solo la riga di sintesi (niente pilastro né descrizione).
 */
export function ExploreView({ places, origin, compact = false }: { places: ExplorePlace[]; origin: LngLat; compact?: boolean }) {
  const t = useTranslations("explore");
  const locale = useLocale() as "it" | "en";
  const [group, setGroup] = useState<ExploreGroup | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const saved = myItinerary.useStore((s) => s.places);
  const el = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(!compact);
  useEffect(() => {
    const node = el.current;
    if (near || !node) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: "300px" });
    io.observe(node);
    return () => io.disconnect();
  }, [near]);
  const map = useMapLibre(el, locale, { center: origin, zoom: 14, cooperativeGestures: true }, near, compact ? "schematic" : "default");
  const Name = compact ? "h3" : "h2";
  const shown = useMemo(() => (group ? places.filter((p) => p.group === group) : places), [places, group]);

  const data = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: shown.map((p) => ({
        type: "Feature" as const,
        properties: {
          slug: p.slug,
          name: p.name,
          // nome corto per le etichette della mappa schematica (prima di « – » o di « (»)
          short: p.name.split(/ – | \(/)[0],
          pillar: p.pillar,
          active: p.slug === active,
          saved: saved.includes(p.slug),
        },
        geometry: { type: "Point" as const, coordinates: p.position },
      })),
    }),
    [shown, active, saved],
  );

  useEffect(() => {
    if (!map) return;
    const src = map.getSource("explore") as GeoJSONSource | undefined;
    if (src) {
      src.setData(data);
      return;
    }
    map.addSource("explore", { type: "geojson", data });
    if (compact) {
      // home: pin come nella mappa schematica di Stefano, colore del pilastro, bordo bianco, nome accanto
      map.addLayer({
        id: "explore-dot",
        type: "circle",
        source: "explore",
        paint: {
          "circle-radius": ["case", ["get", "active"], 11, 8],
          "circle-color": ["match", ["get", "pillar"], "vive", "#9c37b5", "crea", "#dd7b19", "#1a98c4"],
          "circle-stroke-color": ["case", ["get", "saved"], "#1d1d1d", "#ffffff"],
          "circle-stroke-width": ["case", ["get", "active"], 3.5, 2.5],
        },
      });
      map.addLayer({
        id: "explore-label",
        type: "symbol",
        source: "explore",
        layout: {
          "text-field": ["get", "short"],
          "text-size": 12,
          "text-offset": [1.1, 0],
          "text-anchor": "left",
          "text-font": ["Noto Sans Medium"],
          // i nomi che si sovrapporrebbero restano nascosti; quello attivo ha la precedenza
          "symbol-sort-key": ["case", ["get", "active"], 0, 1],
        },
        paint: { "text-color": ["case", ["get", "active"], "#1d1d1d", "#4a4a4a"], "text-halo-color": "#f4f1ec", "text-halo-width": 2.5 },
      });
    } else {
      map.addLayer({
        id: "explore-dot",
        type: "circle",
        source: "explore",
        paint: {
          "circle-radius": ["case", ["get", "active"], 11, 7],
          "circle-color": ["case", ["get", "saved"], "#7a2a8e", "#0f7663"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": ["case", ["get", "active"], 4, 2.5],
        },
      });
      map.addLayer({
        id: "explore-label",
        type: "symbol",
        source: "explore",
        filter: ["get", "active"],
        layout: { "text-field": ["get", "name"], "text-size": 13, "text-offset": [0, 1.4], "text-anchor": "top", "text-font": ["Noto Sans Medium"] },
        paint: { "text-color": "#211e1c", "text-halo-color": "#ffffff", "text-halo-width": 2 },
      });
    }
    const enter = (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      setActive((e.features?.[0]?.properties?.slug as string) ?? null);
    };
    const leave = () => {
      map.getCanvas().style.cursor = "";
      setActive(null);
    };
    const click = (e: MapLayerMouseEvent) => {
      const slug = e.features?.[0]?.properties?.slug as string | undefined;
      if (!slug) return;
      setActive(slug);
      document.getElementById(`place-${slug}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    map.on("mouseenter", "explore-dot", enter);
    map.on("mouseleave", "explore-dot", leave);
    map.on("click", "explore-dot", click);
  }, [map, data, compact]);

  return (
    <>
      <div className="ca-xp-filters" role="group" aria-label={t("filterLabel")}>
        <button type="button" className="ca-chip" aria-pressed={group === null} onClick={() => setGroup(null)}>
          {t("all")}
        </button>
        {GROUPS.map((g) => (
          <button key={g} type="button" className="ca-chip" aria-pressed={group === g} onClick={() => setGroup(g)}>
            {t(`groups.${g}`)}
          </button>
        ))}
      </div>
      <p className="ca-demo-note" aria-live="polite">
        {t("count", { count: shown.length })} · {t("from")}
      </p>
      <div className="ca-xp-layout" data-compact={compact || undefined}>
        <ul className="ca-xp-list">
          {shown.map((p) => (
            <li
              key={p.slug}
              id={`place-${p.slug}`}
              className="ca-place-card"
              data-active={p.slug === active}
              onMouseEnter={() => setActive(p.slug)}
              onMouseLeave={() => setActive(null)}
            >
              {p.image ? <img src={p.image.url} alt="" width={112} height={92} loading="lazy" /> : <span aria-hidden="true" className="ca-place-noimg" />}
              <div>
                <Name className="ca-place-name">
                  <Link href={`/luoghi/${p.slug}`} onFocus={() => setActive(p.slug)}>
                    {p.name}
                  </Link>
                </Name>
                <p className="ca-place-summary">{compact ? p.sintesi : p.summary}</p>
                <p className="ca-place-meta">
                  {!compact && (
                    <span className="ca-pillar-tag" data-pillar={p.pillar}>
                      {t(`pillar.${p.pillar}`)}
                    </span>
                  )}
                  <span className="ca-place-cat">{p.categoryLabel}</span>
                  <span className="ca-place-walk">{t("walk", { min: p.minutes })}</span>
                </p>
              </div>
              <SaveButton slug={p.slug} name={p.name} />
            </li>
          ))}
        </ul>
        <div ref={el} className="ca-xp-map" role="region" aria-label={t("map")} />
      </div>
    </>
  );
}
