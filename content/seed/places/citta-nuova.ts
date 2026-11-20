import type { SeedPlace } from "../types";

/**
 * Luoghi della "città nuova" di Cosenza: Corso Mazzini e il MAB – Museo all'Aperto Bilotti,
 * Piazza Bilotti, Ponte di Calatrava, Planetario.
 * Posizioni delle opere del MAB: incroci indicati in E. Le Pera, "Guida alle sculture di Cosenza"
 * (Pellegrini, 2024), proiettati sulla geometria OSM di Corso Mazzini → coordsSource "stima".
 */
export const places: SeedPlace[] = [
  {
    slug: "corso-mazzini",
    name: { it: "Corso Mazzini", en: "Corso Mazzini" },
    category: "strada",
    summary: {
      it: "Il salotto della Cosenza moderna: oltre un chilometro di isola pedonale tra negozi, caffè e le sculture del Museo all'Aperto Bilotti.",
      en: "The living room of modern Cosenza: over a kilometre of pedestrian street lined with shops, cafés and the sculptures of the Bilotti Open-Air Museum.",
    },
    body: {
      it: `Corso Giuseppe Mazzini è la spina dorsale della città nuova, cresciuta a nord del Busento quando Cosenza scese dai colli del centro storico verso la pianura del Crati. Qui, tra palazzi del Novecento, vetrine e dehors, i cosentini fanno la loro passeggiata quotidiana: è il luogo dove ci si incontra, si chiacchiera, si guarda e ci si fa guardare.

Dal 2002 il corso è diventato isola pedonale, la più vasta della Calabria, completata nel 2021 con il rifacimento dell'ultimo tratto. Proprio questa trasformazione ha convinto la famiglia Bilotti a scegliere la strada come sede di un museo senza pareti: il MAB, inaugurato nel 2005, che si snoda per circa 1,2 chilometri da Piazza dei Bruzi, dove ha sede il Municipio, fino a Piazza Carlo Bilotti.

Camminando incontri bronzi e marmi di Salvador Dalí, Giorgio de Chirico, Giacomo Manzù, Emilio Greco, Mimmo Rotella, Pietro Consagra, Sacha Sosno e Amedeo Modigliani, collocati agli incroci come fermate di un percorso naturale. Non ci sono biglietti né orari: le opere vivono accanto alle panchine, ai bambini che giocano e a chi porta a spasso il cane.

Nel 2019 il Ministero della Cultura ha dichiarato la collezione di venti sculture d'interesse storico e artistico. È il modo migliore per scoprire che a Cosenza l'arte del Novecento non si visita: si attraversa.`,
      en: `Corso Giuseppe Mazzini is the backbone of the new town, which grew north of the Busento river when Cosenza spread down from the hills of its old town towards the Crati plain. Here, among twentieth-century buildings, shop windows and café terraces, locals take their daily stroll: it is the place to meet, chat, look around and be seen.

Since 2002 the street has been a pedestrian zone, the largest in Calabria, completed in 2021 when the last stretch was rebuilt. That very transformation persuaded the Bilotti family to choose the street as the home of a museum without walls: the MAB, opened in 2005, which runs for about 1.2 kilometres from Piazza dei Bruzi, home of the Town Hall, to Piazza Carlo Bilotti.

As you walk you meet bronzes and marbles by Salvador Dalí, Giorgio de Chirico, Giacomo Manzù, Emilio Greco, Mimmo Rotella, Pietro Consagra, Sacha Sosno and Amedeo Modigliani, placed at the street corners like stops on a natural route. There are no tickets and no opening times: the works live alongside benches, children at play and people walking their dogs.

In 2019 the Ministry of Culture declared the collection of twenty sculptures to be of historic and artistic interest. It is the best way to discover that in Cosenza twentieth-century art is not something you visit: it is something you walk through.`,
    },
    curiosities: [
      {
        it: "Il MAB fu inaugurato nel 2005 alla presenza del presidente della Commissione nazionale italiana per l'UNESCO, Giovanni Puglisi.",
        en: "The MAB was inaugurated in 2005 in the presence of Giovanni Puglisi, president of the Italian National Commission for UNESCO.",
      },
      {
        it: "Il percorso del museo ha un dislivello minimo: si cammina tra i 231 e i 238 metri sul livello del mare.",
        en: "The museum route is almost flat: you walk between 231 and 238 metres above sea level.",
      },
      {
        it: "Altre opere del MAB sono attese: la guida di Enzo Le Pera (2024) cita sculture di Severini, Sironi e Raphaël Mafai ancora in attesa di collocazione.",
        en: "More works are on their way: Enzo Le Pera's guide (2024) lists sculptures by Severini, Sironi and Raphaël Mafai still awaiting placement.",
      },
    ],
    lat: 39.2945756,
    lng: 16.2555408,
    coordsSource: "osm way/120667285 (nodo 1352453425, ingresso sud del tratto pedonale)",
    coordsVerified: true,
    geofenceRadiusM: 80,
    address: "Corso Giuseppe Mazzini, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Isola pedonale in piano, pavimentata, adatta a sedie a ruote e passeggini.",
        en: "Flat, paved pedestrian street suitable for wheelchairs and pushchairs.",
      },
    },
    images: ["corso-mazzini-1", "corso-mazzini-2"],
  },
  {
    slug: "mab-testa-di-cariatide",
    name: { it: "Testa di Cariatide – Amedeo Modigliani", en: "Head of a Caryatid – Amedeo Modigliani" },
    category: "opera-arte",
    summary: {
      it: "Un volto di bronzo alto più di due metri, ingrandito da un modello in legno che Modigliani scolpì a Parigi nel 1910.",
      en: "A bronze face over two metres tall, enlarged from a wooden model Modigliani carved in Paris in 1910.",
    },
    body: {
      it: `All'angolo con via Piave ti viene incontro un volto immobile e allungato: il naso sottile, gli occhi a mandorla senza pupille, il collo che sale come una colonna. È la Testa di Cariatide di Amedeo Modigliani, un bronzo alto oltre due metri e venti.

Prima di diventare il pittore dei ritratti dal collo lungo, Modigliani, nato a Livorno nel 1884 e arrivato a Parigi nel 1906, voleva essere scultore. Tra il 1909 e il 1914 scolpì una serie di teste in pietra e in legno, ispirate insieme alla Grecia arcaica e alle maschere africane che in quegli anni affascinavano le avanguardie. Poi la salute fragile e la polvere della pietra lo costrinsero a tornare ai pennelli.

Il bronzo di Cosenza è un ingrandimento realizzato nel 2006 dal calco in gesso di un modello in legno del 1910, oggi conservato in Australia. Proviene dalla collezione di Laure Modigliani Nechtschein, nipote dell'artista, ed è stato donato alla città nell'ottobre 2015 da Roberto Bilotti insieme alla Fondazione Modigliani.

Fermati di fronte e guarda il volto in controluce: la superficie liscia trattiene il riflesso del cielo, e la "cariatide", nata per sostenere un tempio immaginario, sembra reggere per un momento tutto il corso.`,
      en: `At the corner of Via Piave a still, elongated face comes towards you: a slender nose, almond eyes without pupils, a neck rising like a column. This is the Head of a Caryatid by Amedeo Modigliani, a bronze more than two metres twenty tall.

Before he became the painter of long-necked portraits, Modigliani, born in Livorno in 1884 and settled in Paris from 1906, wanted to be a sculptor. Between 1909 and 1914 he carved a series of heads in stone and wood, inspired both by archaic Greece and by the African masks that were captivating the avant-garde at the time. Then poor health and stone dust forced him back to his brushes.

The Cosenza bronze is an enlargement made in 2006 from the plaster cast of a wooden model of 1910, now kept in Australia. It comes from the collection of Laure Modigliani Nechtschein, the artist's granddaughter, and was donated to the city in October 2015 by Roberto Bilotti together with the Modigliani Foundation.

Stand in front of it and look at the face against the light: the smooth surface holds the reflection of the sky, and the "caryatid", born to hold up an imaginary temple, seems for a moment to be holding up the whole street.`,
    },
    curiosities: [
      {
        it: "Il bronzo misura 226,5 × 75 × 85 cm: è una delle opere più alte del MAB.",
        en: "The bronze measures 226.5 × 75 × 85 cm, making it one of the tallest works in the MAB.",
      },
      {
        it: "Modigliani studiò a Firenze alla Scuola Libera del Nudo, sotto la guida del macchiaiolo Giovanni Fattori.",
        en: "Modigliani studied at the Scuola Libera del Nudo in Florence under the Macchiaioli painter Giovanni Fattori.",
      },
    ],
    lat: 39.2952,
    lng: 16.2552,
    coordsSource: "stima (incrocio Corso Mazzini / via Piave su geometria OSM)",
    coordsVerified: false,
    geofenceRadiusM: 25,
    address: "Corso Mazzini, angolo via Piave, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Opera all'aperto lungo l'isola pedonale, raggiungibile senza gradini.",
        en: "Outdoor work along the pedestrian street, reachable step-free.",
      },
    },
    images: ["mab-testa-di-cariatide-1"],
  },
  {
    slug: "mab-cardinale",
    name: { it: "Grande Cardinale in piedi – Giacomo Manzù", en: "Great Standing Cardinal – Giacomo Manzù" },
    category: "opera-arte",
    summary: {
      it: "Il cardinale di bronzo di Manzù: un mantello che diventa architettura, uno dei temi che lo scultore inseguì per tutta la vita.",
      en: "Manzù's bronze cardinal: a cloak that turns into architecture, a theme the sculptor pursued all his life.",
    },
    body: {
      it: `All'incrocio con via Isonzo si alza una figura che sembra una piccola cattedrale: un cono di bronzo chiuso nel mantello, sormontato dalla mitria, con il volto appena accennato. È il Grande Cardinale in piedi di Giacomo Manzù.

Manzù, nato a Bergamo nel 1908 e morto a Roma nel 1991, era figlio di un calzolaio sagrestano e imparò il mestiere intagliando e dorando il legno. Divenne uno dei maggiori scultori italiani del Novecento: sua è la Porta della Morte della basilica di San Pietro, realizzata tra il 1947 e il 1964.

I cardinali furono la sua ossessione. Dalla fine degli anni Trenta in poi ne modellò centinaia di versioni, seduti o in piedi, piccoli e monumentali. Non gli interessava il potere della Chiesa, ma la forma: un corpo nascosto che diventa volume puro, una superficie su cui la luce scivola senza interruzioni.

L'esemplare di Cosenza, fuso nel 2004, alto 232 centimetri, è il quinto di otto tratti dall'originale del 1965 ed è registrato presso l'archivio della Fondazione Manzù. Accanto, quasi in dialogo, si alzano le Tre colonne doriche in marmo bianco del francese Sacha Sosno. Fai un giro completo attorno al cardinale: da ogni lato il mantello cambia profilo.`,
      en: `At the corner of Via Isonzo rises a figure that looks like a small cathedral: a bronze cone wrapped in a cloak, topped by a mitre, its face barely hinted at. This is the Great Standing Cardinal by Giacomo Manzù.

Manzù, born in Bergamo in 1908 and died in Rome in 1991, was the son of a shoemaker who also served as a sacristan, and he learned his trade carving and gilding wood. He became one of the great Italian sculptors of the twentieth century: the Door of Death of St Peter's Basilica, made between 1947 and 1964, is his work.

Cardinals were his obsession. From the late 1930s onwards he modelled hundreds of versions, seated or standing, small and monumental. He was not interested in the power of the Church but in form: a hidden body turned into pure volume, a surface over which light slides without a break.

The Cosenza cast, made in 2004 and 232 centimetres tall, is the fifth of eight taken from the 1965 original and is registered with the archive of the Manzù Foundation. Next to it, almost in conversation, stand the white marble Three Doric Columns by the French artist Sacha Sosno. Walk all the way round the cardinal: the cloak changes its outline from every side.`,
    },
    curiosities: [
      {
        it: "Manzù realizzò oltre trecento versioni del Cardinale, diverse per dimensioni, posa e materiale.",
        en: "Manzù made more than three hundred versions of the Cardinal, differing in size, pose and material.",
      },
      {
        it: "Sul corso c'è un secondo Manzù: la Testa di Medusa, all'angolo con via Macallè.",
        en: "There is a second Manzù on the street: the Head of Medusa, at the corner of Via Macallè.",
      },
    ],
    lat: 39.2959,
    lng: 16.2548,
    coordsSource: "stima (incrocio Corso Mazzini / via Isonzo su geometria OSM)",
    coordsVerified: false,
    geofenceRadiusM: 25,
    address: "Corso Mazzini, angolo via Isonzo, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Opera all'aperto lungo l'isola pedonale, raggiungibile senza gradini.",
        en: "Outdoor work along the pedestrian street, reachable step-free.",
      },
    },
    images: ["mab-cardinale-1"],
  },
  {
    slug: "mab-san-giorgio-e-il-drago",
    name: { it: "San Giorgio e il drago – Salvador Dalí", en: "Saint George and the Dragon – Salvador Dalí" },
    category: "opera-arte",
    summary: {
      it: "Il bronzo surrealista di Dalí: un cavaliere senza volto su un destriero impennato e un drago dalle spire di serpente, nel cuore del corso.",
      en: "Dalí's surrealist bronze: a faceless knight on a rearing horse and a serpent-coiled dragon, in the heart of the street.",
    },
    body: {
      it: `All'altezza di via Paul Harris il corso si apre su una scena di battaglia. Un cavallo s'impenna con una zampa sollevata, in groppa un cavaliere in cotta di maglia, sotto di loro un drago avvolge le sue spire squamose. È San Giorgio e il drago di Salvador Dalí, il pezzo più celebre del MAB.

Guardalo da vicino e scoprirai che non è un monumento equestre come gli altri. Il cavaliere non ha volto, il drago sembra più un serpente marino che una belva alata, e le spire si annodano intorno alle zampe del cavallo come in un incubo. È la grammatica del sogno che Dalí, nato a Figueres nel 1904 e morto nella stessa città nel 1989, ha portato dalla pittura alla scultura.

San Giorgio, Sant Jordi in catalano, è il patrono della Catalogna, la terra dell'artista: la scelta del soggetto non è casuale. Il modello risale al periodo 1977-1984; il bronzo di Cosenza, alto 141 centimetri, è uno dei sette esemplari dell'edizione museale, autenticato dal Dalí Universe.

Gira intorno al basamento e segui le spire del drago da un capo all'altro: a ogni passo il gruppo cambia forma, e il combattimento sembra ricominciare.`,
      en: `Level with Via Paul Harris the street opens onto a battle scene. A horse rears with one foreleg raised, a rider in chain mail on its back, and beneath them a dragon wraps its scaly coils. This is Saint George and the Dragon by Salvador Dalí, the most famous piece in the MAB.

Look closely and you will see it is not an equestrian monument like the others. The rider has no face, the dragon looks more like a sea serpent than a winged beast, and its coils knot themselves around the horse's legs as in a nightmare. This is the grammar of dreams that Dalí, born in Figueres in 1904 and died in the same town in 1989, carried from painting into sculpture.

Saint George, Sant Jordi in Catalan, is the patron saint of Catalonia, the artist's homeland: the choice of subject is no accident. The model dates from 1977 to 1984; the Cosenza bronze, 141 centimetres high, is one of seven casts of the museum edition, authenticated by the Dalí Universe.

Walk around the base and follow the dragon's coils from end to end: with every step the group changes shape, and the fight seems to start all over again.`,
    },
    curiosities: [
      {
        it: "Nelle fonti la posizione è indicata sia come angolo via Paul Harris sia come angolo via Adige: le due strade si affacciano sul corso una di fronte all'altra.",
        en: "Sources give the location both as the corner of Via Paul Harris and as the corner of Via Adige: the two streets meet the Corso opposite each other.",
      },
      {
        it: "Il 23 aprile, giorno di Sant Jordi, in Catalogna ci si scambiano una rosa e un libro.",
        en: "On 23 April, Sant Jordi's day, people in Catalonia exchange a rose and a book.",
      },
    ],
    lat: 39.29675,
    lng: 16.2545,
    coordsSource: "stima (incrocio Corso Mazzini / via Paul Harris; coincide con osm node/13145161601, tourism=artwork senza nome)",
    coordsVerified: false,
    geofenceRadiusM: 25,
    address: "Corso Mazzini, angolo via Paul Harris, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Opera all'aperto lungo l'isola pedonale, raggiungibile senza gradini.",
        en: "Outdoor work along the pedestrian street, reachable step-free.",
      },
    },
    images: ["mab-san-giorgio-e-il-drago-1"],
  },
  {
    slug: "mab-grande-bagnante",
    name: { it: "La Grande Bagnante n. 2 – Emilio Greco", en: "Large Bather No. 2 – Emilio Greco" },
    category: "opera-arte",
    summary: {
      it: "Una figura femminile di bronzo, sottile e slanciata, che Emilio Greco modellò nel 1957: la grazia classica riletta dal Novecento.",
      en: "A slender, elongated bronze female figure modelled by Emilio Greco in 1957: classical grace reread by the twentieth century.",
    },
    body: {
      it: `Dove via Arabia sale verso destra, una donna di bronzo si stira come appena uscita dall'acqua: una mano sul fianco, l'altra portata alla testa, il busto inarcato, le gambe lunghe e affusolate. È La Grande Bagnante n. 2, che Emilio Greco modellò nel 1957.

Greco, nato a Catania nel 1913 e morto a Roma nel 1995, è stato uno degli scultori figurativi più amati del dopoguerra. Mentre molti suoi contemporanei sceglievano l'astrazione, lui restò fedele al corpo umano, soprattutto femminile, cercando una bellezza calma e insieme nervosa. Il tema della bagnante, caro all'arte del Novecento, lo accompagnò per tutti gli anni Cinquanta, in diverse versioni numerate.

L'opera è alta 227 centimetri, ma ha una base strettissima: tutta la figura si regge su pochi punti d'appoggio e sembra quasi in punta di piedi. Osserva come la luce del pomeriggio corre lungo i fianchi e si spezza sugli spigoli dei gomiti: è lì che Greco gioca la sua partita tra classicità e modernità.

Poco più in là c'è un'altra sua opera, la Grande figura accoccolata n. 5 del 1975, raccolta su sé stessa: insieme mostrano due modi opposti di abitare lo spazio.`,
      en: `Where Via Arabia climbs off to the right, a bronze woman stretches as if she has just stepped out of the water: one hand on her hip, the other raised to her head, torso arched, legs long and tapering. This is Large Bather No. 2, modelled by Emilio Greco in 1957.

Greco, born in Catania in 1913 and died in Rome in 1995, was one of the best-loved figurative sculptors of the post-war years. While many of his contemporaries chose abstraction, he stayed faithful to the human body, above all the female body, in search of a beauty that is both calm and nervous. The bather, a favourite subject of twentieth-century art, stayed with him throughout the 1950s in several numbered versions.

The work is 227 centimetres tall but stands on a very narrow base: the whole figure rests on a few points of contact and seems almost to be on tiptoe. Notice how the afternoon light runs along her hips and breaks on the sharp angles of her elbows: this is where Greco plays out his game between the classical and the modern.

A little further on is another of his works, the Large Crouching Figure No. 5 of 1975, folded in on itself: together they show two opposite ways of inhabiting space.`,
    },
    curiosities: [
      {
        it: "Emilio Greco è l'autore delle porte bronzee del Duomo di Orvieto.",
        en: "Emilio Greco made the bronze doors of Orvieto Cathedral.",
      },
      {
        it: "A Cosenza altre due opere di Greco, Chiara (1959) e la Piccola Bagnante Tedofora (1960), sono conservate nel Museo di Palazzo Arnone.",
        en: "Two more works by Greco, Chiara (1959) and the Small Torch-Bearing Bather (1960), are kept in Cosenza's Palazzo Arnone museum.",
      },
    ],
    lat: 39.2985,
    lng: 16.2538,
    coordsSource: "stima (incrocio Corso Mazzini / via Arabia su geometria OSM)",
    coordsVerified: false,
    geofenceRadiusM: 25,
    address: "Corso Mazzini, angolo via Arabia, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Opera all'aperto lungo l'isola pedonale, raggiungibile senza gradini.",
        en: "Outdoor work along the pedestrian street, reachable step-free.",
      },
    },
    images: ["mab-grande-bagnante-1"],
  },
  {
    slug: "mab-lupo-della-sila",
    name: { it: "Il Lupo della Sila – Mimmo Rotella", en: "The Wolf of the Sila – Mimmo Rotella" },
    category: "opera-arte",
    summary: {
      it: "Un lupo di marmo verde, sagomato come una silhouette: l'omaggio del calabrese Mimmo Rotella alla sua terra.",
      en: "A green marble wolf cut like a silhouette: Calabrian artist Mimmo Rotella's tribute to his homeland.",
    },
    body: {
      it: `In Piazza Kennedy, dove il corso si allarga, un lupo verde alza il muso al cielo, come se ululasse. Visto di lato sembra pieno e possente, ma è una lastra spessa appena diciotto centimetri, quasi una figura ritagliata da un manifesto. È Il Lupo della Sila di Mimmo Rotella.

Rotella, nato a Catanzaro nel 1918 e morto a Milano nel 2006, è considerato con Umberto Boccioni l'artista calabrese più importante del Novecento. Divenne famoso negli anni Cinquanta con il décollage: strappava i manifesti pubblicitari dai muri di Roma e li ricomponeva in quadri, trasformando la città e il cinema in materia pittorica. Le sue opere sono oggi in musei come il Centre Pompidou di Parigi e la Tate di Londra.

Per Cosenza scelse invece un simbolo antico: il lupo, animale dell'altopiano della Sila, che i Bruzi, gli antichi abitanti di questa terra, sentivano vicino alla propria natura indomita. Il prototipo era in legno; gli scalpellini di Carrara lo hanno tradotto in marmo verde nel 2005, e l'opera è arrivata sul corso nel dicembre 2007.

Mettiti di lato e poi di fronte: da una parte il lupo è una presenza netta, dall'altra quasi scompare. È lo stesso gioco tra immagine e superficie che Rotella faceva con i manifesti.`,
      en: `In Piazza Kennedy, where the street widens, a green wolf raises its muzzle to the sky as if howling. From the side it looks full and powerful, yet it is a slab barely eighteen centimetres thick, almost a figure cut out of a poster. This is The Wolf of the Sila by Mimmo Rotella.

Rotella, born in Catanzaro in 1918 and died in Milan in 2006, is considered, together with Umberto Boccioni, the most important Calabrian artist of the twentieth century. He made his name in the 1950s with décollage: he tore advertising posters off the walls of Rome and reassembled them into pictures, turning the city and the cinema into painterly material. His works are now in museums such as the Centre Pompidou in Paris and Tate in London.

For Cosenza he chose an ancient symbol instead: the wolf, animal of the Sila plateau, which the Bruttians, the ancient people of this land, felt close to their untamed nature. The prototype was in wood; Carrara stonecutters translated it into green marble in 2005, and the work arrived on the street in December 2007.

Stand to one side and then face it head-on: from one angle the wolf is a sharp presence, from the other it almost disappears. It is the same game between image and surface that Rotella played with his posters.`,
    },
    curiosities: [
      {
        it: "Sul corso c'è un secondo Rotella, la Rinascita della cultura (2002), in Piazza XI Settembre.",
        en: "There is a second Rotella on the street, the Rebirth of Culture (2002), in Piazza XI Settembre.",
      },
      {
        it: "Una grande opera di Rotella, Ikarus, accoglie i viaggiatori nella sala d'attesa dell'aeroporto di Lamezia Terme.",
        en: "A large work by Rotella, Ikarus, greets travellers in the waiting room of Lamezia Terme airport.",
      },
    ],
    lat: 39.3001,
    lng: 16.2532,
    coordsSource: "stima (Piazza Kennedy su Corso Mazzini, geometria OSM)",
    coordsVerified: false,
    geofenceRadiusM: 25,
    address: "Piazza John Fitzgerald Kennedy, Corso Mazzini, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Opera all'aperto in piazza pedonale, raggiungibile senza gradini.",
        en: "Outdoor work in a pedestrian square, reachable step-free.",
      },
    },
    images: ["mab-lupo-della-sila-1"],
  },
  {
    slug: "mab-ettore-e-andromaca",
    name: { it: "Ettore e Andromaca – Giorgio de Chirico", en: "Hector and Andromache – Giorgio de Chirico" },
    category: "opera-arte",
    summary: {
      it: "I due manichini abbracciati di de Chirico: l'addio dell'Iliade trasformato in un'icona della Metafisica.",
      en: "De Chirico's two embracing mannequins: the farewell from the Iliad turned into an icon of Metaphysical art.",
    },
    body: {
      it: `All'angolo tra Piazza Kennedy e via Molinella due figure senza volto si stringono l'una all'altra. Lui porta l'elmo e impugna una lunga lancia, lei è avvolta in una veste che scende fino ai piedi; le teste sono ovali lisci, come quelle dei manichini. Sono Ettore e Andromaca di Giorgio de Chirico.

La scena viene dal sesto libro dell'Iliade: Ettore, l'eroe troiano, saluta la moglie Andromaca prima di uscire a combattere contro Achille. Entrambi sanno che è un addio. De Chirico, nato nel 1888 a Volos, in Grecia, e morto a Roma nel 1978, dipinse questo soggetto per la prima volta nel 1917 e ci tornò per tutta la vita: è uno dei quadri simbolo della pittura metafisica, l'arte degli enigmi, delle piazze deserte e dei manichini che sostituiscono gli uomini.

Il bronzo di Cosenza, alto 230 centimetri, è stato fuso nel 2005 dalla fonderia Tavani in due esemplari autorizzati dalla Fondazione Giorgio e Isa de Chirico. Carlo Bilotti amava profondamente il maestro metafisico: a lui si deve anche la donazione di opere di de Chirico al museo che porta il suo nome a Villa Borghese, a Roma.

Avvicinati e guarda come la lancia di Ettore resta dritta mentre i due corpi si piegano l'uno verso l'altra: la guerra aspetta, l'abbraccio dura ancora un istante.`,
      en: `At the corner of Piazza Kennedy and Via Molinella two faceless figures hold each other close. He wears a helmet and grips a long spear, she is wrapped in a gown that falls to her feet; their heads are smooth ovals, like those of mannequins. They are Giorgio de Chirico's Hector and Andromache.

The scene comes from the sixth book of the Iliad: Hector, the Trojan hero, says goodbye to his wife Andromache before going out to fight Achilles. Both know it is a farewell. De Chirico, born in 1888 in Volos, Greece, and died in Rome in 1978, first painted this subject in 1917 and returned to it all his life: it is one of the defining images of Metaphysical painting, the art of enigmas, empty squares and mannequins standing in for people.

The Cosenza bronze, 230 centimetres tall, was cast in 2005 by the Tavani foundry in two copies authorised by the Giorgio and Isa de Chirico Foundation. Carlo Bilotti deeply loved the Metaphysical master: he also donated works by de Chirico to the museum that bears his name in Villa Borghese, Rome.

Move closer and see how Hector's spear stays upright while the two bodies lean into each other: war is waiting, but the embrace lasts one moment longer.`,
    },
    curiosities: [
      {
        it: "Il MAB custodisce altre due opere di de Chirico, I Grandi Archeologi e Il Grande Metafisico, in Piazza XI Settembre.",
        en: "The MAB holds two more works by de Chirico, The Great Archaeologists and The Great Metaphysician, in Piazza XI Settembre.",
      },
      {
        it: "De Chirico nacque a Volos, in Grecia, presso l'antica Iolco, da cui secondo il mito salparono gli Argonauti.",
        en: "De Chirico was born in Volos, Greece, near ancient Iolcus, from where, according to myth, the Argonauts set sail.",
      },
    ],
    lat: 39.3005,
    lng: 16.2534,
    coordsSource: "stima (Piazza Kennedy angolo via Molinella su geometria OSM)",
    coordsVerified: false,
    geofenceRadiusM: 25,
    address: "Piazza John Fitzgerald Kennedy, angolo via Molinella, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Opera all'aperto in piazza pedonale, raggiungibile senza gradini.",
        en: "Outdoor work in a pedestrian square, reachable step-free.",
      },
    },
    images: ["mab-ettore-e-andromaca-1"],
  },
  {
    slug: "piazza-bilotti",
    name: { it: "Piazza Carlo Bilotti (già Piazza Fera)", en: "Piazza Carlo Bilotti (formerly Piazza Fera)" },
    category: "piazza",
    summary: {
      it: "La piazza che chiude a nord Corso Mazzini, rinnovata e popolata dai dodici Filosofi guerrieri in acciaio corten di Giuseppe Gallo.",
      en: "The square at the northern end of Corso Mazzini, redesigned and peopled by Giuseppe Gallo's twelve Corten-steel Warrior Philosophers.",
    },
    body: {
      it: `Per generazioni di cosentini questa è stata Piazza Fera, dal nome di Luigi Fera, politico cosentino del primo Novecento. Oggi è intitolata a Carlo Bilotti, il collezionista di origine cosentina che ha voluto regalare alla sua città il museo all'aperto di Corso Mazzini. Qui il percorso del MAB arriva al suo traguardo.

La piazza è stata profondamente ridisegnata: sotto i tuoi piedi c'è un parcheggio interrato, in superficie un grande spazio pedonale aperto verso i palazzi della città nuova. Al centro si alzano I Filosofi guerrieri di Giuseppe Gallo, artista nato a Rogliano, a pochi chilometri da qui, inaugurati il 1° aprile 2017.

Sono dodici sagome in acciaio corten, color ruggine, divise in gruppi. Hanno i piedi in torsione, come un attimo prima di una danza, e la testa china sul petto, come chi sta pensando: istinto e riflessione nello stesso corpo. Un gruppo di cinque figure sorregge un grande cerchio su cui sono incisi i nomi di popoli che hanno abitato e abitano la Calabria: Bruzi, Arbëreshë, Occitani, Valdesi, Grecanici. Tra le figure compaiono anche un lupo della Sila e un toro che si volta indietro, il toro di Sibari.

Poco distante si erge la grande Bifrontale in marmo rosato di Pietro Consagra, alta più di tre metri e mezzo: una scultura piatta, pensata per essere guardata da due lati.`,
      en: `For generations of locals this was Piazza Fera, named after Luigi Fera, a Cosenza politician of the early twentieth century. Today it is named after Carlo Bilotti, the collector of Cosenza origin who wanted to give his city the open-air museum along Corso Mazzini. This is where the MAB route reaches its finish line.

The square has been thoroughly redesigned: beneath your feet is an underground car park, on the surface a large pedestrian space opening towards the buildings of the new town. In the middle stand The Warrior Philosophers by Giuseppe Gallo, an artist born in Rogliano, a few kilometres from here, unveiled on 1 April 2017.

They are twelve silhouettes in rust-coloured Corten steel, arranged in groups. Their feet are twisted, as in the instant before a dance, and their heads are bowed towards their chests, like someone lost in thought: instinct and reflection in the same body. A group of five figures holds up a large ring engraved with the names of peoples who have lived, and still live, in Calabria: Bruttians, Arbëreshë, Occitans, Waldensians, Grecanici. Among the figures you will also find a Sila wolf and a bull looking back over its shoulder, the bull of Sybaris.

Close by rises Pietro Consagra's large Bifrontale in pink marble, more than three and a half metres tall: a flat sculpture designed to be seen from two sides.`,
    },
    curiosities: [
      {
        it: "Il numero dodici dei Filosofi guerrieri non è casuale: per l'artista indica un ciclo compiuto, la totalità ricomposta.",
        en: "The twelve Warrior Philosophers are no accident: for the artist the number stands for a completed cycle, a restored whole.",
      },
      {
        it: "La Bifrontale di Consagra prende il nome anche dal suo marmo, il rosa scuro di Toscana.",
        en: "Consagra's Bifrontale is also known by its marble, the dark pink stone of Tuscany.",
      },
    ],
    lat: 39.302399,
    lng: 16.252064,
    coordsSource: "osm way/547717394",
    coordsVerified: true,
    geofenceRadiusM: 50,
    address: "Piazza Carlo Bilotti, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Piazza pedonale in piano collegata all'isola pedonale di Corso Mazzini.",
        en: "Flat pedestrian square connected to the Corso Mazzini pedestrian zone.",
      },
    },
    images: ["piazza-bilotti-1", "piazza-bilotti-2"],
  },
  {
    slug: "ponte-calatrava",
    name: { it: "Ponte di Calatrava (Ponte San Francesco di Paola)", en: "Calatrava Bridge (San Francesco di Paola Bridge)" },
    category: "architettura",
    summary: {
      it: "Il ponte strallato di Santiago Calatrava sul Crati: un'antenna inclinata alta oltre cento metri, inaugurata nel 2018.",
      en: "Santiago Calatrava's cable-stayed bridge over the Crati: an inclined mast over a hundred metres tall, opened in 2018.",
    },
    body: {
      it: `Lo vedi da lontano, da quasi ogni punto della città: un'antenna bianca che sale obliqua verso il cielo, inclinata di 52 gradi, alta oltre cento metri, con i cavi che si aprono a ventaglio come le corde di un'arpa gigante. È il Ponte San Francesco di Paola, per tutti il Ponte di Calatrava.

Lo ha progettato l'architetto e ingegnere spagnolo Santiago Calatrava, autore di ponti celebri in tutto il mondo; è la sua terza opera di questo tipo in Italia. Il ponte, in acciaio e cemento, è lungo 103 metri e largo 24: collega le due sponde del Crati e scavalca la ferrovia nel quartiere di Gergeri, una delle porte d'accesso al centro storico.

La sua storia è stata lunga. Il progetto fu presentato nel 2000, i lavori cominciarono nell'ottobre 2008 e l'antenna, un elemento d'acciaio da circa 800 tonnellate, fu sollevata solo il 23 luglio 2017. L'inaugurazione arrivò il 26 gennaio 2018, diciotto anni dopo la prima idea.

Il ponte fa parte di un progetto di rigenerazione urbana che vuole ricucire una zona a lungo marginale con il cuore della città. Attraversalo a piedi al tramonto: i cavi tagliano la luce in tante linee sottili e, verso sud, si apre la vista sulle colline della valle del Crati.`,
      en: `You can see it from almost anywhere in the city: a white mast rising obliquely into the sky, tilted at 52 degrees and more than a hundred metres tall, its cables fanning out like the strings of a giant harp. This is the San Francesco di Paola Bridge, known to everyone as the Calatrava Bridge.

It was designed by the Spanish architect and engineer Santiago Calatrava, creator of famous bridges all over the world; it is his third work of this kind in Italy. Built in steel and concrete, the bridge is 103 metres long and 24 metres wide: it links the two banks of the Crati and crosses the railway in the Gergeri district, one of the gateways to the old town.

Its story was a long one. The project was presented in 2000, works began in October 2008, and the mast, a steel element of about 800 tonnes, was raised only on 23 July 2017. The opening came on 26 January 2018, eighteen years after the first idea.

The bridge is part of an urban regeneration project aimed at stitching a long-neglected area back to the heart of the city. Walk across it at sunset: the cables slice the light into fine lines and, to the south, the view opens onto the hills of the Crati valley.`,
    },
    curiosities: [
      {
        it: "Con la sua antenna oltre i 100 metri è indicato come il secondo ponte strallato più alto d'Europa.",
        en: "With its mast of more than 100 metres it is described as the second-tallest cable-stayed bridge in Europe.",
      },
      {
        it: "Il nome ufficiale omaggia San Francesco di Paola, il santo calabrese patrono della regione.",
        en: "Its official name honours Saint Francis of Paola, the Calabrian saint who is patron of the region.",
      },
      {
        it: "Il progetto preliminare, approvato nel 2005, prevedeva una spesa di 15 milioni di euro.",
        en: "The preliminary design, approved in 2005, was budgeted at 15 million euros.",
      },
    ],
    lat: 39.298194,
    lng: 16.260694,
    coordsSource: "wikidata Q60839296",
    coordsVerified: true,
    geofenceRadiusM: 80,
    address: "Ponte San Francesco di Paola, quartiere Gergeri, 87100 Cosenza CS",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Il ponte ha percorsi pedonali; verificare sul posto pendenze e accessi dalle due sponde.",
        en: "The bridge has pedestrian walkways; check slopes and access points from both banks on site.",
      },
    },
    images: ["ponte-calatrava-1", "ponte-calatrava-2"],
    streetview: {
      lat: 39.2983,
      lng: 16.2586,
      heading: 95,
      pitch: 10,
      hotspots: [
        {
          heading: 100,
          pitch: 35,
          label: { it: "L'antenna inclinata", en: "The inclined mast" },
          text: {
            it: "Alta oltre 100 metri e inclinata di 52 gradi, pesa circa 800 tonnellate: fu sollevata il 23 luglio 2017.",
            en: "Over 100 metres tall and tilted at 52 degrees, it weighs about 800 tonnes: it was raised on 23 July 2017.",
          },
        },
        {
          heading: 80,
          pitch: 5,
          label: { it: "L'arpa di cavi", en: "The harp of cables" },
          text: {
            it: "Gli stralli divergenti sostengono l'impalcato lungo 103 metri e largo 24 che scavalca il Crati e la ferrovia.",
            en: "The fanned stays support the 103-metre-long, 24-metre-wide deck crossing the Crati and the railway.",
          },
        },
      ],
    },
    ar: {
      headline: {
        it: "Ponte San Francesco di Paola – Santiago Calatrava, 2018",
        en: "San Francesco di Paola Bridge – Santiago Calatrava, 2018",
      },
      timeline: [
        { year: "2000", text: { it: "Santiago Calatrava presenta il progetto del ponte.", en: "Santiago Calatrava presents the bridge design." } },
        { year: "2005", text: { it: "Approvato il progetto preliminare, per 15 milioni di euro.", en: "The preliminary design is approved, budgeted at 15 million euros." } },
        { year: "2008", text: { it: "Il 10 ottobre iniziano i lavori.", en: "Works begin on 10 October." } },
        { year: "2017", text: { it: "Il 23 luglio viene sollevata l'antenna: oltre 100 metri, inclinata di 52°.", en: "On 23 July the mast is raised: over 100 metres, tilted at 52°." } },
        { year: "2018", text: { it: "Il 26 gennaio il ponte viene inaugurato.", en: "The bridge opens on 26 January." } },
      ],
    },
  },
  {
    slug: "planetario",
    name: { it: "Planetario \"Giovan Battista Amico\"", en: "\"Giovan Battista Amico\" Planetarium" },
    category: "scienza",
    summary: {
      it: "Una cupola di 15 metri e un proiettore ottico Zeiss: il planetario di Cosenza, inaugurato nel 2019, porta il cielo in città.",
      en: "A 15-metre dome and a Zeiss optical projector: Cosenza's planetarium, opened in 2019, brings the sky into the city.",
    },
    body: {
      it: `A pochi passi dal Ponte di Calatrava, nel quartiere di Gergeri, un edificio di vetro e acciaio custodisce un cielo artificiale. È il Planetario di Cosenza, inaugurato nell'aprile 2019 e intitolato a Giovan Battista Amico.

Entri, ti siedi su una delle 113 poltrone reclinabili e girevoli, le luci si spengono. Sopra di te la cupola, con un diametro di 15 metri, una delle più grandi d'Italia, si riempie di stelle. A proiettarle è uno Starmaster ZMP della Zeiss, un proiettore ottico capace di riprodurre migliaia di stelle, affiancato da sei proiettori digitali che possono lavorare insieme per gli spettacoli a tutta cupola.

Il nome è un omaggio a un cosentino quasi dimenticato. Giovan Battista Amico, nato a Cosenza nel 1512, studiò a Padova e nel 1536 pubblicò a Venezia un trattato sui moti dei corpi celesti che proponeva di spiegarli con un sistema di sfere omocentriche, alternativo a quello di Tolomeo. Morì assassinato a Padova nel 1538, a soli ventisei anni.

Oggi il planetario ospita spettacoli, lezioni per le scuole e serate divulgative. È il luogo ideale per chiudere una giornata nella città nuova: dopo le sculture di Corso Mazzini e l'arpa d'acciaio del ponte, alzi lo sguardo verso l'opera più antica di tutte.`,
      en: `A few steps from the Calatrava Bridge, in the Gergeri district, a building of glass and steel holds an artificial sky. This is the Cosenza Planetarium, opened in April 2019 and named after Giovan Battista Amico.

You walk in, settle into one of 113 reclining, swivelling seats, and the lights go down. Above you the dome, 15 metres across and one of the largest in Italy, fills with stars. They are projected by a Zeiss Starmaster ZMP, an optical projector able to reproduce thousands of stars, supported by six digital projectors that can work together for full-dome shows.

The name honours an almost forgotten son of Cosenza. Giovan Battista Amico, born in Cosenza in 1512, studied in Padua and in 1536 published in Venice a treatise on the motions of the heavenly bodies, which set out to explain them with a system of homocentric spheres as an alternative to Ptolemy's model. He was murdered in Padua in 1538, aged just twenty-six.

Today the planetarium hosts shows, school lessons and public science evenings. It is the perfect place to end a day in the new town: after the sculptures of Corso Mazzini and the steel harp of the bridge, you look up at the oldest work of art of all.`,
    },
    curiosities: [
      {
        it: "Alla sua apertura la cupola da 15 metri era indicata come la seconda d'Italia per dimensioni, dopo quella del Planetario di Milano.",
        en: "When it opened, its 15-metre dome was described as the second largest in Italy, after the Milan Planetarium.",
      },
      {
        it: "Il trattato di Amico si intitola De motibus corporum coelestium iuxta principia peripatetica (Venezia, 1536).",
        en: "Amico's treatise is titled De motibus corporum coelestium iuxta principia peripatetica (Venice, 1536).",
      },
    ],
    lat: 39.2969141,
    lng: 16.262414,
    coordsSource: "osm way/1083555627 (amenity=planetarium)",
    coordsVerified: true,
    geofenceRadiusM: 50,
    address: "Via Sant'Antonio dell'Orto, quartiere Gergeri, 87100 Cosenza CS",
    openingHours: {
      it: "Spettacoli e visite su prenotazione secondo calendario: verificare orari sui canali ufficiali del Comune.",
      en: "Shows and visits by booking according to the programme: check times on the City's official channels.",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "Informazioni sull'accessibilità da verificare al momento della prenotazione.",
        en: "Accessibility details to be confirmed when booking.",
      },
    },
    images: ["planetario-1"],
  },
];
