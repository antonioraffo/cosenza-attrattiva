import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { publicEnv } from "@/lib/env";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { OfflineIndicator } from "@/components/layout/OfflineIndicator";
import { PwaProvider } from "@/components/pwa/PwaProvider";
import "../globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz", "SOFT"], display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Contenuti letti dal database a ogni richiesta (nessun prerender in fase di build)
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(publicEnv.siteUrl),
    title: { default: t("title"), template: `%s · ${t("brand")}` },
    description: t("description"),
    applicationName: "Cosenza Attrattiva",
    appleWebApp: { capable: true, title: "Cosenza", statusBarStyle: "black-translucent" },
    alternates: { languages: { it: "/it", en: "/en" } },
    openGraph: { type: "website", siteName: t("brand"), locale: locale === "it" ? "it_IT" : "en_GB" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6e1b33",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <PwaProvider>
            <AudioProvider>
              <OfflineIndicator />
              {children}
              <AudioPlayer />
              <ConsentBanner />
            </AudioProvider>
          </PwaProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
