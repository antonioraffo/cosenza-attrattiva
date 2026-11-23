import { createStore } from "./create-store";

/**
 * "Il mio itinerario": tappe salvate con il cuore (slug dei luoghi, nell'ordine di aggiunta).
 * Resta solo nel telefono (localStorage), come nel prototipo "Città da vivere"; si condivide con un link.
 */
export interface MyItineraryState {
  version: 1;
  places: string[];
}

export const myItinerary = createStore<MyItineraryState>({ version: 1, places: [] }, "cosenza-my-itinerary:v1");

export function toggleSaved(slug: string) {
  myItinerary.set((s) => ({ ...s, places: s.places.includes(slug) ? s.places.filter((p) => p !== slug) : [...s.places, slug] }));
}

export function moveSaved(slug: string, dir: -1 | 1) {
  myItinerary.set((s) => {
    const i = s.places.indexOf(slug);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= s.places.length) return s;
    const places = [...s.places];
    [places[i], places[j]] = [places[j]!, places[i]!];
    return { ...s, places };
  });
}

export function setSaved(places: string[]) {
  myItinerary.set((s) => ({ ...s, places: [...new Set(places)] }));
}

export function clearSaved() {
  myItinerary.set((s) => ({ ...s, places: [] }));
}

export { shareParam } from "@/lib/mine";
