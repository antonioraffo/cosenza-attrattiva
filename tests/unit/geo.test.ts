import { describe, expect, it } from "vitest";
import {
  angleDiff,
  bearingDeg,
  cardinal,
  distanceM,
  formatDistance,
  lineLengthM,
  locateOnLine,
  pointAlong,
  splitLineAt,
  type LngLat,
} from "@/lib/geo";

const duomo: LngLat = [16.2547, 39.2878];
const castello: LngLat = [16.26, 39.285];

describe("distanceM", () => {
  it("è zero per lo stesso punto", () => expect(distanceM(duomo, duomo)).toBe(0));
  it("Duomo → Castello Svevo ≈ 550 m", () => {
    const d = distanceM(duomo, castello);
    expect(d).toBeGreaterThan(500);
    expect(d).toBeLessThan(600);
  });
  it("1° di latitudine ≈ 111 km", () => {
    expect(distanceM([16, 39], [16, 40])).toBeCloseTo(111_195, -2);
  });
  it("è simmetrica", () => expect(distanceM(duomo, castello)).toBeCloseTo(distanceM(castello, duomo), 6));
});

describe("bearingDeg", () => {
  it("nord, est, sud, ovest", () => {
    expect(bearingDeg([16, 39], [16, 39.01])).toBeCloseTo(0, 1);
    expect(bearingDeg([16, 39], [16.01, 39])).toBeCloseTo(90, 0);
    expect(bearingDeg([16, 39.01], [16, 39])).toBeCloseTo(180, 1);
    expect(bearingDeg([16.01, 39], [16, 39])).toBeCloseTo(270, 0);
  });
  it("il Castello è a sud-est del Duomo", () => {
    expect(cardinal(bearingDeg(duomo, castello))).toBe("SE");
  });
});

describe("angleDiff", () => {
  it("attraversa lo zero nel verso più breve", () => {
    expect(angleDiff(350, 10)).toBe(20);
    expect(angleDiff(10, 350)).toBe(-20);
    expect(angleDiff(0, 180)).toBe(180);
  });
});

describe("cardinal", () => {
  it("localizza ovest", () => {
    expect(cardinal(270, "it")).toBe("O");
    expect(cardinal(270, "en")).toBe("W");
    expect(cardinal(359)).toBe("N");
  });
});

describe("linee", () => {
  const line: LngLat[] = [
    [16, 39],
    [16.01, 39],
    [16.01, 39.01],
  ];
  const total = lineLengthM(line);

  it("lunghezza = somma dei segmenti", () => {
    expect(total).toBeCloseTo(distanceM(line[0]!, line[1]!) + distanceM(line[1]!, line[2]!), 6);
  });
  it("locateOnLine trova la distanza lungo il percorso", () => {
    const { alongM, offM } = locateOnLine(line, [16.01, 39.005]);
    expect(offM).toBeLessThan(1);
    expect(alongM).toBeCloseTo(distanceM(line[0]!, line[1]!) + distanceM(line[1]!, [16.01, 39.005]), -1);
  });
  it("splitLineAt conserva la lunghezza", () => {
    const [done, rest] = splitLineAt(line, total * 0.3);
    expect(lineLengthM(done)).toBeCloseTo(total * 0.3, 0);
    expect(lineLengthM(done) + lineLengthM(rest)).toBeCloseTo(total, 0);
  });
  it("pointAlong agli estremi", () => {
    expect(pointAlong(line, 0)).toEqual(line[0]);
    expect(distanceM(pointAlong(line, total + 100), line[2]!)).toBeLessThan(0.01);
  });
});

describe("formatDistance", () => {
  it("metri arrotondati a 5", () => expect(formatDistance(123)).toBe("125 m"));
  it("km con separatore locale", () => {
    expect(formatDistance(1530, "it")).toBe("1,5 km");
    expect(formatDistance(1530, "en")).toBe("1.5 km");
  });
});
