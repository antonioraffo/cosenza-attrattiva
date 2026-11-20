import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <>
      <Header />
      <main id="main" className="mx-auto grid min-h-[70dvh] max-w-xl place-items-center px-6 text-center">
        <div>
          <p className="eyebrow text-magliocco-600">404</p>
          <h1 className="mt-3 text-4xl">{t("notFound")}</h1>
          <p className="mt-4 text-pietra-600">{t("notFoundText")}</p>
          <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-magliocco-700 px-6 font-semibold text-white">
            {t("goHome")}
          </Link>
        </div>
      </main>
    </>
  );
}
