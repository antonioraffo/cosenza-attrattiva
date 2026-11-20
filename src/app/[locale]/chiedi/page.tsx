import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { features } from "@/lib/env";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AskForm } from "@/components/assistant/AskForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assistant" });
  return { title: t("title") };
}

export default async function AskPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!features.assistant) notFound();
  const t = await getTranslations("assistant");
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-2xl px-4 pt-10 md:px-8">
        <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
        <p className="mt-3 text-neutro-600">{t("intro")}</p>
        <AskForm />
        <p className="mt-10 rounded-2xl bg-neutro-100 p-4 text-sm text-neutro-600">{t("stubNote")}</p>
      </main>
      <Footer />
    </>
  );
}
