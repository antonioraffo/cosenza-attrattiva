import { parsePlacesParam } from "@/lib/mine";
import { listPlacesLite } from "@/server/queries";
import { walkingRoute } from "@/server/routing";

export const dynamic = "force-dynamic";

/** Percorso pedonale tra i luoghi di ?p=slug1,slug2 (nell'ordine dato). Solo slug di luoghi, nessuna posizione dell'utente. */
export async function GET(req: Request) {
  const places = await listPlacesLite();
  const slugs = parsePlacesParam(new URL(req.url).searchParams.get("p") ?? undefined, new Set(places.map((p) => p.slug)));
  const route = await walkingRoute(slugs.map((s) => places.find((p) => p.slug === s)!.geom));
  return Response.json(route, { headers: { "Cache-Control": route.source === "osrm" ? "public, max-age=86400" : "no-store" } });
}
