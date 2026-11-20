export function durationParts(min: number) {
  return { h: Math.floor(min / 60), m: min % 60 };
}

export function formatKm(m: number, locale: string) {
  return `${(m / 1000).toLocaleString(locale === "it" ? "it-IT" : "en-GB", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km`;
}
