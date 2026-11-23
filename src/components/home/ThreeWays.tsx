import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { placesBySlugs } from "@/server/queries";
import { IconArrowRight, IconBook, IconStamp, IconWalk } from "@/components/ui/icons";
import { Typewriter } from "./Typewriter";

/**
 * "Tre modi di vivere un itinerario" nel foglio bianco che entra inclinato sopra l'ultimo pannello
 * (al posto di "Crea il tuo itinerario" di vivicosenza). Ogni modo porta alla funzione reale.
 */
export async function ThreeWays({ locale }: { locale: string }) {
  const t = await getTranslations("threeWays");
  const photos = await placesBySlugs(["duomo", "mab-ettore-e-andromaca", "castello-svevo"]);
  const steps = [
    { key: "story", icon: IconBook, href: "/itinerari/il-re-nel-fiume/racconto" },
    { key: "walk", icon: IconWalk, href: "/itinerari/fede-di-pietra/passeggiata" },
    { key: "passport", icon: IconStamp, href: "/passaporto" },
  ] as const;

  return (
    <section id="esplora" className="ca-explore" aria-labelledby="esplora-title" data-explore-stage>
      <div className="ca-explore-sheet" data-explore-sheet>
        <div className="ca-explore-inner">
          <div className="ca-explore-heading" data-explore-row>
            <h2 id="esplora-title">
              <Typewriter text={t("title")} />
            </h2>
            <p className="ca-explore-intro">{t("intro")}</p>
          </div>
          <div className="ca-explore-composition">
            <div className="ca-explore-copy">
              <p className="ca-explore-lead" data-explore-row>
                {t("lead1")} <span>{t("lead2")}</span>
              </p>
              <ol className="ca-explore-steps">
                {steps.map(({ key, icon: Icon, href }) => (
                  <li key={key} data-explore-row>
                    <span className="ca-explore-step-icon">
                      <Icon size={23} />
                    </span>
                    <div>
                      <h3>{t(`${key}.title`)}</h3>
                      <p>{t(`${key}.text`)}</p>
                      <Link href={href} className="ca-explore-step-link">
                        {t(`${key}.cta`)} <IconArrowRight size={16} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="ca-explore-board" data-explore-row aria-hidden="true">
              <svg className="ca-explore-trail" viewBox="0 0 600 540" fill="none" preserveAspectRatio="none">
                <path
                  d="M70 120 C 190 40, 330 70, 360 160 S 520 230, 500 330 S 300 460, 200 420 S 80 470, 120 500"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="2 10"
                  strokeLinecap="round"
                />
              </svg>
              <p className="ca-explore-board-note">{t("boardNote")}</p>
              {photos.map((p, i) => (
                <figure key={p.slug} className={`ca-explore-photo ca-explore-photo--${i + 1}`}>
                  {p.image && (
                    <Image src={p.image.url} alt="" width={420} height={284} sizes="(min-width: 960px) 22vw, 45vw" loading="lazy" />
                  )}
                  <figcaption>{tr(p.name, locale).split(" – ")[0]}</figcaption>
                </figure>
              ))}
              <p className="ca-explore-destination">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <span>
                  {t("destination")}
                  <br />
                  <strong>Castello Svevo</strong>
                </span>
              </p>
            </div>
          </div>
          <div className="ca-explore-start" data-explore-row>
            <p>
              <strong>{t("startTitle")}</strong>
              {t("startText")}
            </p>
            <Link href="/itinerari/il-re-nel-fiume/racconto" className="ca-explore-start-link">
              {t("startCta")}
              <IconArrowRight size={22} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
