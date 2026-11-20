/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import {
  CacheFirst,
  CacheableResponsePlugin,
  NetworkFirst,
  RangeRequestsPlugin,
  Serwist,
  type PrecacheEntry,
  type RouteHandlerCallbackOptions,
  type SerwistGlobalConfig,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

/** Deve coincidere con OFFLINE_CACHE in src/lib/offline.ts */
const OFFLINE_CACHE = "offline-v1";

const pages = new NetworkFirst({ cacheName: "pages", networkTimeoutSeconds: 4 });

/** Pagine: rete prima; offline si cerca in tutte le cache (incluse quelle scaricate). */
async function pageHandler(opts: RouteHandlerCallbackOptions): Promise<Response> {
  try {
    return await pages.handle(opts);
  } catch {
    const url = new URL(opts.request.url);
    const hit = (await caches.match(url.pathname)) ?? (await caches.match(opts.request, { ignoreSearch: true }));
    return hit ?? Response.error();
  }
}

/** Immagini ottimizzate: offline si ripiega sull'originale salvato con il download. */
async function nextImageHandler({ request }: RouteHandlerCallbackOptions): Promise<Response> {
  try {
    const res = await fetch(request);
    if (res.ok) return res;
    throw new Error(String(res.status));
  } catch {
    const original = new URL(request.url).searchParams.get("url");
    const hit = (await caches.match(request)) ?? (original ? await caches.match(original) : undefined);
    return hit ?? Response.error();
  }
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // tile PMTiles: servite a intervalli (Range) dalla copia completa in cache
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.endsWith(".pmtiles"),
      handler: new CacheFirst({
        cacheName: OFFLINE_CACHE,
        plugins: [new CacheableResponsePlugin({ statuses: [200] }), new RangeRequestsPlugin()],
      }),
    },
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && (url.pathname.startsWith("/media/") || url.pathname.startsWith("/map/")),
      handler: new CacheFirst({ cacheName: OFFLINE_CACHE, plugins: [new CacheableResponsePlugin({ statuses: [200] })] }),
    },
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname === "/_next/image",
      handler: nextImageHandler,
    },
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: pageHandler,
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
