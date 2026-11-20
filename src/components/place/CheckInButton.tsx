"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { distanceM, formatDistance, type LngLat } from "@/lib/geo";
import { addStamp, passport } from "@/lib/stores/passport";
import { getCurrentPosition } from "@/lib/stores/position";
import { IconStamp } from "@/components/ui/icons";
import { Stamp } from "@/components/passport/Stamp";

/** Check-in del Passaporto: il timbro si ottiene solo se la posizione è entro il raggio. */
export function CheckInButton({
  slug,
  name,
  center,
  radiusM,
  locale,
}: {
  slug: string;
  name: string;
  center: LngLat;
  radiusM: number;
  locale: "it" | "en";
}) {
  const t = useTranslations("place");
  const stamped = passport.useStore((s) => Boolean(s.stamps[slug]));
  const [state, setState] = useState<"idle" | "checking" | "far" | "error">("idle");
  const [dist, setDist] = useState(0);

  const check = async () => {
    setState("checking");
    try {
      const { position } = await getCurrentPosition();
      const d = distanceM(position, center);
      if (d <= radiusM) {
        addStamp(slug);
        setState("idle");
      } else {
        setDist(d);
        setState("far");
      }
    } catch {
      setState("error");
    }
  };

  if (stamped) {
    return (
      <div className="flex items-center gap-4" role="status">
        <Stamp name={name} size={88} animate />
        <p className="font-serif text-xl text-magliocco-700">{t("checkedIn")}</p>
      </div>
    );
  }
  return (
    <div>
      <button
        type="button"
        onClick={check}
        disabled={state === "checking"}
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-magliocco-700 px-6 font-semibold text-white hover:bg-magliocco-600 disabled:opacity-70"
      >
        <IconStamp size={18} /> {state === "checking" ? t("checkingIn") : t("checkIn")}
      </button>
      <p className="mt-2 text-sm text-pietra-600" aria-live="polite">
        {state === "far" && t("tooFar", { distance: formatDistance(dist, locale), radius: radiusM })}
      </p>
    </div>
  );
}
