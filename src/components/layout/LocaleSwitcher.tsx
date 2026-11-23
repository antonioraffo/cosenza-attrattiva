"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { IconGlobe } from "@/components/ui/icons";

export function LocaleSwitcher({ light = false }: { light?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const other = locale === "it" ? "en" : "it";

  return (
    <button
      type="button"
      lang={other}
      onClick={() =>
        // @ts-expect-error -- pathname dinamico con gli stessi parametri della pagina corrente
        router.replace({ pathname, params }, { locale: other, scroll: false })
      }
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold transition ${
        light ? "text-white hover:bg-white/15" : "text-neutro-700 hover:bg-neutro-100"
      }`}
    >
      <IconGlobe size={18} />
      <span className="sr-only">{t("language")}: </span>
      <span className="uppercase">{other}</span>
      <span className="sr-only"> ({t("switchTo")})</span>
    </button>
  );
}
