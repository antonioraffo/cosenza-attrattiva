import type { SeedItinerary } from "../types";

/**
 * Itinerario TEMATICO d'esempio (pilastro Connect, turismo delle radici): nessuna tappa geolocalizzata,
 * le tappe sono le fasi del "viaggio nelle origini" descritto nel programma Cosenza Connect.
 * Durata dichiarata. TODO(contenuti): testi e contatti reali da concordare con il Comune.
 */
export const itinerary: SeedItinerary = {
  slug: "ritorno-a-cosenza",
  title: { it: "Ritorno a Cosenza", en: "Return to Cosenza" },
  subtitle: { it: "Un viaggio nelle origini, per chi ha radici in città", en: "A journey to your roots, for those with family in the city" },
  intro: {
    it: "Molte famiglie partite da Cosenza vivono oggi negli Stati Uniti, in Canada, in Argentina. Questo itinerario non segue una strada: segue un ritorno. Dalla ricerca dei documenti ai luoghi della famiglia, fino all'incontro con la comunità, sono le tappe del viaggio nelle origini che il programma Cosenza Connect vuole rendere più semplice.",
    en: "Many families who left Cosenza now live in the United States, Canada and Argentina. This itinerary does not follow a street: it follows a return. From searching the records to the family's places and meeting the community, these are the stages of the journey to one's roots that the Cosenza Connect programme wants to make easier.",
  },
  theme: "quartieri",
  difficulty: "facile",
  color: "#137396",
  cover: "corso-telesio-3",
  featured: false,
  durationMin: 240,
  chapters: [
    {
      place: null,
      at: null,
      title: { it: "Prima di partire: la ricerca", en: "Before you leave: the search" },
      body: {
        it: "Tutto comincia da un nome, una data, un paese scritto su una lettera. La ricerca genealogica ricostruisce la storia della famiglia attraverso documenti e archivi, per arrivare a Cosenza sapendo dove andare.",
        en: "It all begins with a name, a date, a village written on a letter. Genealogical research rebuilds the family's story through records and archives, so you arrive in Cosenza knowing where to go.",
      },
    },
    {
      place: null,
      at: null,
      title: { it: "I luoghi della famiglia", en: "The family's places" },
      body: {
        it: "Una casa, una chiesa, un rione del centro storico o un borgo dei dintorni: visitare i luoghi da cui partirono nonni e bisnonni è il cuore del viaggio. Gli itinerari della città aiutano a leggere quei luoghi e la loro storia.",
        en: "A house, a church, a quarter of the old town or a nearby village: visiting the places your grandparents and great-grandparents left is the heart of the journey. The city's itineraries help you read those places and their history.",
      },
    },
    {
      place: null,
      at: null,
      title: { it: "La comunità", en: "The community" },
      body: {
        it: "Il ritorno è anche un incontro: con chi è rimasto, con le associazioni, con la vita di tutti i giorni della città. Esperienze autentiche, lontane dai percorsi turistici abituali.",
        en: "A return is also a meeting: with those who stayed, with local associations, with the city's everyday life. Authentic experiences, away from the usual tourist routes.",
      },
    },
    {
      place: null,
      at: null,
      title: { it: "Tornare ancora", en: "Coming back again" },
      body: {
        it: "Chi ritrova le proprie radici spesso torna, e ne parla. Il turismo delle radici è uno dei prodotti su cui punta Cosenza Connect: un legame che continua nel tempo, tra la città e le sue famiglie nel mondo.",
        en: "Those who find their roots often come back, and talk about it. Roots tourism is one of the products Cosenza Connect is investing in: a bond that lasts over time, between the city and its families around the world.",
      },
    },
  ],
};
