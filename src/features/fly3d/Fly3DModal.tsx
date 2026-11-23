"use client";

import { useTranslations } from "next-intl";
import { publicEnv } from "@/lib/env";
import { ConsentGate } from "../ConsentGate";
import { FullscreenModal } from "../Modal";
import type { FlyStop } from "./FlightControls";
import { GoogleFlight } from "./GoogleFlight";
import { MaplibreFlight } from "./MaplibreFlight";

export type { FlyStop };

/**
 * Volo 3D tra le tappe di un itinerario. Il motore si sceglie con NEXT_PUBLIC_FLY3D_PROVIDER:
 * "maplibre" (predefinito, dati locali) o "google" (Photorealistic 3D Tiles, dietro il consenso).
 */
export default function Fly3DModal({ title, stops, onClose }: { title: string; stops: FlyStop[]; onClose: () => void }) {
  const t = useTranslations("immersive");
  return (
    <FullscreenModal title={t("flyTitle", { title })} onClose={onClose}>
      {publicEnv.fly3dProvider === "google" ? (
        <ConsentGate>
          <GoogleFlight stops={stops} />
        </ConsentGate>
      ) : (
        <MaplibreFlight stops={stops} />
      )}
    </FullscreenModal>
  );
}
