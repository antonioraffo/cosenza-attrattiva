"use client";

import { useTranslations } from "next-intl";
import { publicEnv } from "@/lib/env";
import { ConsentGate } from "../ConsentGate";
import { FullscreenModal } from "../Modal";
import type { FlyStop } from "./FlightControls";
import { Google3DFlight } from "./Google3DFlight";
import { GoogleFlight } from "./GoogleFlight";
import { MaplibreFlight } from "./MaplibreFlight";

export type { FlyStop };

/**
 * Volo 3D tra le tappe di un itinerario. Il motore si sceglie con NEXT_PUBLIC_FLY3D_PROVIDER:
 * "google3d" (3D Maps della Maps JavaScript API), "maplibre" (dati locali, nessuna chiave) o
 * "google" (Photorealistic 3D Tiles con CesiumJS). I motori Google stanno dietro il consenso.
 */
export default function Fly3DModal({ title, stops, onClose }: { title: string; stops: FlyStop[]; onClose: () => void }) {
  const t = useTranslations("immersive");
  return (
    <FullscreenModal title={t("flyTitle", { title })} onClose={onClose}>
      {publicEnv.fly3dProvider === "maplibre" ? (
        <MaplibreFlight stops={stops} />
      ) : (
        <ConsentGate>{publicEnv.fly3dProvider === "google3d" ? <Google3DFlight stops={stops} /> : <GoogleFlight stops={stops} />}</ConsentGate>
      )}
    </FullscreenModal>
  );
}
