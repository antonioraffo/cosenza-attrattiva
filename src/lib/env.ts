/**
 * Configurazione pubblica (incorporata nel bundle client). Le feature "wow" sono
 * attive solo se il flag è true; quelle Google richiedono anche la chiave.
 */
const bool = (v: string | undefined, fallback = false) => (v === undefined || v === "" ? fallback : v === "true" || v === "1");

type Fly3DProvider = "google3d" | "maplibre" | "google";
function fly3dProvider(): Fly3DProvider {
  const v = process.env.NEXT_PUBLIC_FLY3D_PROVIDER;
  const wanted: Fly3DProvider = v === "google" || v === "maplibre" ? v : "google3d";
  return wanted !== "maplibre" && !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "maplibre" : wanted;
}

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosenzaattrattiva.test",
  googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  demoTools: bool(process.env.NEXT_PUBLIC_DEMO_TOOLS),
  /**
   * Motore del volo 3D:
   * - "google3d": 3D Maps della Maps JavaScript API, fotorealistico, disponibile anche per gli
   *   account di fatturazione dello Spazio economico europeo (richiede chiave e consenso);
   * - "maplibre": rilievo ed edifici 3D dai dati locali, nessuna chiave né consenso, anche offline;
   * - "google": Photorealistic 3D Tiles (Map Tiles API) con CesiumJS, non disponibili per gli
   *   account dello Spazio economico europeo.
   * Senza chiave Google si usa comunque "maplibre".
   */
  fly3dProvider: fly3dProvider(),
} as const;

export const features = {
  streetView: bool(process.env.NEXT_PUBLIC_FEATURE_STREETVIEW) && publicEnv.googleMapsKey !== "",
  view3d: bool(process.env.NEXT_PUBLIC_FEATURE_3D),
  ar: bool(process.env.NEXT_PUBLIC_FEATURE_AR),
  assistant: bool(process.env.NEXT_PUBLIC_FEATURE_ASSISTANT),
  /** Passaporto (timbri e sigilli): accantonato nella proposta di sintesi, si riattiva con il flag. */
  passport: bool(process.env.NEXT_PUBLIC_FEATURE_PASSPORT, true),
} as const;
