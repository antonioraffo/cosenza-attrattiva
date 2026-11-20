"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const THEMES = ["storia", "fede", "arte", "enogastronomia", "contemporaneo", "quartieri"] as const;
type Theme = (typeof THEMES)[number];

/** Filtro per tema: riceve le card già renderizzate dal server, indicizzate per tema. */
export function ThemeFilter({ cards }: { cards: { slug: string; theme: Theme; node: ReactNode }[] }) {
  const t = useTranslations("home");
  const tt = useTranslations("themes");
  const [active, setActive] = useState<Theme | null>(null);
  const reduce = useReducedMotion();
  const available = THEMES.filter((th) => cards.some((c) => c.theme === th));
  const shown = active ? cards.filter((c) => c.theme === active) : cards;

  const chip = (selected: boolean) =>
    `min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium transition ${
      selected
        ? "border-primario-700 bg-primario-700 text-white"
        : "border-neutro-300 bg-white text-neutro-700 hover:border-neutro-500"
    }`;

  return (
    <div>
      <div role="group" aria-label={t("filterLabel")} className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <button type="button" aria-pressed={active === null} onClick={() => setActive(null)} className={chip(active === null)}>
          {t("all")}
        </button>
        {available.map((th) => (
          <button key={th} type="button" aria-pressed={active === th} onClick={() => setActive(th)} className={chip(active === th)}>
            {tt(th)}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length}
      </p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((c) => (
            <motion.li
              key={c.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              {c.node}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {shown.length === 0 && <p className="mt-6 text-neutro-500">{t("empty")}</p>}
    </div>
  );
}
