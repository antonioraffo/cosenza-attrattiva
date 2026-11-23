import type { Localized } from "@/server/db/schema";

/**
 * Eventi della home. DATI DIMOSTRATIVI ripresi dalla home di riferimento vivicosenza
 * (/home-content.json, stagione del Teatro Rendano, novembre 2026) con le fonti originali.
 * TODO(contenuti): sostituire con il calendario unico degli eventi del Comune (pilastro Cosenza Vive).
 */
export interface CityEvent {
  slug: string;
  title: Localized;
  category: Localized;
  description: Localized;
  schedule: Localized;
  place: string;
  /** date ISO (inizio e fine opzionale) */
  start: string;
  end?: string;
  source: string;
}

export const EVENTS: CityEvent[] = [
  {
    slug: "rossini-a-cosenza",
    title: { it: "Rossini a Cosenza", en: "Rossini in Cosenza" },
    category: { it: "Musica e incontri", en: "Music and talks" },
    description: {
      it: "Un salotto culturale tra musica e teatro, alla scoperta del mondo ironico di Gioachino Rossini.",
      en: "A cultural salon of music and theatre exploring the witty world of Gioachino Rossini.",
    },
    schedule: { it: "Ore 19:00", en: "7 pm" },
    place: "Cosenza",
    start: "2026-11-06",
    source: "https://www.teatrorendanocosenza.it/rendano-speciale-2026/",
  },
  {
    slug: "il-barbiere-di-siviglia",
    title: { it: "Il Barbiere di Siviglia", en: "The Barber of Seville" },
    category: { it: "Opera e musica", en: "Opera and music" },
    description: {
      it: "L'opera buffa di Rossini, con regia di Paolo Panizza e direzione di Ferdinando Sulla.",
      en: "Rossini's comic opera, directed by Paolo Panizza and conducted by Ferdinando Sulla.",
    },
    schedule: { it: "13 nov 20:30 · 15 nov 17:00", en: "13 Nov 8:30 pm · 15 Nov 5 pm" },
    place: "Teatro Rendano, Cosenza",
    start: "2026-11-13",
    end: "2026-11-15",
    source: "https://www.inprimafila.net/index.php/eventi/stagione-lirica-2026-cosenza",
  },
  {
    slug: "e-fuori-nevica",
    title: { it: "…E fuori nevica!", en: "…E fuori nevica!" },
    category: { it: "Teatro e commedia", en: "Theatre and comedy" },
    description: {
      it: "Vincenzo Salemme porta al Rendano la commedia …E fuori nevica!, con quattro repliche.",
      en: "Vincenzo Salemme brings his comedy …E fuori nevica! to the Rendano for four performances.",
    },
    schedule: { it: "19–21 nov 20:30 · 22 nov 18:00", en: "19–21 Nov 8:30 pm · 22 Nov 6 pm" },
    place: "Teatro Rendano, Cosenza",
    start: "2026-11-19",
    end: "2026-11-22",
    source: "https://www.ticketone.it/artist/vincenzo-salemme/vincenzo-salemme-e-fuori-nevica-4152592/",
  },
  {
    slug: "more-per-ennio-morricone",
    title: { it: "MorE | Per Ennio Morricone", en: "MorE | For Ennio Morricone" },
    category: { it: "Danza", en: "Dance" },
    description: {
      it: "Create Danza omaggia Ennio Morricone con uno spettacolo contemporaneo diretto e coreografato da Filippo Stabile.",
      en: "Create Danza pays tribute to Ennio Morricone in a contemporary show directed and choreographed by Filippo Stabile.",
    },
    schedule: { it: "Ore 21:00", en: "9 pm" },
    place: "Teatro Rendano, Cosenza",
    start: "2026-11-23",
    source: "https://www.teatrorendanocosenza.it/danza-2026/",
  },
];
