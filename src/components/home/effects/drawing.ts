/*
 * Disegno al tratto dell'hero: si traccia da solo al caricamento e si ripete in loop.
 * Usa gli stessi SVG dell'intro "silhouette" (tratti con data-start/data-end, pathLength=1),
 * ma l'avanzamento viene dal tempo invece che dallo scroll:
 *   tracciamento (DRAW_MS) → pausa a disegno completo (HOLD_MS) → dissolvenza (FADE_MS) → di nuovo.
 * Con prefers-reduced-motion il disegno è subito completo e fermo.
 * Fuori schermo o con la scheda nascosta l'animazione si ferma (nessun frame sprecato).
 */

export const DRAW_MS = 7000;
export const HOLD_MS = 2500;
export const FADE_MS = 700;
const CYCLE_MS = DRAW_MS + HOLD_MS + FADE_MS;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - (1 - v) ** 2;

interface Stroke {
  element: SVGElement;
  start: number;
  rate: number;
  drawn: number;
}

export function initializeDrawing(root: HTMLElement, drawingUrl: string): () => void {
  const doc = root.ownerDocument;
  const view = doc.defaultView!;
  const art = root.querySelector<HTMLElement>("[data-drawing-art]")!;
  const reduce = view.matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  let strokes: Stroke[] = [];
  let lines: SVGElement | null = null;
  let frame: number | undefined;
  let visible = true;
  let disposed = false;
  // istante (performance.now) a cui corrisponde l'inizio del ciclo; si sposta durante le pause
  let origin = view.performance.now();
  let pausedAt: number | null = null;

  const render = (progress: number, fade: number) => {
    for (const s of strokes) {
      const local = Math.round(clamp((progress - s.start) * s.rate) * 1000);
      if (local === s.drawn) continue;
      s.element.style.strokeDashoffset = String(1 - local / 1000);
      s.element.style.opacity = local > 0 ? "1" : "0";
      s.drawn = local;
    }
    if (lines) lines.style.opacity = String(1 - fade);
    root.dataset.drawingProgress = progress.toFixed(3);
  };

  const tick = (now: number) => {
    frame = undefined;
    if (disposed) return;
    if (reduce.matches) {
      render(1, 0);
      root.dataset.drawingState = "static";
      return;
    }
    const t = (now - origin) % CYCLE_MS;
    if (t < DRAW_MS) {
      render(ease(t / DRAW_MS), 0);
      root.dataset.drawingState = "drawing";
    } else if (t < DRAW_MS + HOLD_MS) {
      render(1, 0);
      root.dataset.drawingState = "complete";
    } else {
      render(1, clamp((t - DRAW_MS - HOLD_MS) / FADE_MS));
      root.dataset.drawingState = "fading";
    }
    schedule();
  };

  const schedule = () => {
    if (disposed || frame !== undefined || !visible || doc.hidden || !strokes.length) return;
    frame = view.requestAnimationFrame(tick);
  };
  const pause = () => {
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    frame = undefined;
    pausedAt ??= view.performance.now();
  };
  const resume = () => {
    if (pausedAt !== null) {
      origin += view.performance.now() - pausedAt;
      pausedAt = null;
    }
    schedule();
  };

  const observer =
    "IntersectionObserver" in view
      ? new IntersectionObserver(([entry]) => {
          visible = !!entry?.isIntersecting;
          if (visible) resume();
          else pause();
        })
      : undefined;
  observer?.observe(root);
  const onVisibility = () => (doc.hidden ? pause() : resume());
  const onMotion = () => {
    origin = view.performance.now();
    strokes.forEach((s) => (s.drawn = -1));
    if (frame === undefined) frame = view.requestAnimationFrame(tick);
  };
  doc.addEventListener("visibilitychange", onVisibility);
  reduce.addEventListener("change", onMotion);

  // il disegno (centinaia di KB) si scarica dopo il primo rendering
  fetch(drawingUrl, { signal: controller.signal })
    .then((r) => {
      if (!r.ok) throw new Error(`Disegno: ${r.status}`);
      return r.text();
    })
    .then((markup) => {
      if (disposed) return;
      const xml = new DOMParser().parseFromString(markup, "image/svg+xml");
      if (xml.querySelector("parsererror")) throw new Error("SVG non valido");
      const svg = doc.importNode(xml.documentElement, true) as unknown as SVGSVGElement;
      // il disegno intero sta nel riquadro, senza tagli e con le sue proporzioni
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      art.replaceChildren(svg);
      lines = svg.querySelector("[data-silhouette-lines]");
      const raw = [...svg.querySelectorAll<SVGElement>("[data-silhouette-stroke]")].map((element) => ({
        element,
        start: Number(element.dataset.start || 0),
        end: Number(element.dataset.end || 1),
      }));
      // l'ultimo tratto finisce a progress = 1: tutte le linee si riempiono
      const last = Math.max(0.001, ...raw.map((s) => s.end));
      strokes = raw.map(({ element, start, end }) => ({
        element,
        start: start / last,
        rate: last / Math.max(0.001, end - start),
        drawn: -1,
      }));
      origin = view.performance.now();
      root.dataset.drawingReady = "true";
      if (frame === undefined) frame = view.requestAnimationFrame(tick);
    })
    .catch((error: Error) => {
      if (disposed || error.name === "AbortError") return;
      art.replaceChildren();
    });

  return () => {
    disposed = true;
    controller.abort();
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    observer?.disconnect();
    doc.removeEventListener("visibilitychange", onVisibility);
    reduce.removeEventListener("change", onMotion);
  };
}
