import type { MetadataRoute } from "next";
import { features } from "@/lib/env";

export default function manifest(): MetadataRoute.Manifest {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosenzaattrattiva.test";
  return {
    id: `${site}/`,
    name: "Cosenza attrattiva – Itinerari narrativi",
    short_name: "Cosenza",
    description: "Itinerari narrativi per scoprire Cosenza: racconti, mappe e passeggiate geolocalizzate.",
    start_url: "/it",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f3ef",
    theme_color: "#128771",
    lang: "it",
    categories: ["travel", "education"],
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512?maskable=1", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      ...(features.passport
        ? [{ name: "Passaporto", url: "/it/passaporto" }]
        : [
            { name: "Esplora", url: "/it/esplora" },
            { name: "Il mio itinerario", url: "/it/mio-itinerario" },
          ]),
      { name: "Itinerari", url: "/it#itinerari" },
    ],
  };
}
