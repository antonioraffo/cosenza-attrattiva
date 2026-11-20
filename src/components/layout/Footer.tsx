import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { ConsentManageButton } from "./ConsentBanner";

export async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="mt-24 bg-pietra-900 text-pietra-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.5fr_1fr] md:px-8">
        <div>
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-pietra-300">{t("project")}</p>
        </div>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href="/crediti" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              {t("credits")}
            </Link>
          </li>
          <li>
            <ConsentManageButton />
          </li>
        </ul>
      </div>
      <p className="border-t border-pietra-800 px-4 py-5 text-center text-xs text-pietra-400">{t("mapData")}</p>
    </footer>
  );
}
