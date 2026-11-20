"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { passport, resetPassport } from "@/lib/stores/passport";
import { IconWalk } from "@/components/ui/icons";
import { Stamp } from "./Stamp";

export function PassportView({
  itineraries,
  placeNames,
}: {
  itineraries: { slug: string; title: string; color: string; places: string[] }[];
  placeNames: Record<string, string>;
}) {
  const t = useTranslations("passport");
  const locale = useLocale();
  const state = passport.useStore();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- il passaporto vive in localStorage: si mostra dopo l'idratazione
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="mt-10 h-64 animate-pulse rounded-3xl bg-pietra-100" />;

  const stamps = Object.entries(state.stamps).sort((a, b) => b[1].at.localeCompare(a[1].at));
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="mt-10 space-y-14">
      <section aria-labelledby="stamps-title" className="rounded-[2rem] border border-pietra-200 bg-[repeating-linear-gradient(0deg,transparent_0_31px,rgba(127,109,86,.08)_31px_32px)] bg-white p-6 md:p-10">
        <h2 id="stamps-title" className="text-2xl">
          {t("stamps", { count: stamps.length })}
        </h2>
        {stamps.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-serif text-xl">{t("emptyTitle")}</p>
            <p className="mt-2 text-pietra-600">{t("emptyText")}</p>
            <IconWalk size={36} className="mx-auto mt-6 text-pietra-400" />
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {stamps.map(([slug, s], i) => (
              <li key={slug} className="flex flex-col items-center text-center">
                <Link href={`/luoghi/${slug}`} className="rounded-full">
                  <Stamp
                    name={placeNames[slug] ?? slug}
                    date={fmt(s.at).toUpperCase()}
                    color={["#8a2440", "#2f6244", "#8a6a2f", "#3d4a7a"][i % 4]}
                    size={124}
                  />
                </Link>
                <p className="mt-1 text-xs text-pietra-500">{t("stampedOn", { date: fmt(s.at) })}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="badges-title">
        <h2 id="badges-title" className="text-3xl">
          {t("badges")}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {itineraries.map((it) => {
            const done = it.places.filter((p) => state.stamps[p]).length;
            const badge = state.badges[it.slug];
            return (
              <li key={it.slug} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[var(--shadow-card)]">
                <Stamp name={it.title} size={84} color={it.color} muted={!badge} date={badge ? fmt(badge).toUpperCase() : undefined} />
                <div className="min-w-0 flex-1">
                  <Link href={`/itinerari/${it.slug}`} className="font-serif text-lg hover:underline">
                    {it.title}
                  </Link>
                  <p className="text-sm text-pietra-600">{t("progress", { done, total: it.places.length })}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-pietra-200" aria-hidden="true">
                    <div className="h-full rounded-full" style={{ width: `${(done / Math.max(1, it.places.length)) * 100}%`, backgroundColor: it.color }} />
                  </div>
                  {!badge && <p className="mt-1.5 text-xs text-pietra-500">{t("badgeLocked")}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {stamps.length > 0 && (
        <button
          type="button"
          onClick={() => window.confirm(t("resetConfirm")) && resetPassport()}
          className="min-h-11 rounded-full border border-pietra-300 px-5 text-sm font-semibold text-pietra-700 hover:bg-pietra-100"
        >
          {t("reset")}
        </button>
      )}
    </div>
  );
}
