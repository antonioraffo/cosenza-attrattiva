import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosenzaattrattiva.test";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Cosenza Attrattiva", template: "%s · Cosenza Attrattiva" },
  description: "Itinerari narrativi per scoprire Cosenza.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7a1f2b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
