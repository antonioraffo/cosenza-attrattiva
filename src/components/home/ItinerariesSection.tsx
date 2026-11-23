import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { formatKm } from "@/lib/format";
import { listItineraries } from "@/server/queries";
import { formatDuration } from "@/components/itinerary/ItineraryStats";
import { ItineraryCarousel } from "./ItineraryCarousel";
import { Typewriter } from "./Typewriter";

/**
 * Itinerari nello stile di vivicosenza (card fotografiche in un carosello orizzontale),
 * alimentati dai 7 itinerari del database, con filtro per tema.
 */
export async function ItinerariesSection({ locale }: { locale: string }) {
  const t = await getTranslations("homeItineraries");
  const tt = await getTranslations("themes");
  const ti = await getTranslations("itinerary");
  const all = await listItineraries();

  const cards = await Promise.all(
    all.map(async (it, i) => ({
      slug: it.slug,
      theme: it.theme,
      node: (
        <article className="ca-itinerary-card" data-itinerary-card>
          {it.cover && (
            <Image
              src={it.cover.url}
              alt=""
              fill
              sizes="(min-width: 961px) 35vw, (min-width: 641px) 46vw, 90vw"
              loading={i < 2 ? "eager" : "lazy"}
            />
          )}
          <div className="ca-itinerary-copy">
            <p className="ca-itinerary-meta">
              <span className="ca-itinerary-theme" style={{ "--theme": it.color } as React.CSSProperties}>
                {tt(it.theme)}
              </span>
              <span>{ti("stops", { count: it.stops })}</span>
            </p>
            <h3>
              <Link href={`/itinerari/${it.slug}`} className="ca-card-link" draggable={false}>
                {tr(it.title, locale)}
              </Link>
            </h3>
            <p className="ca-itinerary-summary">{tr(it.subtitle, locale)}</p>
            <p className="ca-itinerary-stats">
              <span>{await formatDuration(it.durationMin)}</span>
              <span aria-hidden="true">·</span>
              <span>{formatKm(it.lengthM, locale)}</span>
            </p>
          </div>
        </article>
      ),
    })),
  );

  return (
    <section id="itinerari" className="ca-section ca-itineraries" aria-labelledby="itinerari-title">
      <div className="site-container ca-section-heading">
        <div>
          <h2 id="itinerari-title">
            <Typewriter text={t("title")} />
          </h2>
          <p className="ca-section-intro" data-ir="copy">
            {t("intro")}
          </p>
        </div>
      </div>
      <ItineraryCarousel
        cards={cards}
        themes={Object.fromEntries([...new Set(all.map((i) => i.theme))].map((th) => [th, tt(th)]))}
        labels={{
          label: t("label"),
          prev: t("prev"),
          next: t("next"),
          filter: t("filterLabel"),
          all: t("all"),
          empty: t("empty"),
          counts: Object.fromEntries([0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => [n, t("count", { count: n })])),
        }}
      />
    </section>
  );
}
