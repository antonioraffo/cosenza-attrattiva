import { z } from "zod";
import { getPlace } from "@/server/queries";

export const dynamic = "force-dynamic";

const Params = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/) });

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const parsed = Params.safeParse(await ctx.params);
  if (!parsed.success) return Response.json({ error: "slug non valido" }, { status: 400 });
  const p = await getPlace(parsed.data.slug);
  if (!p) return Response.json({ error: "non trovato" }, { status: 404 });
  return Response.json(
    { slug: p.slug, name: p.name, position: p.geom, streetview: p.streetview, ar: p.ar, geofenceRadiusM: p.geofenceRadiusM },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
