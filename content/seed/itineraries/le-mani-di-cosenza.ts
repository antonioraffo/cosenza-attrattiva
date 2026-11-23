import type { SeedItinerary } from "../types";

/**
 * Itinerario MISTO d'esempio (pilastro Crea): tre tappe geolocalizzate legate ai mestieri storici
 * (fatti presenti nelle schede dei luoghi) e letture senza posizione sui mestieri di oggi.
 * TODO(contenuti): testi delle letture da rivedere con il Comune; botteghe reali dall'Albo Artigiani.
 */
const cam = { zoom: 16.6, bearing: 0, pitch: 45 };

export const itinerary: SeedItinerary = {
  slug: "le-mani-di-cosenza",
  title: { it: "Le mani di Cosenza", en: "The Hands of Cosenza" },
  subtitle: {
    it: "Orefici, conciatori e pignatari: i mestieri che hanno dato nome alle strade",
    en: "Goldsmiths, tanners and potters: the trades that named the streets",
  },
  intro: {
    it: "Prima dei negozi c'erano le botteghe. Questo itinerario sale e scende per il centro storico seguendo i mestieri che hanno lasciato il loro nome nelle vie e nei ponti: gli orefici di Corso Telesio, i conciatori dello Spirito Santo, i pignatari della Massa. Tra una tappa e l'altra, alcune letture raccontano i mestieri di oggi e il progetto «Fatto a Cosenza», che vuole riportare le botteghe nel centro storico.",
    en: "Before shops there were workshops. This itinerary climbs and descends the old town following the trades that left their names on streets and bridges: the goldsmiths of Corso Telesio, the tanners of Spirito Santo, the potters of the Massa. Between stops, a few readings tell the story of today's crafts and of the “Made in Cosenza” project, which aims to bring workshops back to the old town.",
  },
  theme: "storia",
  difficulty: "facile",
  color: "#a3570c",
  cover: "corso-telesio-2",
  featured: false,
  chapters: [
    {
      place: "corso-telesio",
      title: { it: "La strada dei mercanti e degli orefici", en: "The street of merchants and goldsmiths" },
      body: {
        it: "Fino al 1898 il primo tratto di Corso Telesio, fino a piazza Piccola, era noto come *strada dei mercanti e degli orefici*: un susseguirsi di botteghe artigiane e piccoli commerci. Sali piano e guarda i portali in pietra, i cortili oltre i portoni, i balconi in ferro battuto: è la spina dorsale della città antica, e per secoli è stata anche la sua via del lavoro.",
        en: "Until 1898 the first stretch of Corso Telesio, up to Piazza Piccola, was known as the *street of merchants and goldsmiths*: one craft workshop and small trade after another. Climb slowly and look at the stone portals, the courtyards beyond the doors, the wrought-iron balconies: this is the backbone of the old town, and for centuries it was also its working street.",
      },
      camera: cam,
    },
    {
      place: null,
      at: null,
      title: { it: "Lettura · L'oreficeria", en: "Reading · Goldsmithing" },
      body: {
        it: "Metalli lavorati a mano, pezzo per pezzo: l'oreficeria è uno dei mestieri che il programma *Cosenza Crea* vuole riportare nelle botteghe del centro storico, accanto a ceramica, legno, tessile e prodotti locali. Non un artigianato nostalgico, ma botteghe vive, aperte ai giovani creativi e ai designer.",
        en: "Metal worked by hand, piece by piece: goldsmithing is one of the trades the *Cosenza Crea* programme wants to bring back to the old town's workshops, alongside ceramics, wood, textiles and local produce. Not nostalgic craftsmanship, but living workshops open to young creatives and designers.",
      },
    },
    {
      place: "quartiere-spirito-santo",
      title: { it: "Il quartiere delle Concerie", en: "The Tanneries quarter" },
      body: {
        it: "Nel Cinquecento questo era il quartiere più popoloso della città e si chiamava *quartiere delle Concerie*: artigiani e conciatori usavano l'acqua del fiume per trattare le pelli. Immagina le vasche, il battere dei martelli, le pelli stese ad asciugare e i garzoni carichi di cuoio diretti alle botteghe dei sellai e dei calzolai.",
        en: "In the sixteenth century this was the city's most populous quarter and was called the *Tanneries quarter*: craftsmen and tanners used the river water to treat hides. Picture the vats, the hammering, the hides laid out to dry and the apprentices carrying bundles of leather to the saddlers' and shoemakers' workshops.",
      },
      camera: cam,
    },
    {
      place: null,
      at: null,
      title: { it: "Lettura · Legno e tessile", en: "Reading · Wood and textiles" },
      body: {
        it: "Intaglio, tornitura e piccoli mobili; tessuti lavorati al telaio. Sono mestieri che chiedono tempo e mani esperte, e che oggi possono diventare anche esperienze: laboratori e dimostrazioni nelle botteghe, dove chi visita la città vede come nasce un oggetto.",
        en: "Carving, turning and small furniture; fabrics woven on the loom. These are trades that take time and skilled hands, and today they can also become experiences: workshops and demonstrations where visitors see how an object is made.",
      },
    },
    {
      place: "quartiere-massa",
      title: { it: "Il ponte dei Pignatari", en: "The Potters' bridge" },
      body: {
        it: "La Massa è collegata al cuore della città vecchia dal ponte dei Pignatari. Il nome è già un racconto: i *pignatari* erano gli artigiani che modellavano le pignatte, le pentole di terracotta usate in ogni cucina. Da qui la terra diventava oggetto di tutti i giorni.",
        en: "The Massa is linked to the heart of the old town by the Pignatari bridge. The name already tells a story: the *pignatari* were the craftsmen who shaped *pignatte*, the terracotta pots found in every kitchen. Here clay became an everyday object.",
      },
      camera: cam,
    },
    {
      place: null,
      at: null,
      title: { it: "Lettura · Fatto a Cosenza", en: "Reading · Made in Cosenza" },
      body: {
        it: "Il masterplan propone un marchio, *Fatto a Cosenza*, per i prodotti delle botteghe: certificazione di qualità, racconto del territorio e confezioni riconoscibili, perché chi visita la città porti a casa un ricordo autentico. *L'artigianato non è un ricordo del passato: è un'economia che genera lavoro e un'esperienza che rende una città unica.*",
        en: "The masterplan proposes a brand, *Made in Cosenza*, for workshop products: quality certification, storytelling about the territory and recognisable packaging, so that visitors take home an authentic souvenir. *Craftsmanship is not a memory of the past: it is an economy that creates jobs and an experience that makes a city unique.*",
      },
    },
  ],
};
