import { readdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { getItinerary, getPlace } from "@/server/queries";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const Params = z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/) });

async function mapAssets(): Promise<string[]> {
  const root = path.join(process.cwd(), "public/map");
  const out = ["/map/cosenza.pmtiles"];
  for (const sub of ["fonts", "sprites"]) {
    const walk = async (dir: string): Promise<void> => {
      for (const e of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) await walk(full);
        else out.push("/" + path.relative(path.join(process.cwd(), "public"), full).split(path.sep).map(encodeURIComponent).join("/"));
      }
    };
    await walk(path.join(root, sub)).catch(() => {});
  }
  return out;
}

/** Elenco delle risorse da mettere in cache per usare l'itinerario offline. */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const parsed = Params.safeParse(await ctx.params);
  if (!parsed.success) return Response.json({ error: "slug non valido" }, { status: 400 });
  const it = await getItinerary(parsed.data.slug);
  if (!it) return Response.json({ error: "non trovato" }, { status: 404 });

  const placeSlugs = [...new Set(it.chapters.map((c) => c.placeSlug).filter((s): s is string => Boolean(s)))];
  const places = (await Promise.all(placeSlugs.map((s) => getPlace(s)))).filter((p) => p !== null);

  const pages = routing.locales.flatMap((l) => [
    `/${l}`,
    `/${l}/itinerari/${it.slug}`,
    `/${l}/itinerari/${it.slug}/racconto`,
    `/${l}/itinerari/${it.slug}/passeggiata`,
    `/${l}/passaporto`,
    ...placeSlugs.map((s) => `/${l}/luoghi/${s}`),
  ]);
  const images = [
    it.cover?.url,
    ...places.flatMap((p) => [...p.gallery.map((g) => g.url), p.historic?.url]),
  ].filter((u): u is string => Boolean(u));

  return Response.json({
    slug: it.slug,
    assets: [...pages, ...images, ...(await mapAssets())],
  });
}
