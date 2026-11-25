/*
 * Disegno al tratto dell'hero: si traccia da solo al caricamento e si ripete in loop.
 * Usa gli stessi SVG dell'intro "silhouette" (tratti con data-start/data-end), ma l'avanzamento viene
 * dal tempo invece che dallo scroll:
 *   tracciamento (DRAW_MS) → pausa a disegno completo (HOLD_MS) → dissolvenza (FADE_MS) → di nuovo.
 *
 * Prestazioni: animare il dashoffset di ~1200 tracciati SVG costringe il browser a ridipingere tutto il
 * disegno a ogni fotogramma. Qui l'SVG resta fermo (solo il "fantasma" a bassa opacità) e i tratti si
 * disegnano su un <canvas> sovrapposto con la stessa geometria: a ogni fotogramma si aggiunge solo il
 * pezzo nuovo dei tratti in corso. Il tratteggio del canvas, come quello SVG, riparte a ogni sottotracciato,
 * quindi la coreografia è identica a quella dell'intro.
 *
 * Con prefers-reduced-motion il disegno è subito completo e fermo. Fuori schermo o con la scheda nascosta
 * l'animazione si ferma. Il disegno si scarica a pagina carica, quando il browser è libero.
 *
 * Card dell'hero (HeroDrawing): `data-cards` = "in" | "out" segue il loop (compaiono a CARDS_AT, se ne
 * vanno con la dissolvenza) e `data-drawing-loop` (0, 1, 2) sceglie la curiosità del giro.
 * Pausa: evento "drawing:pause" (pulsante, WCAG 2.2.2) e puntatore o focus su [data-drawing-hold].
 *
 * Riempimenti (effects/fills.ts): un secondo canvas sotto i tratti colora le parti principali del disegno
 * quando le linee sono quasi finite, una parte dopo l'altra; restano durante la pausa e svaniscono con il
 * disegno. `data-drawing-fill` = quota di riempimento (0–1).
 */
import { fillAlpha, fillColor, type Fill, type FillPalette } from "./fills";

export const DRAW_MS = 7000;
export const HOLD_MS = 4000;
/** le card compaiono quando il disegno è a questo punto e restano fino alla dissolvenza */
const CARDS_AT = 0.85;
export const FADE_MS = 700;
const CYCLE_MS = DRAW_MS + HOLD_MS + FADE_MS;
/** spessore dei tratti in pixel CSS (stroke-width 0.9 con vector-effect non-scaling-stroke) */
const LINE_PX = 0.9;
const FAR = 1e7;
/** i riempimenti partono a questo punto del tracciamento, uno ogni FILL_STEP, e durano FILL_MS */
const FILL_FROM = DRAW_MS * 0.8;
const FILL_STEP = 300;
const FILL_MS = 900;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => 1 - (1 - v) ** 2;

interface Stroke {
  path: Path2D;
  length: number;
  color: string;
  start: number;
  rate: number;
  /** lunghezza già disegnata sul canvas (unità del viewBox) */
  drawn: number;
}

/** ritaglio del disegno in unità del viewBox: `x y width height` */
export type DrawingCrop = string;

export function initializeDrawing(
  root: HTMLElement,
  drawingUrl: string,
  fills: Fill[] = [],
  palette: FillPalette = "verde",
  crop?: DrawingCrop,
): () => void {
  const doc = root.ownerDocument;
  const view = doc.defaultView!;
  const art = root.querySelector<HTMLElement>("[data-drawing-art]")!;
  const reduce = view.matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  let strokes: Stroke[] = [];
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let fillCanvas: HTMLCanvasElement | null = null;
  let fctx: CanvasRenderingContext2D | null = null;
  const fillShapes = fills.map((f) => ({ path: new Path2D(f.d), color: fillColor(f, palette), alpha: fillAlpha(f) }));
  let fillAmounts = fillShapes.map(() => 0);
  let fillKey = "";
  let box = { x: 0, y: 0, width: 1, height: 1 };
  let scale = 1;
  let frame: number | undefined;
  let visible = true;
  let disposed = false;
  let cycle = -1;
  // istante (performance.now) a cui corrisponde l'inizio del ciclo; si sposta durante le pause
  let origin = view.performance.now();
  let pausedAt: number | null = null;
  // motivi di pausa oltre a schermo e scheda: scelta dell'utente, puntatore o focus su una card
  let userPaused = false;
  let hovering = false;
  let focusing = false;
  let resizeObserver: ResizeObserver | undefined;
  // nuova scena: lo stato della precedente non vale più
  for (const key of ["drawingReady", "drawingState", "drawingProgress", "cards", "drawingLoop", "drawingFill"]) delete root.dataset[key];

  /** dimensioni del canvas e trasformazione viewBox → pixel (come preserveAspectRatio="xMidYMid meet") */
  const fit = () => {
    if (!canvas || !ctx) return false;
    const width = art.clientWidth;
    const height = art.clientHeight;
    if (!width || !height) return false;
    const dpr = Math.min(2, view.devicePixelRatio || 1);
    scale = Math.min(width / box.width, height / box.height);
    const ox = (width - box.width * scale) / 2 - box.x * scale;
    const oy = (height - box.height * scale) / 2 - box.y * scale;
    for (const [c, x] of [[canvas, ctx], [fillCanvas, fctx]] as const) {
      if (!c || !x) continue;
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
      x.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
      // con il ritaglio le linee fuori dal viewBox non si vedono
      x.beginPath();
      x.rect(box.x, box.y, box.width, box.height);
      x.clip();
    }
    fillKey = "";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = LINE_PX / scale;
    return true;
  };

  /** porta ogni tratto alla lunghezza che gli spetta a `progress`, disegnando solo il pezzo mancante */
  const advance = (progress: number) => {
    if (!ctx) return;
    for (const s of strokes) {
      const target = clamp((progress - s.start) * s.rate) * s.length;
      if (target <= s.drawn + 0.01) continue;
      ctx.strokeStyle = s.color;
      // un solo trattino [drawn, target] in ogni sottotracciato
      ctx.setLineDash([target - s.drawn, FAR]);
      ctx.lineDashOffset = -s.drawn;
      ctx.stroke(s.path);
      s.drawn = target;
    }
    root.dataset.drawingProgress = progress.toFixed(3);
  };

  /** riempimenti: ognuno alla sua quota (0–1); si ridipinge solo se qualcosa è cambiato */
  const paintFills = (amounts: number[]) => {
    fillAmounts = amounts;
    if (!fctx || !fillCanvas) return;
    const key = amounts.map((a) => a.toFixed(3)).join();
    if (key === fillKey) return;
    fillKey = key;
    fctx.save();
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);
    fctx.restore();
    fillShapes.forEach((f, i) => {
      const a = ease(amounts[i] ?? 0);
      if (a <= 0) return;
      fctx!.globalAlpha = f.alpha * a;
      fctx!.fillStyle = f.color;
      fctx!.fill(f.path);
    });
    fctx.globalAlpha = 1;
    const total = amounts.length ? amounts.reduce((s, a) => s + a, 0) / amounts.length : 0;
    root.dataset.drawingFill = total.toFixed(2);
  };
  /** quote dei riempimenti a `t` ms dall'inizio del ciclo */
  const fillsAt = (t: number) => fillShapes.map((_, i) => clamp((t - FILL_FROM - i * FILL_STEP) / FILL_MS));

  /** ridisegna da capo fino a `progress` (nuovo ciclo, ridimensionamento) */
  const redraw = (progress: number) => {
    if (!ctx || !canvas || !fit()) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    for (const s of strokes) s.drawn = 0;
    advance(progress);
    paintFills(fillAmounts);
  };

  const tick = (now: number) => {
    frame = undefined;
    if (disposed || !ctx || !canvas) return;
    if (reduce.matches) {
      if (root.dataset.drawingState !== "static") {
        canvas.style.opacity = "1";
        if (fillCanvas) fillCanvas.style.opacity = "1";
        fillAmounts = fillShapes.map(() => 1);
        redraw(1);
        root.dataset.drawingState = "static";
        root.dataset.cards = "in";
        root.dataset.drawingLoop = "0";
      }
      return;
    }
    const elapsed = now - origin;
    const current = Math.floor(elapsed / CYCLE_MS);
    const t = elapsed - current * CYCLE_MS;
    if (current !== cycle) {
      cycle = current;
      canvas.style.opacity = "1";
      if (fillCanvas) fillCanvas.style.opacity = "1";
      fillAmounts = fillShapes.map(() => 0);
      redraw(0);
      root.dataset.drawingLoop = String(cycle % 3);
    }
    paintFills(fillsAt(t));
    if (t < DRAW_MS) {
      const progress = ease(t / DRAW_MS);
      advance(progress);
      root.dataset.drawingState = "drawing";
      root.dataset.cards = progress >= CARDS_AT ? "in" : "out";
    } else if (t < DRAW_MS + HOLD_MS) {
      advance(1);
      root.dataset.drawingState = "complete";
      root.dataset.cards = "in";
    } else {
      advance(1);
      canvas.style.opacity = String(1 - clamp((t - DRAW_MS - HOLD_MS) / FADE_MS));
      if (fillCanvas) fillCanvas.style.opacity = canvas.style.opacity;
      root.dataset.drawingState = "fading";
      root.dataset.cards = "out";
    }
    schedule();
  };

  const held = () => userPaused || hovering || focusing;
  const schedule = () => {
    if (disposed || frame !== undefined || !visible || doc.hidden || held() || !strokes.length) return;
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
  const update = () => {
    root.dataset.drawingPaused = String(held());
    if (held()) pause();
    else resume();
  };
  const onPause = (event: Event) => {
    userPaused = !!(event as CustomEvent<boolean>).detail;
    update();
  };
  const onEnter = (event: Event) => {
    if ((event as PointerEvent).pointerType === "touch") return;
    hovering = true;
    update();
  };
  const onLeave = () => {
    hovering = false;
    update();
  };
  const onFocusIn = () => {
    focusing = true;
    update();
  };
  const onFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && holds.some((h) => h.contains(next))) return;
    focusing = false;
    update();
  };
  root.addEventListener("drawing:pause", onPause);
  const holds = [...root.querySelectorAll<HTMLElement>("[data-drawing-hold]")];
  for (const h of holds) {
    h.addEventListener("pointerenter", onEnter);
    h.addEventListener("pointerleave", onLeave);
    h.addEventListener("focusin", onFocusIn);
    h.addEventListener("focusout", onFocusOut);
  }
  const onMotion = () => {
    origin = view.performance.now();
    cycle = -1;
    delete root.dataset.drawingState;
    if (frame === undefined && strokes.length) frame = view.requestAnimationFrame(tick);
  };
  doc.addEventListener("visibilitychange", onVisibility);
  reduce.addEventListener("change", onMotion);

  const idle = () =>
    new Promise<void>((resolve) => {
      const go = () => ("requestIdleCallback" in view ? view.requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 200));
      if (doc.readyState === "complete") go();
      else view.addEventListener("load", go, { once: true, signal: controller.signal });
    });

  idle()
    .then(() => (disposed ? Promise.reject(new DOMException("disposed", "AbortError")) : fetch(drawingUrl, { signal: controller.signal })))
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
      // nell'SVG resta visibile solo il "fantasma"; i tratti animati li disegna il canvas
      const lines = svg.querySelector<SVGGElement>("[data-silhouette-lines]");
      lines?.setAttribute("visibility", "hidden");
      canvas = doc.createElement("canvas");
      canvas.className = "ca-hero-draw-canvas";
      canvas.setAttribute("aria-hidden", "true");
      if (fillShapes.length) {
        fillCanvas = doc.createElement("canvas");
        fillCanvas.className = "ca-hero-draw-canvas ca-hero-fill-canvas";
        fillCanvas.setAttribute("aria-hidden", "true");
        fctx = fillCanvas.getContext("2d");
      }
      art.replaceChildren(...[svg, fillCanvas, canvas].filter((n): n is NonNullable<typeof n> => !!n));
      ctx = canvas.getContext("2d");
      if (crop) svg.setAttribute("viewBox", crop);
      const vb = svg.viewBox.baseVal;
      box = vb && vb.width ? { x: vb.x, y: vb.y, width: vb.width, height: vb.height } : { x: 0, y: 0, width: 1535, height: 1025 };

      const raw = [...(lines?.querySelectorAll<SVGPathElement>("path[data-silhouette-stroke]") ?? [])].map((element) => ({
        element,
        start: Number(element.dataset.start || 0),
        end: Number(element.dataset.end || 1),
      }));
      // l'ultimo tratto finisce a progress = 1: tutte le linee si riempiono
      const last = Math.max(0.001, ...raw.map((s) => s.end));
      strokes = raw.map(({ element, start, end }) => {
        // la lunghezza vera (pathLength=1 vale solo per l'SVG)
        element.removeAttribute("pathLength");
        return {
          path: new Path2D(element.getAttribute("d") ?? ""),
          length: element.getTotalLength(),
          color: element.getAttribute("stroke") || "#1d1d1d",
          start: start / last,
          rate: last / Math.max(0.001, end - start),
          drawn: 0,
        };
      });
      if ("ResizeObserver" in view) {
        resizeObserver = new ResizeObserver(() => {
          const progress = Number(root.dataset.drawingProgress ?? 0);
          redraw(progress);
        });
        resizeObserver.observe(art);
      }
      origin = view.performance.now();
      cycle = -1;
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
    resizeObserver?.disconnect();
    doc.removeEventListener("visibilitychange", onVisibility);
    reduce.removeEventListener("change", onMotion);
    root.removeEventListener("drawing:pause", onPause);
    for (const h of holds) {
      h.removeEventListener("pointerenter", onEnter);
      h.removeEventListener("pointerleave", onLeave);
      h.removeEventListener("focusin", onFocusIn);
      h.removeEventListener("focusout", onFocusOut);
    }
  };
}
