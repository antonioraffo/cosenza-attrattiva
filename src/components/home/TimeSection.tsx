import { features } from "@/lib/env";
import { getPlanData } from "@/server/queries";
import { formatDuration } from "@/components/itinerary/ItineraryStats";
import type { TimeItinerary } from "@/components/time/TimePlanner";
import { HomeTime } from "./HomeTime";

/** «Il tuo tempo» e «Il tuo giro» in home: dati del giro (itinerari e trasferimenti) per HomeTime. */
export async function TimeSection({ locale }: { locale: string }) {
  const { itineraries, links } = await getPlanData(locale);
  const items: TimeItinerary[] = await Promise.all(
    itineraries.map(async (it) => ({ ...it, route: null, durationLabel: await formatDuration(it.durationMin) })),
  );
  // in home niente mappa del giro: i percorsi non servono al client
  return (
    <div className="ca-section ca-hometime-wrap">
      <HomeTime itineraries={items} links={links} canSave={!features.passport} />
    </div>
  );
}
