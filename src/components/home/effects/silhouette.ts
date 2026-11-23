/*
 * Intro "silhouette" della home: il disegno al tratto si traccia seguendo lo scroll.
 * Porting di silhouette-intro.js di vivicosenza (ANALISI.md §4a) con la stessa coreografia,
 * gli stessi intervalli e lo stesso smorzamento. Differenze volute:
 * - niente avanzamento con il movimento del mouse (sconsigliato per l'accessibilità);
 * - il markup è reso da React (SilhouetteIntro); qui si gestiscono solo misure e stili.
 */

export interface SilhouetteCuriosity {
  start: number;
  x: number;
  y: number;
  placement?: "above-point";
}

export interface SilhouetteScene {
  drawingUrl: string;
  width: number;
  height: number;
  centerX: number;
  curiosities: SilhouetteCuriosity[];
  /** il link finale scorre al primo pannello invece di cambiare pagina */
  continueToContent?: boolean;
  /** inquadratura mobile del ponte (disegno largo mostrato per intero) */
  wide?: boolean;
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

export function initializeSilhouette(intro: HTMLElement, scene: SilhouetteScene): () => void {
  const { drawingUrl, curiosities, width: artWidth, height: artHeight, centerX } = scene;
  const doc = intro.ownerDocument;
  const view = doc.defaultView!;
  const q = <T extends Element>(sel: string) => intro.querySelector<T>(sel)!;
  const stage = q<HTMLElement>("[data-silhouette-stage]");
  const runway = q<HTMLElement>("[data-silhouette-runway]");
  const art = q<HTMLElement>("[data-silhouette-art]");
  const logo = q<HTMLElement>(".cs-silhouette-logo");
  const place = q<HTMLElement>("[data-silhouette-place]");
  const placeTitle = place.querySelector<HTMLElement>("h2")!;
  const placeDescription = place.querySelector<HTMLElement>("p")!;
  const placeLink = place.querySelector<HTMLAnchorElement>("a")!;
  const facts = [...intro.querySelectorAll<HTMLElement>("[data-silhouette-fact]")];
  const markers = [...intro.querySelectorAll<HTMLElement>("[data-silhouette-marker]")];
  const navigation = q<HTMLElement>(".cs-silhouette-nav");
  const header = doc.querySelector<HTMLElement>("#site-header .site-header-inner");
  const reduce = view.matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  const listeners: (() => void)[] = [];
  let frame: number | undefined;
  let observer: ResizeObserver | undefined;
  let disposed = false;
  let needsMeasure = true;
  let geometry = { start: 0, distance: 1, sectionTop: 0, sectionHeight: 0, stageHeight: 0, headerHeight: 80 };
  let strokes: { element: SVGElement; start: number; rate: number; drawn: number; visible: boolean }[] = [];
  let ghost: SVGElement | null = null;
  let finish: SVGElement | null = null;
  let maskDefs: SVGElement | undefined;
  let maskCutout: SVGElement | undefined;
  let maskBlur: SVGElement | undefined;
  let maskedLines: SVGElement | null = null;
  let drawnProgress = 0;
  let scrollDisplayProgress = 0;
  let previousTime = 0;
  const styleValues = new WeakMap<Element, Map<string, string>>();

  const setStyle = (element: HTMLElement | SVGElement | null, property: string, value: string) => {
    if (!element) return;
    let values = styleValues.get(element);
    if (!values) styleValues.set(element, (values = new Map()));
    if (values.get(property) === value) return;
    values.set(property, value);
    element.style.setProperty(property, value);
  };
  const setAttr = (element: Element, name: string, value: string) => {
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  };
  const listen = (node: EventTarget | null, event: string, handler: EventListener, options?: AddEventListenerOptions) => {
    node?.addEventListener(event, handler, options);
    listeners.push(() => node?.removeEventListener(event, handler, options));
  };
  const headerH = () => Math.round(header?.getBoundingClientRect().height || 80);

  function layoutDesktopFacts(matrix: DOMMatrix, bounds: DOMRect, copyBounds: { left: number; right: number; top: number; bottom: number }) {
    const margin = view.innerWidth <= 1440 || view.innerHeight <= 850 ? 16 : 24;
    const gap = 15;
    const safety = 16;
    const sequential = intro.dataset.sequentialFacts === "true";
    const balanced = intro.dataset.balancedFacts === "true";
    const contentTop = copyBounds.top - bounds.top;
    const centre = new DOMPoint(centerX, 0).matrixTransform(matrix).x - bounds.left;
    const visibleBottom = Math.min(stage.clientHeight, view.innerHeight - headerH()) - margin;
    const navRect = navigation.getBoundingClientRect();
    const navBounds = { left: navRect.left - bounds.left, right: navRect.right - bounds.left, top: navRect.top - bounds.top };
    facts.forEach((fact, index) => {
      const { width, height } = fact.getBoundingClientRect();
      const marker = markers[index]!;
      const radius = marker.offsetWidth / 2;
      const central = curiosities[index]!.placement === "above-point";
      let left: number, top: number, markerX: number, markerY: number;
      if (central || sequential) {
        const point = new DOMPoint(curiosities[index]!.x, curiosities[index]!.y).matrixTransform(matrix);
        left = Math.max(
          margin,
          Math.min(stage.clientWidth - width - margin, (balanced ? stage.clientWidth / 2 : sequential ? centre : point.x - bounds.left) - width / 2),
        );
        const preferred = balanced ? margin : sequential ? 24 : point.y - bounds.top - height - gap - radius;
        top = Math.max(16, Math.min(preferred, contentTop - height - gap - radius * 2 - safety));
        markerX = left + width / 2;
        markerY = top + height + gap + radius;
      } else {
        left = index === 0 ? margin : stage.clientWidth - width - margin;
        top = balanced
          ? Math.max(margin, visibleBottom * 0.48 - height / 2)
          : Math.max(margin, parseFloat(fact.style.getPropertyValue("--fact-top")) || margin);
        const markerSide = index === 0 ? left + width + gap + radius : left - gap - radius;
        const footprintLeft = Math.min(left, markerSide - radius);
        const footprintRight = Math.max(left + width, markerSide + radius);
        if (footprintLeft < copyBounds.right - bounds.left + safety && footprintRight > copyBounds.left - bounds.left - safety) {
          top = Math.max(margin, Math.min(top, contentTop - height - safety));
        }
        if (footprintLeft < navBounds.right + safety && footprintRight > navBounds.left - safety)
          top = Math.max(margin, Math.min(top, navBounds.top - height - safety));
        top = Math.max(margin, Math.min(top, visibleBottom - height));
        markerX = markerSide;
        markerY = top + height / 2;
      }
      fact.style.setProperty("--fact-left", `${left}px`);
      fact.style.setProperty("--fact-top", `${top}px`);
      marker.style.left = `${markerX}px`;
      marker.style.top = `${markerY}px`;
    });
  }

  function measure() {
    if (!stage.clientWidth || !intro.getClientRects().length) return false;
    const headerHeight = headerH();
    intro.style.setProperty("--silhouette-header-height", `${headerHeight}px`);
    const balanced = view.innerWidth >= 1000 && (view.innerWidth <= 1440 || view.innerHeight <= 850);
    intro.dataset.balancedFacts = String(balanced);
    intro.dataset.sequentialFacts = String(view.innerWidth > 700 && view.innerWidth < 1000);
    if (view.innerWidth >= 1000) {
      const margin = balanced ? 16 : 24;
      const safety = 16;
      const gap = 15;
      const sideWidth = Math.max(...facts.slice(0, 2).map((f) => f.getBoundingClientRect().width));
      const markerWidth = markers[0]?.offsetWidth ?? 44;
      const navLeft = navigation.getBoundingClientRect().left - stage.getBoundingClientRect().left;
      const available = Math.min(
        stage.clientWidth - 2 * (margin + sideWidth + gap + markerWidth + safety),
        2 * (navLeft - safety - stage.clientWidth / 2),
      );
      intro.style.setProperty("--silhouette-copy-width", `${Math.max(320, Math.min(balanced ? 620 : 680, available))}px`);
    } else intro.style.removeProperty("--silhouette-copy-width");

    const svg = art.querySelector("svg");
    if (svg) {
      const mobileWide = !!scene.wide && view.innerWidth <= 700;
      if (view.innerWidth <= 700 && !mobileWide && !reduce.matches) {
        const cardHeight = Math.max(...facts.map((f) => f.offsetHeight));
        const cardBottom = parseFloat(view.getComputedStyle(facts[0]!).bottom) || 86;
        const copyBottom = Math.min(stage.clientHeight, view.innerHeight - headerHeight) - cardBottom - cardHeight - 75;
        const center = Math.min(stage.clientHeight * 0.48, copyBottom - place.offsetHeight / 2);
        intro.style.setProperty("--silhouette-mobile-copy-top", `${Math.max(place.offsetHeight / 2 + 16, center)}px`);
      }
      if (mobileWide && !reduce.matches) {
        const bounds = stage.getBoundingClientRect();
        const copy = place.getBoundingClientRect();
        const cardHeight = Math.max(...facts.map((f) => f.offsetHeight));
        const cardBottom = parseFloat(view.getComputedStyle(facts[0]!).bottom) || 24;
        const top = copy.bottom - bounds.top + 14;
        const bottom = Math.min(stage.clientHeight, view.innerHeight - headerHeight) - cardBottom - cardHeight - 71;
        intro.style.setProperty("--bridge-art-top", `${top}px`);
        intro.style.setProperty("--bridge-art-height", `${Math.max(72, bottom - top)}px`);
      }
      // il ponte si mostra per intero; la cattedrale mantiene l'inquadratura ravvicinata
      const width =
        view.innerWidth <= 700 && !mobileWide ? Math.min(artWidth, (artHeight * stage.clientWidth) / stage.clientHeight) : artWidth;
      const left = Math.max(0, Math.min(artWidth - width, centerX - width / 2));
      svg.setAttribute(
        "viewBox",
        mobileWide ? `0 80 ${artWidth} 920` : `${view.innerWidth <= 700 ? left.toFixed(2) : 0} 0 ${width.toFixed(2)} ${artHeight}`,
      );
      const matrix = svg.getScreenCTM();
      const bounds = stage.getBoundingClientRect();
      const copyRect = place.getBoundingClientRect();
      const copyBounds = { left: copyRect.left, right: copyRect.right, top: copyRect.top, bottom: copyRect.bottom };
      const logoTop = parseFloat(view.getComputedStyle(logo).top) || stage.clientHeight / 2;
      intro.style.setProperty("--silhouette-logo-drop", `${Math.max(0, (copyBounds.top + copyBounds.bottom) / 2 - bounds.top - logoTop)}px`);
      const logoBounds = logo.getBoundingClientRect();
      const identity = {
        left: Math.min(logoBounds.left, copyBounds.left),
        right: Math.max(logoBounds.right, copyBounds.right),
        top: Math.min(logoBounds.top, copyBounds.top),
        bottom: Math.max(logoBounds.bottom, copyBounds.bottom),
      };
      if (matrix && maskCutout && maskBlur) {
        const inverse = matrix.inverse();
        const topLeft = new DOMPoint(copyBounds.left - 18, copyBounds.top - 16).matrixTransform(inverse);
        const bottomRight = new DOMPoint(copyBounds.right + 18, copyBounds.bottom + 16).matrixTransform(inverse);
        const scale = Math.hypot(matrix.a, matrix.b) || 1;
        const attrs = { x: topLeft.x, y: topLeft.y, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y, rx: 16 / scale };
        for (const [k, v] of Object.entries(attrs)) maskCutout.setAttribute(k, String(v));
        maskBlur.setAttribute("stdDeviation", String(7 / scale));
      }
      if (matrix)
        markers.forEach((marker, index) => {
          const point = new DOMPoint(curiosities[index]!.x, curiosities[index]!.y).matrixTransform(matrix);
          const fact = facts[index]!;
          const { width, height } = fact.getBoundingClientRect();
          const x = point.x - bounds.left;
          const mobile = view.innerWidth <= 700;
          const factBottom = parseFloat(view.getComputedStyle(fact).bottom) || 24;
          const y = point.y - bounds.top;
          let left = index === 0 ? x - width - 24 : x + 24;
          const placeAbove = index === 0 && left < 16;
          if (left + width > stage.clientWidth - 20) left = x - width - 24;
          left = Math.max(16, Math.min(stage.clientWidth - width - 16, left));
          const bottom = Math.min(stage.clientHeight, view.innerHeight - headerHeight) - 20;
          let top = Math.max(16, Math.min(bottom - height, placeAbove ? y - height - 28 : y - height / 2));
          const logoGap = mobile ? 32 : 84;
          if (!mobile && index < 2) {
            const outside = index === 0 ? identity.left - bounds.left - width - logoGap : identity.right - bounds.left + logoGap;
            if (outside >= 16 && outside + width <= stage.clientWidth - 16) left = outside;
            else top = Math.max(16, identity.top - bounds.top - height - logoGap);
          }
          if (
            index !== 2 &&
            left < identity.right - bounds.left + logoGap &&
            left + width > identity.left - bounds.left - logoGap &&
            top < identity.bottom - bounds.top + logoGap &&
            top + height > identity.top - bounds.top - logoGap
          ) {
            top = Math.max(16, identity.top - bounds.top - height - logoGap);
          }
          if (!mobile && curiosities[index]!.placement === "above-point") {
            left = Math.max(16, Math.min(stage.clientWidth - width - 16, x - width / 2));
            top = Math.max(16, Math.min(bottom - height, y - height - 15 - marker.offsetHeight / 2));
          }
          fact.style.setProperty("--fact-left", `${left}px`);
          fact.style.setProperty("--fact-top", `${top}px`);
          // ogni area pulsante resta a 15 px dalla sua card
          const gap = 15;
          const radius = marker.offsetWidth / 2;
          let markerX: number, markerY: number;
          if (!mobile && curiosities[index]!.placement === "above-point") {
            markerX = left + width / 2;
            markerY = top + height + gap + radius;
          } else if (mobile) {
            const cardLeft = (stage.clientWidth - width) / 2;
            markerX = Math.max(cardLeft + radius, Math.min(cardLeft + width - radius, x));
            markerY = bounds.height - factBottom - height - gap - radius;
          } else if (index === 0 && left + width + gap + radius * 2 <= stage.clientWidth - 8) {
            markerX = left + width + gap + radius;
            markerY = top + height / 2;
          } else if (left - gap - radius * 2 >= 8) {
            markerX = left - gap - radius;
            markerY = top + height / 2;
          } else {
            markerX = left + width / 2;
            markerY = top - gap - radius;
          }
          marker.style.left = `${markerX}px`;
          marker.style.top = `${markerY}px`;
        });
      if (matrix && view.innerWidth > 700) layoutDesktopFacts(matrix, bounds, copyBounds);
    }
    const sectionTop = view.scrollY + intro.getBoundingClientRect().top;
    geometry = {
      start: Math.max(0, sectionTop - headerHeight),
      distance: Math.max(1, runway.offsetHeight),
      sectionTop,
      sectionHeight: intro.offsetHeight,
      stageHeight: stage.clientHeight,
      headerHeight,
    };
    needsMeasure = false;
    return true;
  }

  function update() {
    frame = undefined;
    if (disposed || doc.hidden || !intro.isConnected) return;
    if (needsMeasure && !measure()) return;
    const scrollProgress = clamp((view.scrollY - geometry.start) / geometry.distance);
    const targetProgress = reduce.matches ? 1 : scrollProgress;
    const now = view.performance.now();
    const delta = previousTime && now - previousTime < 100 ? (now - previousTime) / 1000 : 1 / 60;
    previousTime = now;
    const follow = 1 - Math.exp(-delta / 0.1);
    drawnProgress = reduce.matches ? 1 : drawnProgress + (targetProgress - drawnProgress) * follow;
    scrollDisplayProgress += (scrollProgress - scrollDisplayProgress) * follow;
    if (Math.abs(targetProgress - drawnProgress) < 0.0005) drawnProgress = targetProgress;
    if (Math.abs(scrollProgress - scrollDisplayProgress) < 0.0005) scrollDisplayProgress = scrollProgress;
    const progress = drawnProgress;
    intro.dataset.silhouetteProgress = progress.toFixed(4);
    // i valori che cambiano stanno sui loro consumatori, fuori dalle migliaia di discendenti SVG
    setStyle(ghost, "opacity", String(0.2 - 0.1 * smooth(clamp(scrollDisplayProgress / 0.15))));
    setStyle(logo, "--silhouette-logo-scale", String(reduce.matches ? 1 : 1 - 0.055 * smooth(progress)));
    const focus = place.contains(doc.activeElement);
    const amount = (start: number, end: number) =>
      focus ? 1 : reduce.matches ? Number(scrollProgress >= 0.08) : smooth(clamp((scrollDisplayProgress - start) / (end - start)));
    const desktop = view.innerWidth > 700;
    const logoTravel = amount(0.03, 0.23);
    const logoExit = desktop ? amount(0.12, 0.24) : amount(0.04, 0.13);
    const titleProgress = desktop ? amount(0.2, 0.3) : amount(0.13, 0.23);
    const subtitleProgress = desktop ? amount(0.23, 0.34) : amount(0.16, 0.27);
    const placeProgress = desktop ? amount(0.18, 0.37) : amount(0.11, 0.3);
    const ctaProgress = desktop ? amount(0.27, 0.37) : amount(0.2, 0.3);
    setStyle(place, "--silhouette-place-progress", placeProgress.toFixed(4));
    setStyle(logo, "--silhouette-logo-exit", logoExit.toFixed(4));
    setStyle(logo, "--silhouette-logo-travel", logoTravel.toFixed(4));
    setStyle(placeTitle, "--silhouette-title-progress", titleProgress.toFixed(4));
    setStyle(placeDescription, "--silhouette-subtitle-progress", subtitleProgress.toFixed(4));
    setStyle(placeLink, "--silhouette-cta-progress", ctaProgress.toFixed(4));
    if (maskCutout) setAttr(maskCutout, "opacity", amount(0.1, 0.18).toFixed(4));
    const placeReady = ctaProgress > 0.98;
    setAttr(place, "data-ready", String(placeReady));
    setAttr(place, "aria-hidden", placeProgress > 0.01 ? "false" : "true");
    place.toggleAttribute("inert", !placeReady);
    setAttr(placeLink, "tabindex", placeReady ? "0" : "-1");
    setAttr(logo, "aria-hidden", logoExit > 0.98 ? "true" : "false");
    const stageTop = Math.min(
      Math.max(geometry.sectionTop - view.scrollY, geometry.headerHeight),
      geometry.sectionTop + geometry.sectionHeight - geometry.stageHeight - view.scrollY,
    );
    setAttr(intro, "data-in-view", stageTop + geometry.stageHeight > 0 && stageTop < view.innerHeight ? "true" : "false");
    const available = curiosities.map((f) => smooth(clamp((scrollDisplayProgress - f.start) / 0.08)));
    facts.forEach((fact, index) => {
      const next = curiosities[index + 1]?.start ?? 2;
      const sequential = view.innerWidth <= 700 || intro.dataset.sequentialFacts === "true";
      const exit = sequential ? 1 - smooth(clamp((scrollDisplayProgress - next + 0.06) / 0.06)) : 1;
      const opacity = reduce.matches ? 1 : available[index]! * exit;
      const visible = opacity > 0.01;
      setStyle(fact, "--fact-opacity", opacity.toFixed(3));
      setAttr(fact, "data-visible", visible ? "true" : "false");
      setAttr(fact, "aria-hidden", visible ? "false" : "true");
      const marker = markers[index]!;
      const markerAmount = sequential ? opacity : available[index]!;
      setStyle(marker, "--marker-opacity", markerAmount.toFixed(3));
      setAttr(marker, "data-visible", markerAmount > 0.01 ? "true" : "false");
    });
    for (const stroke of strokes) {
      const local = clamp((progress - stroke.start) * stroke.rate);
      const rounded = Math.round(local * 1000);
      if (stroke.drawn !== rounded) {
        stroke.element.style.strokeDashoffset = String(1 - local);
        const visible = local > 0;
        if (stroke.visible !== visible) {
          stroke.element.style.opacity = visible ? "1" : "0";
          stroke.visible = visible;
        }
        stroke.drawn = rounded;
      }
    }
    if (finish) setStyle(finish, "opacity", String(smooth(clamp((progress - 0.94) / 0.06))));
    if (Math.abs(targetProgress - drawnProgress) > 0.0005 || Math.abs(scrollProgress - scrollDisplayProgress) > 0.0005) schedule();
  }

  function schedule(measureAgain = false) {
    if (disposed) return;
    if (measureAgain) needsMeasure = true;
    if (frame === undefined) frame = view.requestAnimationFrame(update);
  }

  if (scene.continueToContent)
    listen(placeLink, "click", (event) => {
      const panel = intro.parentElement?.querySelector<HTMLElement>('[data-hero-panel="0"]');
      if (!panel) return;
      event.preventDefault();
      view.scrollTo({ top: view.scrollY + panel.getBoundingClientRect().top - headerH(), behavior: reduce.matches ? "instant" : "smooth" });
    });
  listen(view, "scroll", () => schedule(), { passive: true });
  listen(place, "focusin", () => schedule());
  listen(place, "focusout", () => schedule());
  listen(view, "resize", () => schedule(true));
  listen(doc, "visibilitychange", () => !doc.hidden && schedule(true));
  listen(reduce, "change", () => schedule(true));
  if ("ResizeObserver" in view) {
    observer = new ResizeObserver(() => schedule(true));
    observer.observe(stage);
    if (header) observer.observe(header);
  }

  // il disegno (centinaia di KB) si scarica dopo il primo rendering, come nel riferimento
  fetch(drawingUrl, { signal: controller.signal })
    .then((r) => {
      if (!r.ok) throw new Error(`Silhouette: ${r.status}`);
      return r.text();
    })
    .then((markup) => {
      if (disposed) return;
      const xml = new DOMParser().parseFromString(markup, "image/svg+xml");
      if (xml.querySelector("parsererror")) throw new Error("SVG non valido");
      art.replaceChildren(doc.importNode(xml.documentElement, true));
      strokes = [...art.querySelectorAll<SVGElement>("[data-silhouette-stroke]")].map((element) => {
        const start = Number(element.dataset.start || 0);
        const end = Number(element.dataset.end || 1);
        return { element, start, rate: 1 / Math.max(0.001, end - start), drawn: 0, visible: false };
      });
      ghost = art.querySelector("[data-silhouette-ghost]");
      finish = art.querySelector("[data-silhouette-finish]");
      const svg = art.querySelector("svg")!;
      const ns = "http://www.w3.org/2000/svg";
      const maskId = `cs-silhouette-copy-${Math.random().toString(36).slice(2, 10)}`;
      const node = (tag: string, attributes: Record<string, string | number>) => {
        const el = doc.createElementNS(ns, tag);
        for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, String(v));
        return el;
      };
      maskDefs = node("defs", {});
      const filter = node("filter", { id: `${maskId}-feather`, x: "-50%", y: "-50%", width: "200%", height: "200%" });
      maskBlur = node("feGaussianBlur", { stdDeviation: 7 });
      filter.append(maskBlur);
      const mask = node("mask", {
        id: maskId,
        maskUnits: "userSpaceOnUse",
        maskContentUnits: "userSpaceOnUse",
        x: 0,
        y: 0,
        width: artWidth,
        height: artHeight,
      });
      mask.append(node("rect", { x: 0, y: 0, width: artWidth, height: artHeight, fill: "#fff" }));
      maskCutout = node("rect", { fill: "#000", opacity: 0, filter: `url(#${maskId}-feather)` });
      mask.append(maskCutout);
      maskDefs.append(filter, mask);
      svg.prepend(maskDefs);
      maskedLines = svg.querySelector("[data-silhouette-lines]");
      maskedLines?.setAttribute("mask", `url(#${maskId})`);
      schedule(true);
    })
    .catch((error: Error) => {
      if (disposed || error.name === "AbortError") return;
      art.replaceChildren();
      schedule(true);
    });

  measure();
  update();
  void doc.fonts?.ready.then(() => !disposed && schedule(true));

  return () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    observer?.disconnect();
    listeners.forEach((dispose) => dispose());
    maskedLines?.removeAttribute("mask");
    maskDefs?.remove();
  };
}
