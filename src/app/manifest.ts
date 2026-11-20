import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosenzaattrattiva.test";
  return {
    id: `${site}/`,
    name: "Cosenza Attrattiva – Itinerari narrativi",
    short_name: "Vivi Cosenza",
    description: "Itinerari narrativi per scoprire Cosenza: racconti, mappe e passeggiate geolocalizzate.",
    start_url: "/it",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f3ed",
    theme_color: "#6e1b33",
    lang: "it",
    categories: ["travel", "education"],
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512?maskable=1", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Passaporto", url: "/it/passaporto" },
      { name: "Itinerari", url: "/it#itinerari" },
    ],
  };
}
