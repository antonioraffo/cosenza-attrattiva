import type { Localized } from "@/server/db/schema";

export type Locale = "it" | "en";

/** Testo localizzato con fallback all'italiano. */
export function tr(value: Localized | Partial<Localized> | null | undefined, locale: string): string {
  if (!value) return "";
  return (value as Record<string, string | undefined>)[locale] || value.it || "";
}
