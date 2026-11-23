import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { placesBySlugs } from "@/server/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmartImage } from "@/components/ui/SmartImage";
import { IconArrowRight } from "@/components/ui/icons";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "roots" });
  return { title: t("title"), description: t("intro") };
}

const QUARTERS = ["quartiere-santa-lucia", "quartiere-massa", "quartiere-spirito-santo", "quartiere-portapiana", "quartiere-rivocati"];

/**
 * Pilastro Connect: turismo delle radici ("Ritorno a Cosenza" del prototipo e del programma Connect).
 * Nessun modulo di prenotazione; il contatto reale è da definire con il Comune.
 */
export default async function RootsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("roots");
  const quarters = await placesBySlugs(QUARTERS);
  const other = t("otherLocale") as "it" | "en";

  return (
    <>
      <Header />
      <main id="main">
        <section className="ca-section ca-section--light" aria-labelledby="roots-title">
          <div className="site-container ca-roots-hero">
            <div>
              <p className="ca-pillar-badge ca-pillar-badge--connect">{t("eyebrow")}</p>
              <h1 id="roots-title" className="ca-page-title">
                {t("title")}
              </h1>
              <p className="ca-section-intro">{t("intro")}</p>
              <p className="ca-roots-other" lang={other}>
                {t("other")}{" "}
                <Link href="/ritorno-a-cosenza" locale={other} className="font-semibold text-azzurro-700 underline underline-offset-4">
                  {t("otherCta")}
                </Link>
              </p>
            </div>
            {quarters[0]?.image && (
              <figure className="ca-roots-photo">
                <SmartImage media={quarters[0].image} locale={locale} priority sizes="(min-width: 961px) 40vw, 100vw" />
              </figure>
            )}
          </div>
        </section>

        <section className="ca-section ca-section--white" aria-labelledby="steps-title">
          <div className="site-container">
            <div className="ca-section-heading">
              <div>
                <h2 id="steps-title">{t("stepsTitle")}</h2>
                <p className="ca-section-intro">{t("stepsIntro")}</p>
              </div>
              <Link href="/itinerari/ritorno-a-cosenza" className="ca-heading-action">
                {t("itineraryCta")} <IconArrowRight size={18} />
              </Link>
            </div>
            <ol className="ca-brand-points ca-roots-steps">
              {[0, 1, 2, 3].map((i) => (
                <li key={i}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t(`steps.${i}.title`)}</h3>
                  <p>{t(`steps.${i}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ca-section ca-section--light" aria-labelledby="places-title">
          <div className="site-container">
            <div className="ca-section-heading">
              <div>
                <h2 id="places-title">{t("placesTitle")}</h2>
                <p className="ca-section-intro">{t("placesIntro")}</p>
              </div>
            </div>
            <ul className="ca-roots-places">
              {quarters.map((p) => (
                <li key={p.slug} className="relative overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
                  <div className="relative aspect-[4/3] bg-neutro-200">
                    <SmartImage media={p.image} locale={locale} sizes="(min-width: 961px) 20vw, 45vw" />
                  </div>
                  <div className="p-4">
                    <Link href={`/luoghi/${p.slug}`} className="ca-card-link font-display text-lg font-semibold">
                      {tr(p.name, locale)}
                    </Link>
                    <p className="mt-1 text-sm leading-snug text-neutro-600">{tr(p.summary, locale)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ca-section ca-section--white" aria-labelledby="contact-title">
          <div className="site-container ca-workshops">
            <div>
              <h2 id="contact-title">{t("contactTitle")}</h2>
              <p className="ca-section-intro">{t("contactText")}</p>
              <p className="ca-demo-note mt-4">{t("contactTodo")}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
