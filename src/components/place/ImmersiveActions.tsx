"use client";

import { ImmersiveLauncher, type PlaceImmersive } from "@/features/ImmersiveLauncher";

export function ImmersiveActions({ place }: { place: PlaceImmersive }) {
  return (
    <ImmersiveLauncher
      kind="place"
      placeSlug={place.slug}
      hasStreetview={Boolean(place.streetview)}
      hasAr={Boolean(place.ar)}
      place={place}
    />
  );
}
