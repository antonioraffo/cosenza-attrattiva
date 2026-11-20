"use client";

import { useTranslations } from "next-intl";
import { consentStore, setConsent } from "@/lib/stores/consent";

/** Mostra i contenuti Google solo dopo il consenso esplicito. */
export function ConsentGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("consent");
  const google = consentStore.useStore((s) => s.google);
  if (google) return <>{children}</>;
  return (
    <div className="grid size-full place-items-center p-6">
      <div className="max-w-sm rounded-2xl bg-white p-6 text-center text-pietra-900">
        <p className="leading-relaxed">{t("required")}</p>
        <button
          type="button"
          onClick={() => setConsent(true)}
          className="mt-5 min-h-12 rounded-full bg-magliocco-700 px-6 font-semibold text-white hover:bg-magliocco-600"
        >
          {t("grant")}
        </button>
      </div>
    </div>
  );
}
