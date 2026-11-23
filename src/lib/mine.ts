/** Funzioni pure di "Il mio itinerario", usabili anche lato server (lo store vive solo nel browser). */

/** Percorso condivisibile: /mio-itinerario?p=slug1,slug2 */
export const shareParam = (places: string[]) => places.join(",");

/** Converte ?p=slug1,slug2 nell'elenco di luoghi esistenti (ignora slug sconosciuti e doppioni, max 30). */
export function parsePlacesParam(p: string | undefined, known: Set<string>) {
  return [...new Set((p ?? "").split(",").map((s) => s.trim()))].filter((s) => known.has(s)).slice(0, 30);
}
