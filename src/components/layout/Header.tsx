import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { features } from "@/lib/env";
import { IconStamp } from "@/components/ui/icons";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";

/** Header. `overlay` = trasparente sopra un'immagine hero. */
export async function Header({ overlay = false }: { overlay?: boolean }) {
  const t = await getTranslations("nav");
  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/50 to-transparent"
          : "sticky top-0 z-30 border-b border-pietra-200/70 bg-pietra-50/85 backdrop-blur"
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 md:px-8">
        <Link href="/" className="rounded-lg" aria-label={`Vivi Cosenza Attrattiva – ${t("home")}`}>
          <Logo light={overlay} />
        </Link>
        <nav aria-label={t("menu")} className="flex items-center gap-1">
          <Link
            href="/#itinerari"
            className={`hidden min-h-11 items-center rounded-full px-3 text-sm font-medium sm:inline-flex ${
              overlay ? "text-white hover:bg-white/15" : "text-pietra-700 hover:bg-pietra-100"
            }`}
          >
            {t("itineraries")}
          </Link>
          {features.assistant && (
            <Link
              href="/chiedi"
              className={`hidden min-h-11 items-center rounded-full px-3 text-sm font-medium md:inline-flex ${
                overlay ? "text-white hover:bg-white/15" : "text-pietra-700 hover:bg-pietra-100"
              }`}
            >
              {t("ask")}
            </Link>
          )}
          <Link
            href="/passaporto"
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium ${
              overlay ? "text-white hover:bg-white/15" : "text-pietra-700 hover:bg-pietra-100"
            }`}
          >
            <IconStamp size={18} />
            <span>{t("passport")}</span>
          </Link>
          <LocaleSwitcher light={overlay} />
        </nav>
      </div>
    </header>
  );
}
