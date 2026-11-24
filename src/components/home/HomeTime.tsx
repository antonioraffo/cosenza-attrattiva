"use client";

/* eslint-disable @next/next/no-img-element -- copertine già ottimizzate in public/media */
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { formatKm } from "@/lib/format";
import { buildPlan, formatClock, TIME_OPTIONS, DEFAULT_START, type PlanLinks, type TimeOption } from "@/lib/plan";
import { myItinerary, setSaved } from "@/lib/stores/my-itinerary";
import { useOrigin } from "@/components/mine/useOrigin";
import { whatsappHref } from "@/components/mine/MyItineraryButton";
import type { TimeItinerary } from "@/components/time/TimePlanner";
import { IconArrowRight, IconWalk } from "@/components/ui/icons";

/**
 * «Il tuo tempo» e «Il tuo giro» in home, sul modello della demo di Stefano: a sinistra la scelta del tempo
 * (3 ore, 1 giorno, weekend) con riepilogo, condivisione e salvataggio; a destra la linea del giro con
 * orari, minuti a piedi tra gli itinerari e pausa. Il giro è lo stesso di /il-tuo-tempo (buildPlan),
 * con partenza alle 10:00; la pagina dedicata aggiunge mappa, orario di partenza e tappe nel dettaglio.
 */
export function HomeTime({ itineraries, links, canSave }: { itineraries: TimeItinerary[]; links: PlanLinks; canSave: boolean }) {
  const t = useTranslations("time");
  const th = useTranslations("home.time");
  const locale = useLocale();
  const origin = useOrigin();
  const [option, setOption] = useState<TimeOption>("1g");
  const [feedback, setFeedback] = useState("");
  const plan = useMemo(() => buildPlan(itineraries, links, option, DEFAULT_START), [itineraries, links, option]);
  const byslug = useMemo(() => new Map(itineraries.map((i) => [i.slug, i])), [itineraries]);
  const km = formatKm(plan.walkM, locale);
  const query = `t=${option}&ora=${DEFAULT_START}`;
  const shareText = t("shareText", { option: t(`options.${option}`), list: plan.slugs.map((s) => byslug.get(s)?.title).join(", ") });

  const save = () => {
    const before = myItinerary.get().places;
    const added = plan.places.filter((p) => !before.includes(p));
    setSaved([...before, ...added]);
    setFeedback(t("savedFeedback", { count: added.length }));
  };

  return (
    <div id="il-tuo-tempo" className="site-container ca-hometime">
      <section className="ca-hometime-pick" aria-labelledby="tempo-title">
        <h2 id="tempo-title">{th("title")}</h2>
        <p className="ca-hometime-intro">{th("intro")}</p>
        <div className="ca-hometime-options" role="radiogroup" aria-label={t("optionsLabel")}>
          {TIME_OPTIONS.map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={option === o}
              onClick={() => {
                setOption(o);
                setFeedback("");
              }}
            >
              {t(`options.${o}`)}
            </button>
          ))}
        </div>
        <p className="ca-hometime-summary" aria-live="polite">
          <strong>{th("summary", { count: plan.slugs.length })}</strong>
          <span>{th("summaryMeta", { km })}</span>
        </p>
        <div className="ca-hometime-actions">
          <a href={whatsappHref(shareText, `${origin}/${locale}/il-tuo-tempo?${query}`)} target="_blank" rel="noopener noreferrer" className="ca-mine-btn ca-drawer-whatsapp">
            {t("share")}
          </a>
          {canSave && plan.places.length > 0 && (
            <button type="button" className="ca-mine-btn ca-mine-btn--outline" onClick={save}>
              {t("save")}
            </button>
          )}
        </div>
        <p className="ca-demo-note" role="status">
          {feedback}
        </p>
      </section>

      <section className="ca-hometime-giro" aria-labelledby="giro-title">
        <div className="ca-hometime-giro-head">
          <h2 id="giro-title">{th("giroTitle")}</h2>
          <Link href={`/il-tuo-tempo?${query}`} className="ca-heading-action">
            {th("openFull")} <IconArrowRight size={18} />
          </Link>
        </div>
        {plan.slugs.length === 0 ? (
          <p className="ca-drawer-empty">{t("empty")}</p>
        ) : (
          plan.days.map((day, d) => (
            <div key={`${option}-${d}`} className="ca-hometime-day">
              {plan.days.length > 1 && <h3 className="ca-hometime-day-title">{t("day", { n: d + 1 })}</h3>}
              <ol className="ca-hometime-line">
                {day.items.map((item, i) => {
                  if (item.type === "transfer")
                    return (
                      <li key={i} className="ca-hometime-walk">
                        <IconWalk size={16} /> {th("walk", { min: item.minutes })}
                      </li>
                    );
                  if (item.type === "break") {
                    const lunch = item.start >= 11 * 60 + 30 && item.start <= 14 * 60 + 30;
                    return (
                      <li key={i} className="ca-hometime-break">
                        {formatClock(item.start)} · {t(lunch ? "lunch" : "pause")}
                      </li>
                    );
                  }
                  const it = byslug.get(item.slug);
                  const stops = item.stops.filter((s) => s.placeSlug).map((s) => s.title);
                  return (
                    <li key={i} className="ca-hometime-card" style={{ "--theme": item.color } as React.CSSProperties}>
                      <span className="ca-hometime-n" aria-hidden="true">
                        {plan.slugs.indexOf(item.slug) + 1}
                      </span>
                      <div>
                        <p className="ca-hometime-time">
                          {formatClock(item.start)}–{formatClock(item.end)}
                        </p>
                        <h3>
                          <Link href={`/itinerari/${item.slug}`}>{item.title}</Link>
                        </h3>
                        <p className="ca-hometime-stops">
                          {stops.join(" · ")}
                          {it?.lengthM ? ` — ${formatKm(it.lengthM, locale)}` : ""}
                        </p>
                      </div>
                      {it?.cover && <img src={it.cover.url} alt="" width={112} height={84} loading="lazy" />}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
