import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Pillar } from "@/components/layout/PillarIcon";
import { BlobImage } from "./BlobImage";

/** Foto dei pilastri (già nel progetto, public/media) e destinazioni delle call to action. */
const PILLARS: { id: Pillar; href: string; image: string; position: string; variant: 0 | 1 | 2 }[] = [
  { id: "vive", href: "/eventi", image: "/media/corso-mazzini-1.jpg", position: "40% 50%", variant: 0 },
  { id: "connect", href: "/itinerari", image: "/media/confluenza-crati-busento-1.jpg", position: "55% 50%", variant: 1 },
  { id: "crea", href: "/fatto-a-cosenza", image: "/media/corso-telesio-3.jpg", position: "50% 45%", variant: 2 },
];

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);

/**
 * Mission e i tre pilastri del masterplan in blocchi immagine + testo alternati (immagine a destra,
 * sinistra, destra; da mobile sopra il testo). Ogni blocco ha l'ancora del pilastro (#vive, #connect,
 * #crea) usata dal megamenu «Scopri».
 */
export async function PillarBlocks() {
  const t = await getTranslations("mission");
  const ti = await getTranslations("home.pillarImages");

  return (
    <section id="mission" className="ca-section ca-section--white ca-pillars" aria-labelledby="mission-title">
      <div className="site-container">
        <div className="ca-section-heading">
          <div>
            <p className="eyebrow ca-section-eyebrow">{t("eyebrow")}</p>
            <h2 id="mission-title">{t("title")}</h2>
            <p className="ca-section-intro">{t("text")}</p>
          </div>
        </div>
        <div className="ca-pillar-blocks">
          {PILLARS.map((p, i) => (
            <article key={p.id} id={p.id} className="ca-pillar-block" data-pillar={p.id} data-side={i % 2 ? "left" : "right"} aria-labelledby={`pillar-${p.id}`}>
              <div className="ca-pillar-block-media">
                <BlobImage src={p.image} alt={ti(p.id)} position={p.position} variant={p.variant} />
              </div>
              <div className="ca-pillar-block-copy">
                <p className="ca-pillar-block-kicker">
                  {t(`pillars.${p.id}.kicker`)} · {t(`pillars.${p.id}.tagline`)}
                </p>
                <h3 id={`pillar-${p.id}`}>{t(`pillars.${p.id}.title`)}</h3>
                <p className="ca-pillar-block-text">{t(`pillars.${p.id}.text`)}</p>
                <Link className="ca-pill-action ca-pillar-block-cta" href={p.href}>
                  <span>{t(`pillars.${p.id}.cta`)}</span>
                  {arrow}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
