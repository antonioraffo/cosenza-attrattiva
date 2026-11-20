"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { IconClose, IconHeadphones, IconPause, IconPlay } from "@/components/ui/icons";
import { useAudio } from "./AudioProvider";

const RATES = [0.85, 1, 1.15, 1.3];

/** Mini-player persistente: resta visibile tra una pagina e l'altra. */
export function AudioPlayer() {
  const t = useTranslations("audio");
  const { track, status, progress, rate, mode, toggle, stop, setRate } = useAudio();
  const reduce = useReducedMotion();
  const visible = track && status !== "idle";

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          aria-label={t("player")}
          initial={reduce ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl bg-neutro-900/95 text-neutro-50 shadow-[var(--shadow-float)] backdrop-blur safe-bottom md:bottom-5"
          style={{ paddingBottom: undefined }}
        >
          <div className="flex items-center gap-3 p-3">
            <button
              type="button"
              onClick={toggle}
              className="grid size-12 shrink-0 place-items-center rounded-full bg-arancio-500 text-neutro-950 transition hover:bg-arancio-300"
              aria-label={status === "playing" ? t("pause") : t("play")}
            >
              {status === "playing" ? <IconPause /> : <IconPlay />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-arancio-300 uppercase">
                <IconHeadphones size={13} /> {t("nowPlaying")}
                {mode === "tts" && <span className="font-normal normal-case text-neutro-300">· {t("tts")}</span>}
              </p>
              <p className="truncate font-display text-[15px]">{track.title}</p>
              <div
                className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutro-700"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                aria-label={track.title}
              >
                <div className="h-full bg-arancio-500 transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <label className="sr-only" htmlFor="audio-rate">
              {t("speed")}
            </label>
            <select
              id="audio-rate"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="rounded-lg bg-neutro-800 px-1.5 py-1 text-xs tabular-nums text-neutro-100"
            >
              {RATES.map((r) => (
                <option key={r} value={r}>
                  {r}×
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={stop}
              className="grid size-10 place-items-center rounded-full text-neutro-300 hover:bg-neutro-800 hover:text-white"
              aria-label={t("stop")}
            >
              <IconClose />
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
