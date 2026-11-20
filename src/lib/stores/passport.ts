import { createStore } from "./create-store";

export interface Stamp {
  at: string; // ISO
  itinerary?: string;
}

export interface PassportState {
  version: 1;
  stamps: Record<string, Stamp>; // per slug del luogo
  badges: Record<string, string>; // slug itinerario → ISO completamento
}

export const passport = createStore<PassportState>({ version: 1, stamps: {}, badges: {} }, "cosenza-passport:v1");

/** Aggiunge un timbro; restituisce true se nuovo. */
export function addStamp(placeSlug: string, itinerary?: string): boolean {
  if (passport.get().stamps[placeSlug]) return false;
  passport.set((s) => ({ ...s, stamps: { ...s.stamps, [placeSlug]: { at: new Date().toISOString(), itinerary } } }));
  return true;
}

/** Assegna il sigillo se tutte le tappe (con luogo) dell'itinerario sono timbrate. Restituisce true se appena ottenuto. */
export function checkBadge(itinerarySlug: string, placeSlugs: string[]): boolean {
  const s = passport.get();
  if (s.badges[itinerarySlug] || placeSlugs.length === 0) return false;
  if (!placeSlugs.every((p) => s.stamps[p])) return false;
  passport.set((st) => ({ ...st, badges: { ...st.badges, [itinerarySlug]: new Date().toISOString() } }));
  return true;
}

export function resetPassport() {
  passport.set({ version: 1, stamps: {}, badges: {} });
}
