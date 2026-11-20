import { listPlacesLite } from "@/server/queries";

export const dynamic = "force-dynamic";

/** Elenco dei luoghi (contenuti pubblici) per AR e mappe. Nessun parametro di posizione. */
export async function GET() {
  const places = await listPlacesLite();
  return Response.json(
    places.map((p) => ({ slug: p.slug, name: p.name, category: p.category, position: p.geom, ar: p.ar, image: p.image?.url ?? null })),
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
