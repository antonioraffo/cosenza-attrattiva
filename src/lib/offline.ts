/**
 * Download offline di un itinerario: pagine, immagini, tile PMTiles, font e sprite
 * finiscono nella cache "offline-v1", che il service worker consulta senza rete.
 */
export const OFFLINE_CACHE = "offline-v1";
const marker = (slug: string) => `/__offline__/${slug}`;

export async function isItineraryOffline(slug: string): Promise<boolean> {
  const cache = await caches.open(OFFLINE_CACHE);
  return Boolean(await cache.match(marker(slug)));
}

export async function downloadItinerary(slug: string, onProgress: (p: number) => void) {
  const res = await fetch(`/api/itineraries/${slug}/bundle`);
  if (!res.ok) throw new Error(`bundle ${res.status}`);
  const bundle = (await res.json()) as { assets: string[] };
  const cache = await caches.open(OFFLINE_CACHE);
  const urls = [...new Set(bundle.assets)];
  let done = 0;
  // download a lotti per non saturare la connessione mobile
  const BATCH = 6;
  for (let i = 0; i < urls.length; i += BATCH) {
    await Promise.all(
      urls.slice(i, i + BATCH).map(async (u) => {
        const r = await fetch(u, { credentials: "same-origin" });
        if (r.ok) await cache.put(u, r);
        onProgress(++done / urls.length);
      }),
    );
  }
  await cache.put(marker(slug), new Response(new Date().toISOString()));
  // chiede al browser di non sfrattare la cache quando lo spazio scarseggia
  await navigator.storage?.persist?.().catch(() => false);
}

export async function removeItinerary(slug: string) {
  const cache = await caches.open(OFFLINE_CACHE);
  await cache.delete(marker(slug));
}
