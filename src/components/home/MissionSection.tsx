/* eslint-disable @next/next/no-img-element -- loghi SVG statici */
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Pillar } from "@/components/layout/PillarIcon";
import { PillarCarousel } from "./PillarCarousel";

/**
 * Mission di Cosenza attrattiva (testi dal masterplan in materiale/) e le tre aree del piano
 * in un carosello orizzontale, con lo stile dei pannelli MAB/Duomo/San Domenico.
 * Colori di fondo con testo bianco ≥ 4,5:1 (docs/DESIGN-TOKENS.md).
 */
const PILLARS: { id: Pillar; bg: string; accent: string; href: string }[] = [
  { id: "vive", bg: "#9c37b5", accent: "#7a2a8e", href: "/eventi" },
  { id: "connect", bg: "#137396", accent: "#0f7663", href: "/itinerari" },
  { id: "crea", bg: "#a3570c", accent: "#5a2f06", href: "/fatto-a-cosenza" },
];

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);

export async function MissionSection() {
  const t = await getTranslations("mission");
  const n = PILLARS.length;

  const slides = PILLARS.map((p) => ({
    id: p.id,
    title: t(`pillars.${p.id}.title`),
    node: (
      <article className="ca-pillar-card" style={{ "--pillar-bg": p.bg, "--pillar-accent": p.accent } as React.CSSProperties}>
        <div className="ca-pillar-copy">
          <p className="ca-pillar-eyebrow">{t(`pillars.${p.id}.kicker`)}</p>
          <h3>{t(`pillars.${p.id}.title`)}</h3>
          <p className="ca-pillar-tagline">{t(`pillars.${p.id}.tagline`)}</p>
          <p className="ca-pillar-text">{t(`pillars.${p.id}.text`)}</p>
          <Link className="ca-pill-action" href={p.href}>
            <span>{t(`pillars.${p.id}.cta`)}</span>
            {arrow}
          </Link>
        </div>
        <figure className="ca-pillar-visual">
          <img src={`/brand/pillars/${p.id}.svg`} alt="" width={860} height={900} loading="lazy" decoding="async" />
        </figure>
      </article>
    ),
  }));

  return (
    <section id="mission" className="ca-section ca-mission" aria-labelledby="mission-title">
      <div className="site-container ca-section-heading">
        <div>
          <p className="eyebrow ca-section-eyebrow">{t("eyebrow")}</p>
          <h2 id="mission-title">{t("title")}</h2>
          <p className="ca-section-intro">{t("text")}</p>
        </div>
      </div>
      <PillarCarousel
        label={t("carouselLabel")}
        slides={slides}
        labels={{
          prev: t("prev"),
          next: t("next"),
          goTo: slides.map((s) => t("goTo", { title: s.title })),
          slide: slides.map((_, i) => t("slideLabel", { n: i + 1, total: n })),
        }}
      />
    </section>
  );
}
