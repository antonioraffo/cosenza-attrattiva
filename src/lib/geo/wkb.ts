/**
 * Parser minimale di (E)WKB esadecimale come restituito da PostGIS per le colonne
 * geometry. Supporta Point, LineString e Polygon 2D (con SRID opzionale).
 */
export type Position = [number, number];

export type Geometry =
  | { type: "Point"; coordinates: Position }
  | { type: "LineString"; coordinates: Position[] }
  | { type: "Polygon"; coordinates: Position[][] };

const EWKB_SRID_FLAG = 0x20000000;
const EWKB_Z_FLAG = 0x80000000;
const EWKB_M_FLAG = 0x40000000;

export function parseWkbHex(hex: string): Geometry {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  const view = new DataView(bytes.buffer);
  let offset = 0;

  const little = view.getUint8(offset) === 1;
  offset += 1;
  const rawType = view.getUint32(offset, little);
  offset += 4;
  if (rawType & EWKB_SRID_FLAG) offset += 4; // SRID: sempre 4326 nel nostro schema
  // Senza i flag EWKB resta il codice ISO: 1..3 (2D), 1001.. (Z), 2001.. (M), 3001.. (ZM)
  const base = rawType & 0x0fffffff;
  const isoDims = Math.floor(base / 1000);
  const hasZ = (rawType & EWKB_Z_FLAG) !== 0 || isoDims === 1 || isoDims === 3;
  const hasM = (rawType & EWKB_M_FLAG) !== 0 || isoDims === 2 || isoDims === 3;
  const dims = 2 + (hasZ ? 1 : 0) + (hasM ? 1 : 0);
  const type = base % 1000;

  const readPoint = (): Position => {
    const x = view.getFloat64(offset, little);
    const y = view.getFloat64(offset + 8, little);
    offset += 8 * dims;
    return [x, y];
  };
  const readPoints = (): Position[] => {
    const n = view.getUint32(offset, little);
    offset += 4;
    return Array.from({ length: n }, readPoint);
  };

  switch (type) {
    case 1:
      return { type: "Point", coordinates: readPoint() };
    case 2:
      return { type: "LineString", coordinates: readPoints() };
    case 3: {
      const rings = view.getUint32(offset, little);
      offset += 4;
      return { type: "Polygon", coordinates: Array.from({ length: rings }, readPoints) };
    }
    default:
      throw new Error(`Tipo WKB non supportato: ${rawType}`);
  }
}
