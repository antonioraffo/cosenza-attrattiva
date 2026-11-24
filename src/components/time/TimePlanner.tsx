"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { formatKm } from "@/lib/format";
import {
  buildPlan,
  fittingItineraries,
  formatClock,
  START_HOURS,
  TIME_OPTIONS,
  type PlanItineraryInput,
  type PlanLinks,
  type TimeOption,
} from "@/lib/plan";
import { myItinerary, setSaved } from "@/lib/stores/my-itinerary";
import { useOrigin } from "@/components/mine/useOrigin";
import { whatsappHref } from "@/components/mine/MyItineraryButton";
import { IconBook, IconWalk } from "@/components/ui/icons";
import { TimeMap } from "./TimeMap";

export interface TimeItinerary extends PlanItineraryInput {
  subtitle: string;
  durationLabel: string;
  route: [number, number][] | null;
  cover?: { url: string } | null;
}

/**
 * Selettore «Quanto tempo hai?» e linea del tempo del giro. Il giro si ricalcola nel browser
 * (funzione pura `buildPlan`) e l'indirizzo resta condivisibile: /il-tuo-tempo?t=1g&ora=10.
 */
export function TimePlanner({
  itineraries,
  links,
  initialOption,
  initialStart,
  canSave,
}: {
  itineraries: TimeItinerary[];
  links: PlanLinks;
  initialOption: TimeOption;
  initialStart: number;
  canSave: boolean;
}) {
  const t = useTranslations("time");
  const origin = useOrigin();
  const locale = useLocale();
  const [option, setOption] = useState<TimeOption>(initialOption);
  const [start, setStart] = useState(initialStart);
  const [feedback, setFeedback] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const plan = useMemo(() => buildPlan(itineraries, links, option, start), [itineraries, links, option, start]);
  const others = fittingItineraries(itineraries, option, plan);
  const byslug = useMemo(() => new Map(itineraries.map((i) => [i.slug, i])), [itineraries]);

  const query = `t=${option}&ora=${start}`;
  useEffect(() => {
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${query}`);
  }, [query]);

  const km = formatKm(plan.walkM, locale);
  const first = plan.days[0];
  const summary =
    option === "weekend"
      ? t("summaryWeekend", { count: plan.slugs.length, km })
      : t("summary", { count: plan.slugs.length, km, from: formatClock(start * 60), to: formatClock(first?.end ?? start * 60) });

  const shareUrl = `${origin}/${locale}/il-tuo-tempo?${query}`;
  const shareText = t("shareText", { option: t(`options.${option}`), list: plan.slugs.map((s) => byslug.get(s)?.title).join(", ") });

  const save = () => {
    const before = myItinerary.get().places;
    const added = plan.places.filter((p) => !before.includes(p));
    setSaved([...before, ...added]);
    setFeedback(t("savedFeedback", { count: added.length }));
  };

  return (
    <>
      <div className="ca-time-controls">
        <div className="ca-time-options" role="group" aria-label={t("optionsLabel")}>
          {TIME_OPTIONS.map((o) => (
            <button key={o} type="button" className="ca-time-option" aria-pressed={option === o} onClick={() => {
                setOption(o);
                setFeedback("");
              }}>
              <strong>{t(`options.${o}`)}</strong>
              <span>{t(`optionHint.${o}`)}</span>
            </button>
          ))}
        </div>
        <label className="ca-time-start">
          <span>{t("start")}</span>
          <select value={start} onChange={(e) => {
              setStart(Number(e.target.value));
              setFeedback("");
            }}>
            {START_HOURS.map((h) => (
              <option key={h} value={h}>
                {formatClock(h * 60)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {plan.slugs.length === 0 ? (
        <p className="ca-drawer-empty">{t("empty")}</p>
      ) : (
        <>
          <p className="ca-time-summary" aria-live="polite">
            {summary}
          </p>
          <div className="ca-mine-actions">
            <a href={whatsappHref(shareText, shareUrl)} target="_blank" rel="noopener noreferrer" className="ca-mine-btn ca-drawer-whatsapp">
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

          <div className="ca-time-layout">
            <TimeMap plan={plan} itineraries={byslug} active={active} label={t("map")} />
            <div className="ca-time-days">
          {plan.days.map((day, d) => (
            <section key={d} className="ca-time-day" aria-labelledby={`giorno-${d}`}>
              <h2 id={`giorno-${d}`} className="ca-time-day-title">
                {plan.days.length > 1 ? t("day", { n: d + 1 }) : t("single")}
                <span>{t("dayRange", { from: formatClock(day.items[0]!.start), to: formatClock(day.end) })}</span>
              </h2>
              <ol className="ca-tl">
                {day.items.map((item, i) => {
                  if (item.type === "transfer")
                    return (
                      <li key={i} className="ca-tl-item ca-tl-item--transfer">
                        <time className="ca-tl-time">{formatClock(item.start)}</time>
                        <p>
                          <IconWalk size={16} /> {t("transfer", { to: byslug.get(item.to)?.title ?? item.to, min: item.minutes, m: item.distanceM.toLocaleString(locale === "it" ? "it-IT" : "en-GB") })}
                        </p>
                      </li>
                    );
                  if (item.type === "break") {
                    const lunch = item.start >= 11 * 60 + 30 && item.start <= 14 * 60 + 30;
                    return (
                      <li key={i} className="ca-tl-item ca-tl-item--break">
                        <time className="ca-tl-time">{formatClock(item.start)}</time>
                        <p>
                          {t(lunch ? "lunch" : "pause")} · {t("pauseLength")}
                        </p>
                      </li>
                    );
                  }
                  const it = byslug.get(item.slug)!;
                  return (
                    <li
                      key={i}
                      className="ca-tl-item ca-tl-item--itinerary"
                      style={{ "--theme": item.color } as React.CSSProperties}
                      onMouseEnter={() => setActive(item.slug)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(item.slug)}
                      onBlur={() => setActive(null)}
                    >
                      <time className="ca-tl-time">{formatClock(item.start)}</time>
                      <div className="ca-tl-body">
                        <h3>
                          <span className="ca-tl-n" aria-hidden="true">
                            {plan.slugs.indexOf(item.slug) + 1}
                          </span>
                          <Link href={`/itinerari/${item.slug}`}>{item.title}</Link>
                        </h3>
                        <p className="ca-tl-meta">
                          {formatClock(item.start)}–{formatClock(item.end)} · {it.durationLabel}
                          {item.lengthM ? ` · ${formatKm(item.lengthM, locale)}` : ""}
                          {item.kind === "misto" ? ` · ${t("kindMisto")}` : ""}
                        </p>
                        <ol className="ca-tl-stops">
                          {item.stops.map((s, j) => (
                            <li key={j}>
                              <time>{formatClock(s.time)}</time>
                              <span>
                                {s.placeSlug ? <Link href={`/luoghi/${s.placeSlug}`}>{s.title}</Link> : s.title}
                                {s.fraction === null && !s.title.toLowerCase().startsWith(t("reading")) && <em> · {t("reading")}</em>}
                                {s.walkMin > 0 && <small> · {t("walkFrom", { min: s.walkMin })}</small>}
                              </span>
                            </li>
                          ))}
                        </ol>
                        <p className="ca-tl-links">
                          <Link href={`/itinerari/${item.slug}/racconto`}>
                            <IconBook size={16} /> {t("openStory")}
                          </Link>
                          <Link href={`/itinerari/${item.slug}/passeggiata`}>
                            <IconWalk size={16} /> {t("openWalk")}
                          </Link>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
            </div>
          </div>
        </>
      )}

      <section className="ca-time-others" aria-labelledby="altri-itinerari">
        <h2 id="altri-itinerari" className="ca-time-day-title">
          {t("others")}
        </h2>
        {others.length ? (
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/itinerari/${o.slug}`}>{o.title}</Link>
                <span>
                  {o.durationLabel}
                  {o.lengthM ? ` · ${formatKm(o.lengthM, locale)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="ca-demo-note">{t("othersEmpty")}</p>
        )}
      </section>
      <p className="ca-demo-note">{t("note")}</p>
    </>
  );
}
