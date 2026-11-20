"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { features } from "@/lib/env";
import type { LngLat } from "@/lib/geo";
import type { ArConfig, StreetViewConfig } from "@/server/db/schema";
import { IconCamera, IconCube, IconStreet } from "@/components/ui/icons";

// Moduli pesanti caricati solo all'apertura (code splitting)
const StreetViewModal = dynamic(() => import("./streetview/StreetViewModal"), { ssr: false });
const Fly3DModal = dynamic(() => import("./fly3d/Fly3DModal"), { ssr: false });
const ArModal = dynamic(() => import("./ar/ArView"), { ssr: false });

export interface PlaceImmersive {
  slug: string;
  name: string;
  center: LngLat;
  streetview: StreetViewConfig | null;
  ar: ArConfig | null;
}

type Props =
  | {
      kind: "place";
      placeSlug: string;
      hasStreetview: boolean;
      hasAr: boolean;
      /** dati già disponibili (scheda luogo); altrimenti si caricano da /api/places/[slug] */
      place?: PlaceImmersive;
      compact?: boolean;
    }
  | {
      kind: "fly3d";
      itinerary: { slug: string; title: string; color: string; stops: { name: string; position: LngLat }[] };
      compact?: boolean;
    };

const btn =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-neutro-300 bg-white px-4 text-sm font-semibold text-neutro-800 transition hover:border-neutro-500";

export function ImmersiveLauncher(props: Props) {
  const t = useTranslations("story");
  const [open, setOpen] = useState<null | "sv" | "ar" | "3d">(null);
  const [place, setPlace] = useState<PlaceImmersive | null>(props.kind === "place" ? (props.place ?? null) : null);

  if (props.kind === "fly3d") {
    if (!features.view3d) return null;
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen("3d")}
          className={props.compact ? "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-neutro-900 px-3.5 text-sm font-semibold text-white" : btn}
        >
          <IconCube size={18} /> {t("view3d")}
        </button>
        {open === "3d" && <Fly3DModal title={props.itinerary.title} stops={props.itinerary.stops} onClose={() => setOpen(null)} />}
      </>
    );
  }

  const showSv = features.streetView && props.hasStreetview;
  const showAr = features.ar && props.hasAr;
  if (!showSv && !showAr) return null;

  const ensure = async (): Promise<PlaceImmersive | null> => {
    if (place) return place;
    const r = await fetch(`/api/places/${props.placeSlug}`);
    if (!r.ok) return null;
    const j = (await r.json()) as {
      slug: string;
      name: { it: string; en: string };
      position: LngLat;
      streetview: StreetViewConfig | null;
      ar: ArConfig | null;
    };
    const lang = document.documentElement.lang === "en" ? "en" : "it";
    const p = { slug: j.slug, name: j.name[lang] || j.name.it, center: j.position, streetview: j.streetview, ar: j.ar };
    setPlace(p);
    return p;
  };

  const openWith = async (k: "sv" | "ar") => {
    if (await ensure()) setOpen(k);
  };

  return (
    <>
      {showSv && (
        <button type="button" onClick={() => openWith("sv")} className={btn}>
          <IconStreet size={18} /> {t("streetView")}
        </button>
      )}
      {showAr && (
        <button type="button" onClick={() => openWith("ar")} className={btn}>
          <IconCamera size={18} /> {t("ar")}
        </button>
      )}
      {open === "sv" && place?.streetview && (
        <StreetViewModal config={place.streetview} placeName={place.name} onClose={() => setOpen(null)} />
      )}
      {open === "ar" && place && (
        <ArModal
          focusSlug={place.slug}
          // in demo: punto di vista simulato davanti al luogo (quello di Street View, se presente)
          fallbackViewpoint={place.streetview ? [place.streetview.lng, place.streetview.lat] : [place.center[0] - 0.0012, place.center[1] - 0.0009]}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
