import type { NextConfig } from "next";

const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosenzaattrattiva.test").hostname;

const nextConfig: NextConfig = {
  // Build autonomo per l'immagine Docker di produzione
  output: "standalone",
  // L'app è servita da Caddy su https://cosenzaattrattiva.test: autorizza
  // l'origine del proxy per HMR e risorse dev (altrimenti Next le blocca).
  allowedDevOrigins: [siteHost, `*.${siteHost}`],
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org" }],
  },
};

export default nextConfig;
