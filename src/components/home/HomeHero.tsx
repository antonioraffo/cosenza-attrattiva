import Image from "next/image";
import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { tr } from "@/lib/i18n";
import { placesBySlugs } from "@/server/queries";
import { HeroRoot } from "./HeroRoot";
import { SilhouetteIntro, type SceneText } from "./SilhouetteIntro";
import { Typewriter } from "./Typewriter";

/** Luoghi dei tre pannelli, con il colore della linguetta (token del marchio, testo AA). */
const PANELS = [
  { slug: "mab-ettore-e-andromaca", key: "mab", color: "#0f7663", ink: "#fff" },
  { slug: "duomo", key: "duomo", color: "#9c37b5", ink: "#fff" },
  { slug: "san-domenico", key: "sanDomenico", color: "#a3570c", ink: "#fff" },
] as const;

const arrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
);
const chevron = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m7 10 5 5 5-5" />
  </svg>
);

/**
 * Hero della home sul modello di vivicosenza: intro "silhouette" (Duomo / Ponte Calatrava) e,
 * dopo la mission, i pannelli sticky MAB, Duomo e San Domenico collegati alle schede luogo.
 */
export async function HomeIntro({ title }: { title: string }) {
  // il claim è anche l'h1 della pagina (visivamente nascosto): sotto il logo è decorativo
  const t = await getTranslations("homeHero");
  const scene = (k: "duomo" | "ponte", href: string): SceneText => ({
    label: t(`${k}.label`),
    title: t(`${k}.title`),
    description: t(`${k}.description`),
    href,
    facts: [0, 1, 2].map((i) => ({ title: t(`${k}.facts.${i}.title`), text: t(`${k}.facts.${i}.text`) })),
  });

  return (
    <div className="ca-hero ca-hero--intro">
      <h1 className="sr-only">{title}</h1>
      <SilhouetteIntro
        scenes={{ duomo: scene("duomo", "/luoghi/duomo"), ponte: scene("ponte", "/luoghi/ponte-calatrava") }}
        labels={{
          nav: t("sceneNav"),
          duomo: t("sceneDuomo"),
          ponte: t("scenePonte"),
          discover: t("discover"),
          claim: title,
          curiosities: t("curiositiesLabel", { title: t("duomo.title") }),
          announce: { duomo: t("sceneAnnounce", { title: t("duomo.title") }), ponte: t("sceneAnnounce", { title: t("ponte.title") }) },
        }}
      />
    </div>
  );
}

/** Pannelli sticky MAB / Duomo / San Domenico. */
export async function HomePanels({ locale }: { locale: string }) {
  const t = await getTranslations("homeHero");
  const places = await placesBySlugs(PANELS.map((p) => p.slug));
  const panels = PANELS.map((p) => {
    const place = places.find((pl) => pl.slug === p.slug);
    const name = place ? tr(place.name, locale).split(" – ")[0]! : p.slug;
    return p.key === "mab"
      ? { ...p, href: `/luoghi/${p.slug}`, title: t("mab.title"), short: t("mab.short"), kicker: t("mab.kicker"), description: t("mab.description"), image: place?.image }
      : { ...p, href: `/luoghi/${p.slug}`, title: name, short: name, kicker: t("faithKicker"), description: place ? tr(place.summary, locale) : "", image: place?.image };
  });

  return (
    <HeroRoot label={t("heroLabel")} titles={panels.map((p) => p.title)}>
      {panels.map((p, i) => {
        const id = `hero-title-${i}`;
        return (
          <Fragment key={p.slug}>
            <article
              className="cs-scroll-panel"
              data-hero-panel={i}
              style={{ "--panel-index": i, "--panel-background": p.color, "--panel-tab-ink": p.ink } as React.CSSProperties}
              aria-labelledby={id}
            >
              <button className="cs-scroll-tab" type="button" data-hero-jump={i} aria-expanded="true" aria-controls={`hero-body-${i}`} aria-label={t("show", { title: p.title })}>
                <span className="cs-scroll-tab-title">{p.short}</span>
                {chevron}
              </button>
              <div className="cs-scroll-panel-body" id={`hero-body-${i}`}>
                <div className="cs-scroll-copy">
                  <p className="cs-scroll-eyebrow">{p.kicker}</p>
                  <h2 id={id}>
                    <Typewriter text={p.title} />
                  </h2>
                  <p className="cs-scroll-description">
                    <Typewriter text={p.description} />
                  </p>
                  <Link className="cs-scroll-action" href={p.href}>
                    <span>{t("discover")}</span>
                    {arrow}
                  </Link>
                </div>
                <figure className="cs-scroll-photo">
                  {p.image && (
                    <Image src={p.image.url} alt={tr(p.image.alt, locale)} fill sizes="100vw" loading={i ? "lazy" : "eager"} />
                  )}
                </figure>
              </div>
            </article>
            <div className="cs-scroll-runway" data-hero-runway={i} aria-hidden="true" />
          </Fragment>
        );
      })}
      <p className="cs-scroll-status" data-hero-status role="status" aria-live="polite" aria-atomic="true" />
    </HeroRoot>
  );
}
