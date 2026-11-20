import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import type { ItinerarySummary } from "@/server/queries";
import { SmartImage } from "@/components/ui/SmartImage";
import { ItineraryStats } from "./ItineraryStats";

export async function ItineraryCard({
  it,
  locale,
  size = "md",
  priority = false,
}: {
  it: ItinerarySummary;
  locale: string;
  size?: "md" | "lg";
  priority?: boolean;
}) {
  const tt = await getTranslations("themes");
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]">
      <div className={`relative overflow-hidden ${size === "lg" ? "aspect-[4/5] sm:aspect-[4/3]" : "aspect-[4/3]"}`}>
        <SmartImage
          media={it.cover}
          locale={locale}
          priority={priority}
          fallbackColor={it.color}
          sizes={size === "lg" ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        <span
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
          style={{ backgroundColor: it.color }}
        >
          {tt(it.theme)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className={size === "lg" ? "text-2xl" : "text-xl"}>
            <Link href={`/itinerari/${it.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
              {tr(it.title, locale)}
            </Link>
          </h3>
          <p className="mt-1.5 text-[15px] leading-snug text-pietra-600">{tr(it.subtitle, locale)}</p>
        </div>
        <div className="mt-auto">
          <ItineraryStats
            durationMin={it.durationMin}
            lengthM={it.lengthM}
            difficulty={it.difficulty}
            stops={it.stops}
            locale={locale}
          />
        </div>
      </div>
      {/* l'outline di focus del link copre l'intera card */}
      <span className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] ring-oro-500 ring-offset-2 group-has-[:focus-visible]:ring-3" />
    </article>
  );
}
