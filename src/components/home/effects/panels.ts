/*
 * Pannelli sticky MAB / Duomo / San Domenico: ogni pannello si aggancia sotto le linguette dei
 * precedenti, la foto passa da riquadro arrotondato a pieno pannello e titolo e descrizione si
 * "scrivono" seguendo lo scroll. Porting di hero-slider.js + scroll-typewriter.js di vivicosenza
 * (ANALISI.md §4b): stesso algoritmo e stessi valori. Il movimento lo fa `position: sticky`,
 * il JavaScript segue solo lo scroll e aggiorna variabili CSS.
 */

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** Typewriter su markup già spezzato in caratteri (vedi <Typewriter>). */
function writer(element: Element | null) {
  const characters = element ? [...element.querySelectorAll<HTMLElement>(".home-typewriter-character")] : [];
  let lastCount = -1;
  return (progress: number) => {
    const count = Math.min(characters.length, Math.floor(clamp(progress) * (characters.length + 1)));
    if (count === lastCount) return;
    lastCount = count;
    characters.forEach((c, i) => (c.style.opacity = i < count ? "1" : "0"));
  };
}

export function initializePanels(hero: HTMLElement, titles: string[]): () => void {
  const doc = hero.ownerDocument;
  const view = doc.defaultView!;
  const reduce = view.matchMedia("(prefers-reduced-motion: reduce)");
  const header = doc.querySelector<HTMLElement>("#site-header .site-header-inner");
  const intro = hero.querySelector<HTMLElement>("[data-silhouette-intro]");
  const panels = [...hero.querySelectorAll<HTMLElement>("[data-hero-panel]")];
  const runways = [...hero.querySelectorAll<HTMLElement>("[data-hero-runway]")];
  const buttons = panels.map((p) => p.querySelector<HTMLButtonElement>("[data-hero-jump]")!);
  const bodies = panels.map((p) => p.querySelector<HTMLElement>(".cs-scroll-panel-body")!);
  const status = hero.querySelector<HTMLElement>("[data-hero-status]");
  const writers = panels.map((p) => ({ title: writer(p.querySelector("h1,h2")), description: writer(p.querySelector(".cs-scroll-description")) }));
  const disposers: (() => void)[] = [];
  let observer: ResizeObserver | undefined;
  let frame: number | undefined;
  let disposed = false;
  let needsMeasure = true;
  let starts: number[] = [];
  let targets: number[] = [];
  let zoomDistances: number[] = [];
  let headerHeight = 80;
  let barHeight = 64;
  const panelStates: string[] = [];
  let lastActive: number | undefined;

  const listen = (node: EventTarget | null, name: string, handler: EventListener, options?: AddEventListenerOptions) => {
    node?.addEventListener(name, handler, options);
    disposers.push(() => node?.removeEventListener(name, handler, options));
  };

  function measure() {
    if (!hero.getClientRects().length || !hero.offsetHeight) return false;
    const measured = Math.round(header?.getBoundingClientRect().height || 80);
    if (measured > 0) headerHeight = measured;
    hero.style.setProperty("--hero-header-height", `${headerHeight}px`);
    const style = view.getComputedStyle(hero);
    barHeight = parseFloat(style.getPropertyValue("--hero-bar-height")) || 64;
    let top = hero.getBoundingClientRect().top + view.scrollY + (parseFloat(style.paddingTop) || 0) + (intro?.offsetHeight || 0);
    top += panels[0] ? parseFloat(view.getComputedStyle(panels[0]).marginTop) || 0 : 0;
    zoomDistances = runways.map((r) => r.getBoundingClientRect().height);
    starts = panels.map((panel, index) => {
      const start = top;
      top += panel.offsetHeight + (zoomDistances[index] || 0);
      return start;
    });
    targets = starts.map((start, index) => Math.max(0, start - headerHeight - index * barHeight));
    needsMeasure = false;
    return true;
  }

  function update() {
    frame = undefined;
    if (disposed || doc.hidden) return;
    if (needsMeasure && !measure()) return;
    const y = view.scrollY;
    const height = view.innerHeight;
    let active = 0;
    panels.forEach((panel, index) => {
      if (y >= targets[index]! - 2) active = index;
      const enterRange = Math.max(1, height - headerHeight - index * barHeight);
      const enter = clamp((height - starts[index]! + y) / enterRange);
      const zoom = reduce.matches ? 1 : clamp((y - targets[index]!) / Math.max(1, zoomDistances[index] || 0));
      const easedZoom = zoom * zoom * (3 - 2 * zoom);
      const remainingInset = 1 - easedZoom;
      const nextTop = starts[index + 1];
      const covered =
        nextTop === undefined ? 0 : clamp((height - nextTop + y) / Math.max(1, height - headerHeight - (index + 1) * barHeight));
      const writing = reduce.matches || index === 0 ? 1 : clamp((y - targets[index]! + height * 0.22) / (height * 0.36));
      const state = `${enter}:${zoom}:${covered}:${writing}:${reduce.matches}:${view.innerWidth < 641}`;
      if (panelStates[index] === state) return;
      panelStates[index] = state;
      writers[index]!.title(writing);
      writers[index]!.description(reduce.matches ? 1 : clamp((writing - 0.2) / 0.8));
      const set = (k: string, v: string) => panel.style.setProperty(k, v);
      set("--panel-progress", covered.toFixed(4));
      set("--panel-enter", enter.toFixed(4));
      set("--panel-zoom", zoom.toFixed(4));
      set("--panel-photo-inset-x", `${14 * remainingInset}%`);
      set("--panel-photo-inset-y", `${11.5 * remainingInset}%`);
      set("--panel-photo-radius", `${(view.innerWidth < 641 ? 18 : 24) * remainingInset}px`);
      set("--panel-content-opacity", reduce.matches ? "1" : String(1 - covered * 0.8));
      set("--panel-image-shift", `${reduce.matches ? 0 : (1 - enter) * 8 - covered * 12}px`);
      set("--panel-image-scale", reduce.matches ? "1" : String(1.04 - easedZoom * 0.04 + covered * 0.01));
      const collapsed = covered >= 0.998;
      panel.dataset.covered = String(collapsed);
      buttons[index]!.setAttribute("aria-expanded", String(!collapsed));
      bodies[index]!.inert = collapsed;
      if (collapsed) bodies[index]!.setAttribute("aria-hidden", "true");
      else bodies[index]!.removeAttribute("aria-hidden");
    });
    if (active !== lastActive) {
      panels.forEach((p, i) => (p.dataset.active = String(i === active)));
      hero.dataset.slide = String(active);
      lastActive = active;
    }
  }

  function schedule(measureAgain = false) {
    if (disposed) return;
    if (measureAgain) needsMeasure = true;
    if (frame === undefined) frame = view.requestAnimationFrame(update);
  }

  function show(index: number, announce = true) {
    if (needsMeasure) measure();
    if (!Number.isFinite(targets[index])) return;
    view.scrollTo({ top: targets[index], behavior: reduce.matches ? "instant" : "smooth" });
    if (announce && status) status.textContent = titles[index] ?? "";
    schedule();
  }

  buttons.forEach((button, index) => {
    listen(button, "click", () => show(index));
    listen(button, "keydown", (e) => {
      const event = e as KeyboardEvent;
      if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const n = panels.length;
      const destination =
        event.key === "Home" ? 0 : event.key === "End" ? n - 1 : (index + (event.key === "ArrowDown" ? 1 : n - 1)) % n;
      buttons[destination]!.focus({ preventScroll: true });
      show(destination);
    });
  });
  listen(hero, "focusin", (event) => {
    const body = (event.target as Element).closest?.(".cs-scroll-panel-body") as HTMLElement | null;
    if (!body) return;
    const index = bodies.indexOf(body);
    if (index >= 0 && view.scrollY > targets[index]! + (zoomDistances[index] || 0) + 24) show(index, false);
  });
  listen(view, "scroll", () => schedule(), { passive: true });
  listen(view, "resize", () => schedule(true));
  listen(doc, "visibilitychange", () => !doc.hidden && schedule(true));
  listen(reduce, "change", () => schedule(true));
  if ("ResizeObserver" in view) {
    observer = new ResizeObserver(() => schedule(true));
    observer.observe(hero);
    if (header) observer.observe(header);
  }
  measure();
  update();

  return () => {
    disposed = true;
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    observer?.disconnect();
    disposers.forEach((d) => d());
    bodies.forEach((b) => {
      b.inert = false;
      b.removeAttribute("aria-hidden");
    });
  };
}
