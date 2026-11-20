"use client";

import { useTranslations } from "next-intl";
import { IconHeadphones, IconPause, IconPlay } from "@/components/ui/icons";
import { useAudio, type Track } from "./AudioProvider";

export function ListenButton({
  id,
  title,
  text,
  lang,
  src,
  variant = "solid",
}: Track & { variant?: "solid" | "ghost" }) {
  const t = useTranslations("audio");
  const ts = useTranslations("story");
  const { track, status, play, toggle, ttsSupported } = useAudio();
  const current = track?.id === id;
  const playing = current && status === "playing";
  if (!src && !ttsSupported) return null;

  return (
    <button
      type="button"
      onClick={() => (current && status !== "idle" ? toggle() : play({ id, title, text, lang, src }))}
      aria-pressed={playing}
      className={
        variant === "solid"
          ? "inline-flex min-h-12 items-center gap-2 rounded-full bg-pietra-900 px-5 font-semibold text-white transition hover:bg-pietra-800"
          : "inline-flex min-h-11 items-center gap-2 rounded-full border border-pietra-300 px-4 text-sm font-semibold text-pietra-800 transition hover:bg-pietra-100"
      }
    >
      {playing ? <IconPause size={16} /> : current && status === "paused" ? <IconPlay size={16} /> : <IconHeadphones size={18} />}
      {playing ? t("pause") : ts("listen")}
    </button>
  );
}
