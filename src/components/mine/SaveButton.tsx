"use client";

import { useTranslations } from "next-intl";
import { myItinerary, toggleSaved } from "@/lib/stores/my-itinerary";

/** Cuore "salva nel mio itinerario" (stato in localStorage, nessun dato al server). */
export function SaveButton({ slug, name, variant = "icon" }: { slug: string; name: string; variant?: "icon" | "pill" }) {
  const t = useTranslations("mine");
  const saved = myItinerary.useStore((s) => s.places.includes(slug));
  const heart = (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" strokeLinejoin="round" />
    </svg>
  );
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={variant === "icon" ? `${t("save")}: ${name}` : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(slug);
      }}
      className={variant === "icon" ? "ca-save-icon" : "ca-save-pill"}
    >
      {heart}
      {variant === "pill" && <span>{saved ? t("saved") : t("save")}</span>}
    </button>
  );
}
