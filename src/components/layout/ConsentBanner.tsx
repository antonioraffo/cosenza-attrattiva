"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { consentStore, setConsent } from "@/lib/stores/consent";
import { features } from "@/lib/env";

const needsGoogle = features.streetView || features.view3d;

/** Banner di consenso: i servizi Google (Street View, 3D) si caricano solo dopo l'opt-in. */
export function ConsentBanner() {
  const t = useTranslations("consent");
  const decided = consentStore.useStore((s) => s.decided);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- evita il flash in SSR: il consenso vive in localStorage
  useEffect(() => setMounted(true), []);

  if (!needsGoogle) return null;
  return (
    <AnimatePresence>
      {mounted && !decided && (
        <motion.div
          role="dialog"
          aria-labelledby="consent-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-lg rounded-2xl border border-neutro-200 bg-white p-5 shadow-[var(--shadow-float)]"
        >
          <h2 id="consent-title" className="text-lg">
            {t("title")}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-neutro-600">{t("text")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConsent(true)}
              className="min-h-11 rounded-full bg-primario-700 px-5 text-sm font-semibold text-white hover:bg-primario-600"
            >
              {t("acceptGoogle")}
            </button>
            <button
              type="button"
              onClick={() => setConsent(false)}
              className="min-h-11 rounded-full border border-neutro-300 px-5 text-sm font-semibold text-neutro-800 hover:bg-neutro-100"
            >
              {t("necessaryOnly")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConsentManageButton() {
  const t = useTranslations("consent");
  if (!needsGoogle) return null;
  return (
    <button
      type="button"
      onClick={() => consentStore.set((s) => ({ ...s, decided: false }))}
      className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
    >
      {t("manage")}
    </button>
  );
}
