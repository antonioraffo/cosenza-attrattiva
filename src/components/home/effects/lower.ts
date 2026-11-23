/*
 * Effetti della parte bassa della home, porting di home-scroll-effects.js e home-motion.js di
 * vivicosenza (ANALISI.md §4c-d):
 * - il foglio "Tre modi" entra inclinato di 4° (2,7° su mobile) e scalato a .92, si raddrizza e in
 *   uscita si inclina e rimpicciolisce scoprendo gli itinerari, fermi (sticky) sotto;
 * - gli itinerari compaiono seguendo la chiusura del foglio (--itinerary-reveal);
 * - i titoli di sezione si "scrivono" seguendo lo scroll;
 * - gli altri blocchi [data-reveal] entrano con opacity/translate 36px in .9s cubic-bezier(.2,.7,.1,1),
 *   sfasati di 100 ms.
 * Tutto deriva dalla posizione di scroll: tornando indietro l'effetto si inverte.
 */

import { typewriter } from "./typewriter";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

export function initializeLowerEffects(content: HTMLElement): () => void {
  const doc = content.ownerDocument;
  const view = doc.defaultView!;
  const reduce = view.matchMedia("(prefers-reduced-motion: reduce)");
  const stage = content.querySelector<HTMLElement>("[data-explore-stage]");
  const sheet = stage?.querySelector<HTMLElement>("[data-explore-sheet]");
  const itineraries = content.querySelector<HTMLElement>("#itinerari");
  const rows = [...(stage?.querySelectorAll<HTMLElement>("[data-explore-row]") ?? [])];
  const titles = [...content.querySelectorAll<HTMLElement>("h2")]
    .filter((h) => h.querySelector("[data-typewriter]"))
    .map((heading) => ({ heading, write: typewriter(heading) }));
  doc.body.classList.add("home-scroll-effects-active");
  const listeners: (() => void)[] = [];
  let frame: number | undefined;
  let disposed = false;
  let observer: ResizeObserver | undefined;

  const listen = (node: EventTarget | null, name: string, handler: EventListener, options?: AddEventListenerOptions) => {
    node?.addEventListener(name, handler, options);
    listeners.push(() => node?.removeEventListener(name, handler, options));
  };
  const offsetInside = (element: HTMLElement, parent: HTMLElement) => {
    let top = 0;
    for (let node: HTMLElement | null = element; node && node !== parent; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
    return top;
  };

  function update() {
    frame = undefined;
    if (disposed || doc.hidden || !content.getClientRects().length) return;
    const height = view.innerHeight;
    const headerHeight = doc.querySelector("#site-header .site-header-inner")?.getBoundingClientRect().height || 80;
    content.style.setProperty("--home-section-header-height", `${headerHeight}px`);
    if (stage && sheet) {
      const rect = stage.getBoundingClientRect();
      const progress = reduce.matches ? 1 : clamp((height * 1.06 - rect.top) / (height * 0.84));
      const eased = smooth(progress);
      const closing = reduce.matches ? 1 : smooth(clamp((height * 0.94 - rect.bottom) / (height * 0.72)));
      const angle = view.innerWidth < 641 ? 2.7 : 4;
      if (itineraries) {
        itineraries.dataset.exploreReveal = String(closing);
        itineraries.style.setProperty("--itinerary-reveal", String(closing));
      }
      const set = (k: string, v: string) => stage.style.setProperty(k, v);
      set("--explore-progress", progress.toFixed(4));
      set("--explore-close-progress", closing.toFixed(4));
      set("--explore-backing-opacity", String(clamp(1 - closing * 3)));
      set("--explore-shift", `${reduce.matches ? 0 : (1 - eased) * Math.min(140, height * 0.14) - closing * Math.min(160, height * 0.17)}px`);
      set("--explore-rotation", `${reduce.matches ? 0 : (1 - eased) * angle - closing * angle}deg`);
      set("--explore-scale", String(reduce.matches ? 1 : 0.92 + eased * 0.08 - closing * 0.06));
      set("--explore-radius", `${reduce.matches ? 0 : (1 - eased + closing) * 24}px`);
      set("--explore-origin", closing > 0 ? "50% 100%" : "50% 0");
      rows.forEach((row) => {
        const top = rect.top + offsetInside(row, stage);
        const amount = reduce.matches ? 1 : smooth(clamp((height * 0.98 - top) / (height * 0.3)));
        row.style.setProperty("--explore-row-opacity", String(amount));
        row.style.setProperty("--explore-row-shift", `${(1 - amount) * 34}px`);
      });
    }
    titles.forEach(({ heading, write }) => {
      if (!heading.getClientRects().length) return;
      const top = heading.getBoundingClientRect().top;
      const amount = reduce.matches
        ? 1
        : heading.closest("#itinerari")
          ? Number(itineraries?.dataset.exploreReveal ?? 1)
          : smooth(clamp((height * 0.94 - top) / (height * 0.32)));
      write(amount);
    });
  }
  function schedule() {
    if (!disposed && frame === undefined) frame = view.requestAnimationFrame(update);
  }

  // focus da tastiera e ancore mostrano subito la destinazione
  listen(content, "focusin", (event) => {
    const row = (event.target as Element).closest?.("[data-explore-row]") as HTMLElement | null;
    if (row) {
      row.style.setProperty("--explore-row-opacity", "1");
      row.style.setProperty("--explore-row-shift", "0px");
    }
    const reveal = (event.target as Element).closest?.("[data-reveal]") as HTMLElement | null;
    reveal?.classList.add("is-revealed");
  });
  // Gli itinerari stanno fermi sotto il foglio: un'ancora #itinerari deve arrivare al punto in cui
  // il foglio è uscito (come homeScrollTarget nel riferimento), non alla posizione naturale.
  const itinerariesTarget = () => {
    if (!stage || reduce.matches) return null;
    const headerHeight = doc.querySelector("#site-header .site-header-inner")?.getBoundingClientRect().height || 80;
    return Math.max(0, Math.ceil(view.scrollY + stage.getBoundingClientRect().bottom - headerHeight - 16));
  };
  const goToItineraries = (behavior: ScrollBehavior) => {
    const top = itinerariesTarget();
    if (top !== null) view.scrollTo({ top, behavior });
  };
  listen(
    doc,
    "click",
    (event) => {
      const a = (event.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.hash !== "#itinerari" || a.pathname !== view.location.pathname || itinerariesTarget() === null) return;
      event.preventDefault();
      event.stopPropagation();
      view.history.pushState(view.history.state, "", a.href);
      goToItineraries(reduce.matches ? "instant" : "smooth");
    },
    { capture: true },
  );
  listen(view, "hashchange", () => view.location.hash === "#itinerari" && goToItineraries("instant"));
  if (view.location.hash === "#itinerari") view.requestAnimationFrame(() => goToItineraries("instant"));
  listen(view, "scroll", schedule, { passive: true });
  listen(view, "resize", schedule);
  listen(view, "hashchange", schedule);
  listen(doc, "visibilitychange", () => !doc.hidden && schedule());
  listen(reduce, "change", schedule);
  if ("ResizeObserver" in view) {
    observer = new ResizeObserver(schedule);
    observer.observe(content);
  }

  // ingressi "home-motion": IntersectionObserver threshold .15, rootMargin −60px, sfasamento 100 ms (max 4)
  const reveals = [...content.querySelectorAll<HTMLElement>("[data-reveal]")];
  let io: IntersectionObserver | undefined;
  if (!reduce.matches && "IntersectionObserver" in view) {
    reveals.forEach((el) => el.classList.add("reveal-pending"));
    io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        visible.forEach((e, i) => {
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${Math.min(i, 3) * 100}ms`;
          el.classList.add("is-revealed");
          io?.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    reveals.forEach((el) => io!.observe(el));
  }

  update();
  void doc.fonts?.ready.then(() => !disposed && schedule());
  return () => {
    disposed = true;
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    observer?.disconnect();
    io?.disconnect();
    listeners.forEach((d) => d());
    doc.body.classList.remove("home-scroll-effects-active");
  };
}
