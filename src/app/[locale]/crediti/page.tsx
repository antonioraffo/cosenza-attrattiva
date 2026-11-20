import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { tr } from "@/lib/i18n";
import { listAllMedia } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });
  return { title: t("title") };
}

export default async function CreditsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("credits");
  const media = await listAllMedia();
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-5xl px-4 pt-10 md:px-8">
        <h1 className="text-4xl">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-neutro-600">{t("intro")}</p>
        <p className="mt-2 max-w-2xl text-neutro-600">{t("map")}</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m) => (
            <li key={m.key} className="flex gap-3 rounded-2xl bg-white p-3 shadow-[var(--shadow-card)]">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-neutro-200">
                <Image src={m.url} alt={tr(m.alt, locale)} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 text-sm">
                <p className="line-clamp-2 text-neutro-800">{m.credit}</p>
                <p className="text-xs text-neutro-500">{m.license}</p>
                {m.sourceUrl && (
                  <a href={m.sourceUrl} target="_blank" rel="noopener" className="text-xs font-semibold text-primario-700 hover:underline">
                    {t("source")} ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
