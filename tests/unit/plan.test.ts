import { describe, expect, it } from "vitest";
import { buildPlan, fittingItineraries, formatClock, parseStartHour, scheduleStops, type PlanItineraryInput, type PlanLinks } from "@/lib/plan";

const itin = (slug: string, durationMin: number, lengthM: number | null, fractions: (number | null)[], kind: PlanItineraryInput["kind"] = "a-piedi"): PlanItineraryInput => ({
  slug,
  title: slug,
  durationMin,
  lengthM,
  kind,
  color: "#000",
  stops: fractions.map((fraction, i) => ({ title: `${slug}-${i}`, placeSlug: fraction === null ? null : `${slug}-p${i}`, fraction })),
});

const A = itin("a", 80, 2800, [0, 0.5, 1]);
const B = itin("b", 75, 2100, [0, 1]);
const C = itin("c", 70, 1400, [0, null, 1], "misto");
const D = itin("d", 150, 6000, [0, 1]);
const T = itin("t", 240, null, [null, null], "tematico");
const all = [A, B, C, D, T];
const links: PlanLinks = {
  a: { b: 700, c: 140, d: 2000 },
  b: { a: 700, c: 300, d: 900 },
  c: { a: 200, b: 280, d: 1500 },
  d: { a: 2000, b: 900, c: 1500 },
};

describe("scheduleStops", () => {
  it("minuti a piedi dalla frazione del percorso, 8 minuti per tappa", () => {
    const { stops, end } = scheduleStops(A, 600);
    expect(stops.map((s) => s.walkMin)).toEqual([0, 20, 20]);
    expect(stops.map((s) => s.time)).toEqual([600, 628, 656]);
    expect(end).toBe(680); // durata dichiarata 80
  });
  it("le tappe di lettura non hanno cammino", () => {
    const { stops } = scheduleStops(C, 0);
    expect(stops.map((s) => s.walkMin)).toEqual([0, 0, 20]);
  });
});

describe("buildPlan", () => {
  it("3 ore: primo itinerario in ordine editoriale, poi il più vicino che ci sta", () => {
    const p = buildPlan(all, links, "3h", 10);
    expect(p.slugs).toEqual(["a", "c"]);
    const items = p.days[0]!.items;
    expect(items.map((i) => i.type)).toEqual(["itinerary", "transfer", "itinerary"]);
    expect(items[1]).toMatchObject({ start: 680, minutes: 2, distanceM: 140 });
    expect(p.days[0]!.end).toBeLessThanOrEqual(600 + 180);
  });
  it("1 giorno: pausa tra mattina e pomeriggio, nessun itinerario ripetuto, niente tematici", () => {
    const p = buildPlan(all, links, "1g", 9);
    expect(new Set(p.slugs).size).toBe(p.slugs.length);
    expect(p.slugs).not.toContain("t");
    const types = p.days[0]!.items.map((i) => i.type);
    expect(types).toContain("break");
    const brk = p.days[0]!.items.find((i) => i.type === "break")!;
    const after = p.days[0]!.items[p.days[0]!.items.indexOf(brk) + 1]!;
    expect(after.start).toBe(brk.start + brk.minutes);
  });
  it("weekend: il secondo giorno riparte all'ora scelta; si ferma quando finiscono gli itinerari", () => {
    const p = buildPlan(all, links, "weekend", 10);
    expect(p.slugs.sort()).toEqual(["a", "b", "c", "d"]);
    for (const d of p.days) expect(d.items[0]!.start).toBe(600);
  });
  it("luoghi del giro senza doppioni e senza tappe di lettura", () => {
    const p = buildPlan(all, links, "3h");
    expect(p.places).toEqual(["a-p0", "a-p1", "a-p2", "c-p0", "c-p2"]);
  });
  it("altri itinerari che stanno nel tempo, esclusi quelli del giro", () => {
    const p = buildPlan(all, links, "3h");
    expect(fittingItineraries(all, "3h", p).map((i) => i.slug)).toEqual(["b", "d"]);
  });
});

describe("utilità", () => {
  it("formatClock", () => expect(formatClock(9 * 60 + 5)).toBe("09:05"));
  it("parseStartHour accetta solo le ore previste", () => {
    expect(parseStartHour("15")).toBe(15);
    expect(parseStartHour("3")).toBe(10);
    expect(parseStartHour(undefined)).toBe(10);
  });
});
