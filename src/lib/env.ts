/**
 * Configurazione pubblica (incorporata nel bundle client). Le feature "wow" sono
 * attive solo se il flag è true; quelle Google richiedono anche la chiave.
 */
const bool = (v: string | undefined, fallback = false) => (v === undefined || v === "" ? fallback : v === "true" || v === "1");

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cosenzaattrattiva.test",
  googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  demoTools: bool(process.env.NEXT_PUBLIC_DEMO_TOOLS),
} as const;

export const features = {
  streetView: bool(process.env.NEXT_PUBLIC_FEATURE_STREETVIEW) && publicEnv.googleMapsKey !== "",
  view3d: bool(process.env.NEXT_PUBLIC_FEATURE_3D) && publicEnv.googleMapsKey !== "",
  ar: bool(process.env.NEXT_PUBLIC_FEATURE_AR),
  assistant: bool(process.env.NEXT_PUBLIC_FEATURE_ASSISTANT),
} as const;
