"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { bbox, type LngLat } from "@/lib/geo";
import { features } from "@/lib/env";
import { ListenButton } from "@/components/audio/ListenButton";
import { addItineraryLayers, reducedMotion, setItineraryProgress } from "@/components/map/itineraryLayers";
import { useMapLibre } from "@/components/map/useMapLibre";
import { ImmersiveLauncher } from "@/features/ImmersiveLauncher";
import { IconArrowLeft, IconArrowRight, IconWalk } from "@/components/ui/icons";

export interface StoryChapter {
  id: number;
  title: string;
  html: string;
  plain: string;
  audioSrc: string | null;
  placeSlug: string | null;
  placeName: string | null;
  image: { url: string; alt: string; credit: string } | null;
  position: LngLat;
  camera: { zoom: number; bearing: number; pitch: number };
  routeFraction: number;
  hasStreetview: boolean;
  hasAr: boolean;
}

/**
 * Modalità Racconto: mappa (metà superiore su mobile, split screen su desktop) e capitoli
 * che, entrando nella fascia di lettura, fanno "volare" la camera sulla tappa.
 */
export function StoryView(props: {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  color: string;
  route: LngLat[];
  cover: { url: string; alt: string } | null;
  chapters: StoryChapter[];
}) {
  const { slug, title, subtitle, intro, color, route, cover, chapters } = props;
  const t = useTranslations("story");
  const ti = useTranslations("itinerary");
  const locale = useLocale() as "it" | "en";
  const reduce = useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapLibre(mapRef, locale, { pitch: 0, dragRotate: true });
  const [active, setActive] = useState(-1);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const introRef = useRef<HTMLElement | null>(null);

  const stops = useMemo(
    () =>
      chapters.map((c, i) => ({ id: c.id, position: c.position, label: String(i + 1), name: c.placeName ?? c.title })),
    [chapters],
  );

  const overview = useCallback(
    (animate: boolean) => {
      if (!map) return;
      const [minX, minY, maxX, maxY] = bbox([...route, ...stops.map((s) => s.position)]);
      const mobile = window.innerWidth < 1024;
      map.fitBounds([[minX, minY], [maxX, maxY]], {
        padding: mobile ? 36 : 80,
        pitch: 0,
        bearing: 0,
        duration: animate && !reducedMotion() ? 1800 : 0,
      });
    },
    [map, route, stops],
  );

  // layer del percorso
  useEffect(() => {
    if (!map) return;
    addItineraryLayers(map, route, stops, color);
    setItineraryProgress(map, route, 0, stops, -1);
    overview(false);
    map.on("click", "stops", (e) => {
      const id = e.features?.[0]?.id;
      const i = stops.findIndex((s) => s.id === id);
      sections.current[i]?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    });
    map.on("mouseenter", "stops", () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", "stops", () => (map.getCanvas().style.cursor = ""));
  }, [map, route, stops, color, overview]);

  // capitolo attivo → camera e progresso
  useEffect(() => {
    if (!map) return;
    if (active < 0) {
      setItineraryProgress(map, route, 0, stops, -1);
      overview(true);
      return;
    }
    const c = chapters[active]!;
    setItineraryProgress(map, route, c.routeFraction, stops, active);
    const camera = { center: c.position, zoom: c.camera.zoom, bearing: c.camera.bearing, pitch: c.camera.pitch };
    // su mobile la mappa è bassa: niente offset; su desktop centrata nella colonna mappa
    if (reducedMotion()) map.jumpTo(camera);
    else map.flyTo({ ...camera, duration: 2600, curve: 1.6, speed: 0.8, essential: false });
  }, [active, map, chapters, route, stops, overview]);

  // fascia di lettura: il capitolo che attraversa il ~55% dell'altezza della finestra
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          setActive(i);
        }
      },
      { rootMargin: "-55% 0px -44% 0px" },
    );
    sections.current.forEach((el) => el && io.observe(el));
    if (introRef.current) io.observe(introRef.current);
    return () => io.disconnect();
  }, [chapters.length]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="lg:grid lg:grid-cols-[minmax(420px,44%)_1fr]">
      {/* ── Barra superiore ─────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-40 lg:right-auto lg:w-[max(420px,44%)]">
        <motion.div className="h-1 origin-left" style={{ scaleX: progress, backgroundColor: color }} />
        <div className="flex h-14 items-center gap-2 bg-pietra-50/90 px-2 backdrop-blur lg:px-4">
          <Link
            href={`/itinerari/${slug}`}
            className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-pietra-200"
            aria-label={ti("backToItinerary")}
          >
            <IconArrowLeft />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-[17px] leading-tight">{title}</p>
            <p className="text-xs text-pietra-500" aria-live="polite">
              {active >= 0 ? t("progress", { current: active + 1, total: chapters.length }) : subtitle}
            </p>
          </div>
          {features.view3d && <ImmersiveLauncher kind="fly3d" itinerary={{ slug, title, color, stops: chapters.map((c) => ({ name: c.placeName ?? c.title, position: c.position })) }} compact />}
        </div>
      </div>

      {/* ── Mappa: sticky in alto su mobile, a destra su desktop ── */}
      <div className="sticky top-0 z-30 h-[46svh] bg-pietra-50 pt-[60px] shadow-[0_8px_24px_-12px_rgba(0,0,0,.35)] lg:order-2 lg:h-dvh lg:pt-0 lg:shadow-none">
        <div ref={mapRef} className="size-full bg-pietra-100" role="region" aria-label={t("mapLabel", { title })} />
      </div>

      {/* ── Testo ─────────────────────────────────────── */}
      <main id="main" className="relative z-10 bg-pietra-50 lg:order-1 lg:pt-14">
        <header ref={introRef} data-index={-1} className="px-5 pt-8 pb-10 lg:px-12 lg:pt-12">
          {cover && (
            <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={cover.url} alt={cover.alt} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
          <h1 className="text-4xl leading-tight font-light lg:text-5xl">{title}</h1>
          <p className="mt-4 font-serif text-xl leading-relaxed text-pietra-700">{intro}</p>
          <p className="mt-8 flex items-center gap-2 text-sm font-semibold text-pietra-500">
            <span className="inline-block h-px w-8 bg-pietra-400" /> {t("scrollHint")}
          </p>
        </header>

        {chapters.map((c, i) => (
          <section
            key={c.id}
            ref={(el) => {
              sections.current[i] = el;
            }}
            data-index={i}
            aria-labelledby={`ch-${c.id}`}
            className="scroll-mt-[50svh] border-t border-pietra-200 px-5 py-12 lg:scroll-mt-16 lg:px-12 lg:py-16"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow flex items-center gap-2" style={{ color }}>
                <span className="grid size-7 place-items-center rounded-full text-[11px] text-white" style={{ backgroundColor: color }}>
                  {i + 1}
                </span>
                {c.placeName ?? ti("transition")}
              </p>
              <h2 id={`ch-${c.id}`} className="mt-3 text-[2rem] leading-tight lg:text-4xl">
                {c.title}
              </h2>
              {c.image && (
                <figure className="mt-6">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-pietra-200">
                    <Image src={c.image.url} alt={c.image.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-1.5 text-xs text-pietra-500">{c.image.credit}</figcaption>
                </figure>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                <ListenButton id={`ch-${c.id}`} title={c.title} text={c.plain} lang={locale} src={c.audioSrc} variant="ghost" />
                {c.placeSlug && (c.hasStreetview || c.hasAr) && (
                  <ImmersiveLauncher kind="place" placeSlug={c.placeSlug} hasStreetview={c.hasStreetview} hasAr={c.hasAr} />
                )}
              </div>
              <div className="prose-story mt-6 text-pietra-800" dangerouslySetInnerHTML={{ __html: c.html }} />
              {c.placeSlug && (
                <Link
                  href={`/luoghi/${c.placeSlug}`}
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-magliocco-700 hover:underline"
                >
                  {ti("openPlace")} <IconArrowRight size={16} />
                </Link>
              )}
            </motion.div>
          </section>
        ))}

        <footer className="border-t border-pietra-200 px-5 pt-12 pb-[40svh] lg:px-12 lg:pb-24">
          <h2 className="text-3xl">{t("end")}</h2>
          <p className="mt-2 text-pietra-600">{t("endText")}</p>
          <Link
            href={`/itinerari/${slug}/passeggiata`}
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-sila-700 px-6 font-semibold text-white hover:bg-sila-600"
          >
            <IconWalk size={18} /> {ti("startWalk")}
          </Link>
        </footer>
      </main>
    </div>
  );
}
