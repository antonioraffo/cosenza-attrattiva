import { describe, expect, it } from "vitest";
import { parseWkbHex } from "@/lib/geo/wkb";

describe("parseWkbHex", () => {
  it("EWKB Point con SRID 4326", () => {
    // SELECT ST_SetSRID(ST_MakePoint(16.2547, 39.2878), 4326)
    const g = parseWkbHex("0101000020E61000008C4AEA0434413040F7E461A1D6A44340");
    expect(g.type).toBe("Point");
    expect(g.coordinates[0]).toBeCloseTo(16.2547, 4);
    expect(g.coordinates[1]).toBeCloseTo(39.2878, 4);
  });
  it("WKB LineString senza SRID", () => {
    // ST_GeomFromText('LINESTRING(0 0, 1 1)')
    const g = parseWkbHex("01020000000200000000000000000000000000000000000000000000000000F03F000000000000F03F");
    expect(g).toEqual({ type: "LineString", coordinates: [[0, 0], [1, 1]] });
  });
});
