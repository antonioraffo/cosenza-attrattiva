import type { SeedPlace } from "../types";

/**
 * Luoghi del centro storico di Cosenza (colle Pancrazio, piazza XV Marzo, confluenza Crati–Busento).
 * Coordinate verificate su OpenStreetMap (Overpass/Nominatim), confrontate con Wikidata (P625).
 * Fatti verificati su it.wikipedia.org (voci dei singoli luoghi e voce "Cosenza").
 */
export const places: SeedPlace[] = [
  // ─────────────────────────────────────────────────────────────── Duomo
  {
    slug: "duomo",
    name: {
      it: "Duomo di Cosenza – Cattedrale di Santa Maria Assunta",
      en: "Cosenza Cathedral – Santa Maria Assunta",
    },
    category: "chiesa",
    summary: {
      it: "La cattedrale consacrata nel 1222 alla presenza di Federico II, riconosciuta dall'UNESCO come patrimonio testimone di una cultura di pace.",
      en: "The cathedral consecrated in 1222 in the presence of Frederick II, recognised by UNESCO as a heritage “Messenger of a Culture of Peace”.",
    },
    body: {
      it: `Lungo la salita di Corso Telesio la città vecchia si apre all'improvviso su piazza Duomo, e davanti a te compare la facciata in pietra con i suoi tre portali e tre rosoni. È il cuore spirituale di Cosenza: una chiesa più antica, dell'XI secolo, fu quasi rasa al suolo dal terremoto del 1184, e la nuova cattedrale venne solennemente consacrata il *30 gennaio 1222*, alla presenza dell'imperatore Federico II di Svevia, che per l'occasione donò alla città la preziosa Stauroteca oggi custodita nel vicino Museo diocesano.

Nei secoli il Duomo ha cambiato più volte veste: dal 1748 fu ricoperto da sovrastrutture barocche, nell'Ottocento ricevette una facciata neogotica, poi i restauri completati nel Novecento gli hanno restituito le sobrie linee medievali. Sopra il presbiterio svetta il tiburio neogotico disegnato a fine Ottocento da Giuseppe Pisanti, visibile dai colli intorno.

Dentro, tre navate scandite da pilastri accompagnano lo sguardo verso l'abside. Nella cappella della *Madonna del Pilerio* è venerata l'icona bizantina del XII secolo della patrona della città; nel transetto sinistro riposa, in un sepolcro gotico, la regina di Francia Isabella d'Aragona, mentre nella navata destra un sarcofago di età ellenistica con la caccia di Meleagro è legato alla memoria di Enrico VII di Hohenstaufen. Il 12 ottobre 2011 l'UNESCO l'ha riconosciuta patrimonio testimone di una cultura di pace.`,
      en: `Climb Corso Telesio and the old town suddenly opens onto Piazza Duomo, where the stone façade rises before you with three portals and three rose windows. This is the spiritual heart of Cosenza. An older, eleventh-century church was all but flattened by the earthquake of 1184, and the new cathedral was solemnly consecrated on *30 January 1222* in the presence of Emperor Frederick II, who marked the occasion by giving the city a precious reliquary cross, the Stauroteca, now in the nearby Diocesan Museum.

Over the centuries the cathedral has changed its clothes more than once. From 1748 it was smothered in Baroque additions; in the nineteenth century it was given a neo-Gothic front; then restoration work completed in the twentieth century brought back its plain medieval lines. Above the sanctuary stands the neo-Gothic lantern tower designed by Giuseppe Pisanti in the late 1800s, visible from the surrounding hills.

Inside, three aisles divided by piers lead the eye to the apse. The chapel of the *Madonna del Pilerio* holds the twelfth-century Byzantine icon of the city's patron; in the left transept lies Isabella of Aragon, Queen of France, in a Gothic tomb, while a Hellenistic sarcophagus carved with Meleager's boar hunt in the right aisle is linked to Henry VII of Hohenstaufen. On 12 October 2011 UNESCO recognised the cathedral as a heritage “Messenger of a Culture of Peace”.`,
    },
    curiosities: [
      {
        it: "Durante i rifacimenti del XVIII e XIX secolo andarono perdute le sepolture di Luigi III d'Angiò (morto nel 1434) e del filosofo Bernardino Telesio (morto nel 1588).",
        en: "During the eighteenth- and nineteenth-century remodelling, the tombs of Louis III of Anjou (d. 1434) and of the philosopher Bernardino Telesio (d. 1588) were lost.",
      },
      {
        it: "I fratelli Attilio ed Emilio Bandiera furono sepolti inizialmente in una cappella del Duomo; nel 1867 i loro resti furono traslati a Venezia, loro città natale.",
        en: "The Bandiera brothers, Attilio and Emilio, were first buried in a chapel of the cathedral; in 1867 their remains were moved to their home city of Venice.",
      },
      {
        it: "Papa Giovanni Paolo II visitò la cattedrale e venerò l'icona della Madonna del Pilerio il 6 ottobre 1984.",
        en: "Pope John Paul II visited the cathedral and venerated the icon of the Madonna del Pilerio on 6 October 1984.",
      },
    ],
    lat: 39.288838,
    lng: 16.260228,
    coordsSource: "osm way/120661948 (= wikidata Q2942650)",
    coordsVerified: true,
    geofenceRadiusM: 40,
    address: "Piazza Duomo, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "All'ingresso principale si accede da un'ampia scalinata sulla piazza. Il centro storico è in forte pendenza, con selciato irregolare: informarsi in loco su eventuali accessi alternativi.",
        en: "The main entrance is reached by a wide flight of steps from the square. The old town is steep with uneven cobblestones: ask on site about alternative access.",
      },
    },
    images: ["duomo-1", "duomo-2", "duomo-3"],
    historic: {
      media: "duomo-storica",
      year: "1900 ca.",
      caption: {
        it: "La facciata intorno al 1900, ancora rivestita dalle forme neogotiche ottocentesche, poi rimosse dai restauri che hanno riportato alla luce la pietra medievale.",
        en: "The façade around 1900, still dressed in its nineteenth-century neo-Gothic forms, later removed by the restoration that revealed the medieval stone.",
      },
    },
    streetview: {
      lat: 39.28903,
      lng: 16.25985,
      heading: 123,
      pitch: 8,
      hotspots: [
        {
          heading: 123,
          pitch: 4,
          label: { it: "La facciata a salienti", en: "The stepped façade" },
          text: {
            it: "Quattro pilastri dividono la facciata in tre parti, che corrispondono alle tre navate interne; il portale centrale è il più grande.",
            en: "Four piers divide the façade into three parts, matching the three aisles inside; the central portal is the largest.",
          },
        },
        {
          heading: 123,
          pitch: 22,
          label: { it: "Il grande rosone", en: "The great rose window" },
          text: {
            it: "Sopra ogni portale si apre un rosone: due di media grandezza ai lati e uno, più grande, sopra l'ingresso principale.",
            en: "A rose window opens above each portal: two medium-sized ones at the sides and a larger one over the main entrance.",
          },
        },
        {
          heading: 135,
          pitch: -12,
          label: { it: "La scalinata sulla piazza", en: "The steps onto the square" },
          text: {
            it: "Una larga gradinata collega il basamento della chiesa a piazza Duomo, un tempo detta anche piazza Grande e piazza degli speziali.",
            en: "A broad flight of steps links the church to Piazza Duomo, once also called Piazza Grande and the apothecaries' square.",
          },
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────── Piazza XV Marzo
  {
    slug: "piazza-xv-marzo",
    name: { it: "Piazza XV Marzo (Piazza Prefettura)", en: "Piazza XV Marzo (Piazza Prefettura)" },
    category: "piazza",
    summary: {
      it: "Il grande salotto della città vecchia, tra il Palazzo del Governo, il Teatro Rendano, l'Accademia Cosentina e il verde della Villa Vecchia.",
      en: "The old town's grand drawing room, framed by Palazzo del Governo, the Teatro Rendano, the Accademia Cosentina and the green Villa Vecchia.",
    },
    body: {
      it: `Dopo i vicoli stretti di Corso Telesio, piazza XV Marzo è una boccata d'aria: un ampio selciato in cima alla città vecchia, con gli alberi della Villa Vecchia da una parte e le facciate color pastello dall'altra. I cosentini la chiamano ancora *piazza Prefettura*, ma il suo nome ufficiale ricorda i moti del 15 marzo 1844, quando molti insorti morirono nel tentato assalto al palazzo dell'Intendenza borbonica.

Quel palazzo è oggi il Palazzo del Governo, sede della Provincia: un edificio neoclassico che assunse l'aspetto attuale negli anni Quaranta dell'Ottocento, sulle strutture del monastero di Santa Maria di Costantinopoli. Al piano terra il bugnato richiama i palazzi nobiliari del Cinquecento; all'interno, la Sala Consiliare conserva gli affreschi dei fratelli Enrico e Federico Andreotti, giunti da Firenze nel 1879 per la visita di Umberto I e Margherita di Savoia.

Intorno, la piazza raccoglie i luoghi della cultura cittadina: il Teatro Rendano, l'edificio dell'Accademia Cosentina con la Biblioteca Civica, l'ingresso della Villa Vecchia. Al centro, il bronzo di *Bernardino Telesio* realizzato da Achille Orsi nel 1914 veglia sul via vai, mentre poco distante la statua dedicata ai protagonisti dei moti del 1844 tiene alta la bandiera. Sali qui al tramonto, quando la luce accende il rosa del teatro.`,
      en: `After the narrow lanes of Corso Telesio, Piazza XV Marzo feels like a deep breath: a broad paved square at the top of the old town, with the trees of the Villa Vecchia on one side and pastel façades on the other. Locals still call it *Piazza Prefettura*, but its official name recalls the uprising of 15 March 1844, when many rebels died in a failed assault on the Bourbon governor's palace.

That building is now the Palazzo del Governo, seat of the Province: a neoclassical palace that took on its present look in the 1840s, built over the former convent of Santa Maria di Costantinopoli. Its rusticated ground floor nods to sixteenth-century noble palazzi, and inside, the council chamber keeps frescoes by the brothers Enrico and Federico Andreotti, who came from Florence in 1879 for the visit of King Umberto I and Queen Margherita.

All around, the square gathers the city's cultural landmarks: the Teatro Rendano, the Accademia Cosentina and Civic Library building, the gateway to the Villa Vecchia. In the middle, Achille Orsi's 1914 bronze of the philosopher *Bernardino Telesio* watches the comings and goings, while nearby a statue honouring the heroes of 1844 raises its flag. Come up at sunset, when the light sets the theatre's pink façade glowing.`,
    },
    curiosities: [
      {
        it: "Il centro storico è servito da scale mobili e tapis-roulant che collegano il quartiere dello Spirito Santo direttamente a piazza XV Marzo.",
        en: "Escalators and moving walkways link the Spirito Santo quarter directly to Piazza XV Marzo.",
      },
      {
        it: "Il monumento ai moti del 1844 fu voluto dallo scultore Giuseppe Pacchioni, uno dei superstiti del gruppo dei fratelli Bandiera.",
        en: "The monument to the 1844 uprising was the work of sculptor Giuseppe Pacchioni, himself a survivor of the Bandiera brothers' expedition.",
      },
      {
        it: "Sul piedistallo in granito della Sila del monumento a Telesio, i bassorilievi raccontano l'arresto del filosofo da giovane e il suo insegnamento.",
        en: "On the Sila-granite base of the Telesio monument, reliefs show the philosopher's arrest as a young man and his teaching.",
      },
    ],
    lat: 39.286534,
    lng: 16.261837,
    coordsSource: "osm way/1234748387",
    coordsVerified: true,
    geofenceRadiusM: 60,
    address: "Piazza XV Marzo, 87100 Cosenza",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "La piazza è ampia e quasi pianeggiante, con pavimentazione in pietra. Dallo Spirito Santo si sale con scale mobili e tapis-roulant; a piedi da Corso Telesio la salita è ripida e acciottolata.",
        en: "The square is wide and almost level, paved in stone. Escalators and moving walkways climb up from Spirito Santo; on foot from Corso Telesio the approach is steep and cobbled.",
      },
    },
    images: ["piazza-xv-marzo-1", "piazza-xv-marzo-2", "piazza-xv-marzo-3"],
    historic: {
      media: "piazza-xv-marzo-storica",
      year: "1897",
      caption: {
        it: "La statua della Libertà in memoria dei fratelli Bandiera e compagni, in una xilografia pubblicata da «Le cento città d'Italia».",
        en: "The Statue of Liberty honouring the Bandiera brothers and their comrades, in a woodcut published by “Le cento città d'Italia”.",
      },
    },
  },

  // ───────────────────────────────────────────────── Accademia Cosentina
  {
    slug: "accademia-cosentina",
    name: {
      it: "Accademia Cosentina e Biblioteca Civica",
      en: "Accademia Cosentina and Civic Library",
    },
    category: "architettura",
    summary: {
      it: "Fondata nel 1511 da Aulo Giano Parrasio, è tra le più antiche accademie d'Europa; nel suo palazzo vive la Biblioteca Civica con 53 incunaboli.",
      en: "Founded in 1511 by Aulo Giano Parrasio, it is among Europe's oldest academies; its building houses the Civic Library and 53 incunabula.",
    },
    body: {
      it: `Se Cosenza è chiamata *l'Atene della Calabria*, il merito è anche di questo edificio affacciato su piazza XV Marzo, accanto al Teatro Rendano. Qui ha sede l'Accademia Cosentina, fondata nel 1511 dall'umanista Aulo Giano Parrasio: la seconda del Regno di Napoli e una delle prime d'Europa, nata come *Accademia Parrasiana* per gli studi filosofici e letterari.

Dopo la morte di Parrasio, nel 1534, fu Bernardino Telesio a riorganizzarla, e più tardi Sertorio Quattromani le diede il nome che porta ancora oggi. La sua storia è fatta di chiusure e rinascite: intorno al 1593, dopo la congiura di Tommaso Campanella, venne chiusa per decreto, per poi rivivere sotto nomi diversi – dei Costanti, dei Negligenti, dei Pescatori Cratilidi.

Nel 1871 fu proprio l'Accademia a istituire la Biblioteca Civica, che dopo anni difficili riaprì nel 1898 e a metà degli anni Trenta si trasferì nell'edificio costruito apposta dal Comune, lo stesso che vedi oggi. Tra i suoi tesori ci sono 53 incunaboli, corali miniati del Cinquecento, un fondo di 54 pergamene datate tra il 1291 e il 1741 e la preziosa raccolta dedicata al letterato cosentino Francesco Saverio Salfi. Dietro la facciata, insomma, batte ancora la memoria intellettuale della città.`,
      en: `If Cosenza is nicknamed *the Athens of Calabria*, part of the credit goes to this building on Piazza XV Marzo, beside the Teatro Rendano. It is home to the Accademia Cosentina, founded in 1511 by the humanist Aulo Giano Parrasio: the second academy in the Kingdom of Naples and one of the first in Europe, born as the *Accademia Parrasiana* and devoted to philosophy and letters.

After Parrasio's death in 1534, Bernardino Telesio reorganised it, and later Sertorio Quattromani gave it the name it still bears. Its story is one of closures and revivals: around 1593, in the wake of Tommaso Campanella's conspiracy, it was shut down by decree, only to return under a string of other names – the Costanti, the Negligenti, the Pescatori Cratilidi.

In 1871 the Academy founded the Civic Library, which after some lean years reopened in 1898 and in the mid-1930s moved into a purpose-built municipal building – the one you see today. Its treasures include 53 incunabula, illuminated sixteenth-century choir books, a collection of 54 parchments dated between 1291 and 1741, and the prized collection dedicated to the Cosenza-born writer Francesco Saverio Salfi. Behind the façade, the city's intellectual memory is still very much alive.`,
    },
    curiosities: [
      {
        it: "Francesco Bacone definì Bernardino Telesio, animatore dell'Accademia dopo Parrasio, «il primo degli uomini nuovi».",
        en: "Francis Bacon called Bernardino Telesio, who led the Academy after Parrasio, “the first of the moderns” (primus novorum hominum).",
      },
      {
        it: "Ancora oggi la Biblioteca Civica fa parte integrante dell'Accademia, con cui condivide lo stesso presidente.",
        en: "The Civic Library is still an integral part of the Academy, and the two share the same president.",
      },
      {
        it: "Durante la seconda guerra mondiale andò in gran parte distrutto il fondo Zumbini, circa tremila tra libri e opuscoli.",
        en: "The Zumbini collection, some three thousand books and pamphlets, was largely destroyed by air raids during the Second World War.",
      },
    ],
    lat: 39.286737,
    lng: 16.261403,
    coordsSource: "osm way/375114782",
    coordsVerified: true,
    geofenceRadiusM: 30,
    address: "Piazza XV Marzo, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "L'edificio si affaccia sulla piazza quasi pianeggiante; l'accessibilità degli interni non è verificata: informarsi presso la biblioteca.",
        en: "The building faces the nearly level square; step-free access to the interior has not been verified, so ask the library.",
      },
    },
    images: ["accademia-cosentina-1", "accademia-cosentina-2"],
  },

  // ───────────────────────────────────────────────────── Teatro Rendano
  {
    slug: "teatro-rendano",
    name: { it: "Teatro Alfonso Rendano", en: "Teatro Alfonso Rendano" },
    category: "teatro",
    summary: {
      it: "Inaugurato nel 1909 con l'Aida e ricostruito dopo le bombe del 1943, è l'unico Teatro di tradizione della Calabria.",
      en: "Opened in 1909 with Aida and rebuilt after the 1943 bombing, it is Calabria's only official “theatre of tradition”.",
    },
    body: {
      it: `Il portico ad archi e la facciata rosa e avorio del Teatro Rendano chiudono piazza XV Marzo come un sipario. La decisione di costruire un teatro comunale arrivò nel 1877, sull'area dove sorgeva un teatro provvisorio in legno, il *Baraccone*, e su progetto dell'ingegnere Nicola Zumpano. I lavori furono lenti e più volte sospesi, finché la sera del *20 novembre 1909* il sipario si alzò sull'Aida di Verdi, tra le polemiche per il lusso della serata.

Il sipario storico, dipinto nel 1901 da Paolo Vetri su disegno di Domenico Morelli, racconta l'arrivo festoso a Cosenza, nel 1433, di Luigi III d'Angiò e della giovane sposa Margherita di Savoia: è tra le poche parti originali sopravvissute. Nel 1943, infatti, una bomba destinata al vicino castello, sede della contraerea, colpì in pieno il teatro distruggendone il soffitto.

La ricostruzione, affidata all'architetto napoletano Ezio Gentile, iniziò nel 1953 e ricalcò quasi fedelmente lo schema originario; il 7 gennaio 1967 la città tornò a teatro con *La traviata*. Intitolato al pianista cosentino Alfonso Rendano, dal 1976 è riconosciuto Teatro di tradizione. Sul suo palco, nella sala a ferro di cavallo da circa 800 posti, sono passati Tito Schipa, Tito Gobbi, Raina Kabaivanska, ma anche Chet Baker e Dizzy Gillespie.`,
      en: `With its arcaded portico and pink-and-ivory front, the Teatro Rendano closes off Piazza XV Marzo like a stage curtain. The decision to build a municipal theatre came in 1877, on the site of a temporary wooden playhouse known as the *Baraccone*, to a design by engineer Nicola Zumpano. Work dragged on and stopped several times until, on the evening of *20 November 1909*, the curtain finally rose on Verdi's Aida – amid grumbling about the extravagance of the occasion.

The historic drop curtain, painted in 1901 by Paolo Vetri from a design by Domenico Morelli, shows the festive arrival in Cosenza, in 1433, of Louis III of Anjou and his young bride Margaret of Savoy. It is one of the few original features to survive: in 1943 a bomb meant for the nearby castle, then an anti-aircraft post, hit the theatre squarely and destroyed its ceiling.

Rebuilding, entrusted to the Neapolitan architect Ezio Gentile, began in 1953 and closely followed the original plan; on 7 January 1967 the city returned to its seats for *La traviata*. Named after the Cosenza-born pianist Alfonso Rendano and officially recognised as a theatre of tradition since 1976, its horseshoe auditorium of around 800 seats has welcomed Tito Schipa, Tito Gobbi and Raina Kabaivanska – and also Chet Baker and Dizzy Gillespie.`,
    },
    curiosities: [
      {
        it: "Durante la prima guerra mondiale, tra il 1916 e il 1920, il teatro fu temporaneamente adibito a caserma.",
        en: "During the First World War, between 1916 and 1920, the theatre was temporarily used as a barracks.",
      },
      {
        it: "Il soffitto originale, distrutto nel 1943, era decorato da Enrico Salfi con il trionfo di Venere su un carro trainato da colombe, circondata dalle Muse.",
        en: "The original ceiling, lost in 1943, was painted by Enrico Salfi with Venus triumphant in a dove-drawn chariot surrounded by the Muses.",
      },
    ],
    lat: 39.286207,
    lng: 16.261409,
    coordsSource: "osm way/120661956 (= wikidata Q3982339)",
    coordsVerified: true,
    geofenceRadiusM: 35,
    address: "Piazza XV Marzo, 87100 Cosenza",
    openingHours: {
      it: "Aperto in occasione degli spettacoli; orari variabili: verificare prima della visita",
      en: "Open for performances; hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "Il teatro si affaccia sulla piazza quasi pianeggiante; per l'accesso in sala con sedia a rotelle è consigliabile contattare la biglietteria.",
        en: "The theatre faces the nearly level square; wheelchair users should contact the box office about access to the auditorium.",
      },
    },
    images: ["teatro-rendano-1", "teatro-rendano-2", "teatro-rendano-3"],
    historic: {
      media: "teatro-rendano-storica",
      year: "1897",
      caption: {
        it: "Il «nuovo Teatro» in una xilografia pubblicata da «Le cento città d'Italia», anni prima dell'inaugurazione del 1909.",
        en: "The “new theatre” in a woodcut published by “Le cento città d'Italia”, years before its 1909 opening night.",
      },
    },
  },

  // ─────────────────────────────────────────────────────── Villa Vecchia
  {
    slug: "villa-vecchia",
    name: { it: "Villa Vecchia", en: "Villa Vecchia" },
    category: "parco",
    summary: {
      it: "Circa 30.000 m² di verde a terrazze tra piazza XV Marzo e lo Spirito Santo, con lecci, platani e la fontana della Venere.",
      en: "Around 30,000 m² of terraced green between Piazza XV Marzo and Spirito Santo, with holm oaks, plane trees and the Venus fountain.",
    },
    body: {
      it: `Dietro il Teatro Rendano la città vecchia rallenta e si fa ombra: è la Villa Vecchia, il giardino storico dei cosentini. Nasce sui luoghi di un giardino del Seicento annesso al monastero di Santa Maria di Costantinopoli – lo stesso su cui sorge il Palazzo del Governo – e scende a terrazze per circa 30.000 metri quadrati verso le pendici del colle Guarassano e il rione dello Spirito Santo.

Il suo asse è viale Guicciardi, tracciato nel 1870: nel primo tratto è accompagnato da un doppio filare di *lecci*, più avanti da una fila di platani. Intorno crescono acacie, pioppi, querce, palme e ippocastani, e tra un livello e l'altro si scoprono scalinate, panchine e piccoli slarghi. Nel 1878 il Comune vi fece realizzare un'area circolare pensata come anfiteatro; all'inizio del Novecento arrivarono il gazebo e la vasca della *Venere*, e nel 1932 l'ingresso monumentale di via Petrarca.

L'ingresso principale si apre proprio davanti al teatro, ed è il modo migliore per entrare: dal selciato assolato della piazza passi in pochi metri al fresco degli alberi. D'estate è il rifugio perfetto dopo la salita del centro storico; in autunno i viali si riempiono di foglie e di luce obliqua.`,
      en: `Behind the Teatro Rendano the old town slows down and turns shady: this is the Villa Vecchia, Cosenza's historic public garden. It grew on the site of a seventeenth-century garden belonging to the convent of Santa Maria di Costantinopoli – the same convent later rebuilt as the Palazzo del Governo – and steps down in terraces over some 30,000 square metres towards the slopes of Guarassano hill and the Spirito Santo quarter.

Its backbone is Viale Guicciardi, laid out in 1870: a double row of *holm oaks* lines the first stretch, plane trees the last. Around them grow acacias, poplars, oaks, palms and horse chestnuts, and between the levels you stumble on flights of steps, benches and small clearings. In 1878 the city added a circular space intended as an amphitheatre; the early twentieth century brought the bandstand and the *Venus* fountain, and in 1932 came the monumental entrance on Via Petrarca.

The main entrance opens right in front of the theatre, and it's the best way in: within a few steps you go from the sun-baked paving of the square to the cool of the trees. In summer it is the perfect refuge after the climb through the old town; in autumn the avenues fill with fallen leaves and slanting light.`,
    },
    curiosities: [
      {
        it: "Il giardino si sviluppa tra i 275 e i 240 metri di quota: un dislivello che spiega le tante scalinate tra un terrazzamento e l'altro.",
        en: "The garden spans altitudes from 275 down to 240 metres – which explains the many flights of steps between its terraces.",
      },
      {
        it: "La fontana della Venere fu inaugurata all'inizio del Novecento, insieme al gazebo che ancora oggi caratterizza il parco.",
        en: "The Venus fountain was unveiled in the early twentieth century, along with the bandstand that still defines the park.",
      },
    ],
    lat: 39.285786,
    lng: 16.263024,
    coordsSource: "osm way/128149956 (nominatim)",
    coordsVerified: true,
    geofenceRadiusM: 80,
    address: "Piazza XV Marzo / Via Petrarca, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "L'ingresso da piazza XV Marzo è in piano, ma il parco è su più livelli collegati da scalinate e viali in pendenza; i vialetti sono in parte sterrati.",
        en: "The entrance from Piazza XV Marzo is level, but the park is spread over several levels linked by steps and sloping paths, some of them unpaved.",
      },
    },
    images: ["villa-vecchia-1", "villa-vecchia-2", "villa-vecchia-3"],
  },

  // ─────────────────────────────────────────────────────── Corso Telesio
  {
    slug: "corso-telesio",
    name: { it: "Corso Telesio", en: "Corso Telesio" },
    category: "strada",
    summary: {
      it: "La strada tortuosa e in salita che attraversa tutto il centro storico, dalla confluenza dei fiumi al Duomo e a piazza XV Marzo.",
      en: "The winding, uphill street that runs the whole length of the old town, from the river confluence past the cathedral to Piazza XV Marzo.",
    },
    body: {
      it: `Corso Telesio non si percorre: si scala. Tortuoso e in pendenza, attraversa interamente il centro storico, dal basso, vicino alla confluenza tra Crati e Busento, fino alla sommità di piazza XV Marzo. È la spina dorsale della Cosenza antica, e porta il nome del suo figlio più illustre, il filosofo Bernardino Telesio.

Fino al 1898 il primo tratto, fino a piazza Piccola, era noto come *strada dei mercanti e degli orefici*, per le tante botteghe artigiane e i piccoli commerci che lo animavano. Ancora oggi, salendo, si incontrano portali in pietra, cortili che si intravedono oltre i portoni, balconi in ferro battuto e scalinate laterali che si arrampicano verso i rioni alti.

Lungo il percorso il corso si allarga in slarghi e piazzette che sono vere tappe: piazza Piccola, un tempo detta *dei Pesci* per il mercato del pesce, circondata da scalinate e palazzi; poi piazza Duomo, con la facciata della cattedrale; lungo il corso affaccia anche il palazzo della Cassa di Risparmio, inaugurato nel 1910; e infine l'apertura luminosa di piazza XV Marzo. Prenditela con calma, fermati a guardare indietro: a ogni curva il centro storico cambia prospettiva, e tra i tetti compaiono le colline e il castello.`,
      en: `You don't so much walk Corso Telesio as climb it. Winding and steep, it crosses the entire old town, from the lower end near the meeting of the Crati and Busento rivers right up to Piazza XV Marzo at the top. It is the backbone of old Cosenza, named after the city's most famous son, the philosopher Bernardino Telesio.

Until 1898 the first stretch, as far as Piazza Piccola, was known as the *street of merchants and goldsmiths*, for the many craft workshops and small traders that filled it. As you climb you still pass stone doorways, courtyards glimpsed through half-open gates, wrought-iron balconies and side stairways scrambling up to the higher quarters.

Along the way the street widens into squares that act as natural stopping points: Piazza Piccola, once called *Piazza dei Pesci* for its fish market, ringed by stairways and palazzi; then Piazza Duomo, with the cathedral façade; the street also passes the Cassa di Risparmio building, opened in 1910; and finally the bright open space of Piazza XV Marzo. Take your time and look back now and then: at every bend the old town shifts perspective, and the hills and the castle appear between the rooftops.`,
    },
    curiosities: [
      {
        it: "Piazza Piccola era detta anche «delle chianche», dalle panche su cui i macellai lavoravano e vendevano la carne.",
        en: "Piazza Piccola was also called “delle chianche”, after the benches on which butchers cut and sold their meat.",
      },
      {
        it: "Nel 1799 in piazza Piccola venne piantato uno degli «alberi della libertà» della Repubblica napoletana.",
        en: "In 1799 one of the Neapolitan Republic's “liberty trees” was planted in Piazza Piccola.",
      },
    ],
    lat: 39.289385,
    lng: 16.260009,
    coordsSource: "osm way/120661946 (tratto centrale di Corso Bernardino Telesio)",
    coordsVerified: true,
    geofenceRadiusM: 80,
    address: "Corso Bernardino Telesio, 87100 Cosenza",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: false,
      notes: {
        it: "Strada ripida con pavimentazione in pietra irregolare e tratti stretti; alcune deviazioni laterali sono solo a gradini. Scarpe comode consigliate; difficile con sedia a rotelle o passeggino.",
        en: "A steep street with uneven stone paving and narrow sections; some side routes are stairs only. Comfortable shoes recommended; hard going with a wheelchair or pushchair.",
      },
    },
    images: ["corso-telesio-1", "corso-telesio-2", "corso-telesio-3"],
  },

  // ─────────────────────────────────────────────────────── Palazzo Arnone
  {
    slug: "palazzo-arnone",
    name: {
      it: "Galleria Nazionale di Cosenza – Palazzo Arnone",
      en: "Galleria Nazionale di Cosenza – Palazzo Arnone",
    },
    category: "museo",
    summary: {
      it: "Un palazzo cinquecentesco che fu tribunale e carcere, oggi galleria con Mattia Preti, Luca Giordano e i disegni di Umberto Boccioni.",
      en: "A sixteenth-century palace that served as court and prison, now a gallery with Mattia Preti, Luca Giordano and drawings by Umberto Boccioni.",
    },
    body: {
      it: `Sul colle Triglio, di fronte al centro storico oltre il Crati, la lunga facciata di Palazzo Arnone domina la città. La sua costruzione fu avviata da Bartolo e Ascanio Arnone all'inizio del XVI secolo, ma l'edificio passò allo Stato prima ancora di essere completato. Da allora ha avuto molte vite: residenza dei presidi della Calabria Citeriore, sede del Tribunale e della Regia Udienza, carcere.

Due incendi, nel 1734 dopo un tumulto popolare e nel 1747 dopo un tentativo di fuga delle detenute, lo resero per un periodo inagibile; nel 1758 fu rinforzato con quattro bastioni angolari, e il terremoto del 1854 ne fece crollare il terzo piano, mai più ricostruito. Nel grande androne voltato si vede ancora lo stemma seicentesco del Reame di Spagna.

Passato al Ministero negli anni Ottanta del Novecento, è oggi sede della *Galleria Nazionale di Cosenza*, istituita ufficialmente nel 2009. Il percorso attraversa l'arte soprattutto meridionale dal Trecento a oggi: tele di Mattia Preti e Luca Giordano, opere di Ribera e Massimo Stanzione, una collezione in comodato da Intesa Sanpaolo e un prezioso nucleo di 65 disegni e incisioni di *Umberto Boccioni*, dagli anni della formazione al Futurismo. Tra le sculture moderne c'è anche un esemplare delle sue *Forme uniche della continuità nello spazio*.`,
      en: `On Triglio hill, facing the old town across the Crati, the long façade of Palazzo Arnone looks out over the city. Work on it was begun by Bartolo and Ascanio Arnone in the early sixteenth century, but the building passed to the state before it was even finished. Since then it has lived many lives: residence of the governors of Calabria Citeriore, seat of the law courts and the royal tribunal, and prison.

Two fires – in 1734 after a popular riot, and in 1747 after an escape attempt by women prisoners – put it out of use for a while; in 1758 it was strengthened with four corner bastions, and the earthquake of 1854 brought down its third floor, never rebuilt. In the great vaulted entrance hall you can still see the seventeenth-century coat of arms of the Spanish crown.

Handed to the Ministry of Culture in the 1980s, it now houses the *Galleria Nazionale di Cosenza*, formally established in 2009. The collection traces mainly southern Italian art from the fourteenth century to the present: canvases by Mattia Preti and Luca Giordano, works by Ribera and Massimo Stanzione, a collection on loan from Intesa Sanpaolo, and a precious group of 65 drawings and prints by *Umberto Boccioni*, from his student years to Futurism. Among the modern sculptures is a cast of his *Unique Forms of Continuity in Space*.`,
    },
    curiosities: [
      {
        it: "I disegni e le incisioni di Boccioni conservati qui furono esposti nel 1961 al Museum of Modern Art di New York, nella mostra «The Graphic Work of Umberto Boccioni».",
        en: "The Boccioni drawings and prints kept here were shown in 1961 at New York's Museum of Modern Art in “The Graphic Work of Umberto Boccioni”.",
      },
      {
        it: "Il palazzo ospita anche il Nucleo di Cosenza dei Carabinieri per la Tutela del Patrimonio Culturale.",
        en: "The palace is also home to the Cosenza unit of the Carabinieri for the Protection of Cultural Heritage.",
      },
    ],
    lat: 39.290959,
    lng: 16.261726,
    coordsSource: "osm way/305856774 (nominatim)",
    coordsVerified: true,
    geofenceRadiusM: 45,
    address: "Via Gian Vincenzo Gravina, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "Il palazzo sorge su un colle con accessi in salita; l'accessibilità interna non è verificata: contattare il museo prima della visita.",
        en: "The palace stands on a hill reached by uphill streets; interior accessibility has not been verified, so contact the museum before visiting.",
      },
    },
    images: ["palazzo-arnone-1", "palazzo-arnone-2", "palazzo-arnone-3"],
  },

  // ─────────────────────────────────────────── Museo dei Brettii e degli Enotri
  {
    slug: "museo-brettii-enotri",
    name: {
      it: "Museo dei Brettii e degli Enotri",
      en: "Museum of the Bruttians and Oenotrians",
    },
    category: "museo",
    summary: {
      it: "Nel complesso quattrocentesco di Sant'Agostino, il racconto dei popoli antichi della Calabria e di Cosenza capitale dei Brettii.",
      en: "In the fifteenth-century Sant'Agostino complex, the story of Calabria's ancient peoples and of Cosenza as capital of the Bruttians.",
    },
    body: {
      it: `Prima dei Romani, prima perfino dei Greci, la valle del Crati era la terra degli Enotri e poi dei *Brettii*, che dal 356 a.C. fecero di Cosenza la capitale della loro confederazione. Il museo che porta il loro nome racconta questa storia lontana negli ambienti del complesso monumentale di Sant'Agostino, del Quattrocento, dove è stato inaugurato il 17 ottobre 2009.

Il nucleo della collezione risale agli scavi del 1888, condotti per cercare l'antica Sibari: in quell'occasione tornarono alla luce la necropoli enotria di Torre del Mordillo e l'area sacra di Cozzo Michelicchio. Il percorso, ordinato per epoche, parte dai resti del Paleolitico superiore delle grotte di Cirella, attraversa i ricchi corredi funerari enotri – fibule, spade, cinturoni in bronzo – e il periodo della colonizzazione greca, fino alle sale dedicate ai Brettii e alla Cosenza romana, con epigrafi e un'importante collezione di monete.

Tra i pezzi più toccanti c'è una stele funeraria di età imperiale con l'iscrizione greca *«Ia, figlia di Demetrios, salve»*, rientrata al museo nel 2011 dopo un secolo. E il luogo stesso ha una storia: in epoca borbonica Sant'Agostino fu carcere, probabilmente l'ultima prigione dei fratelli Bandiera prima della fucilazione nel vicino Vallone di Rovito.`,
      en: `Before the Romans, before even the Greeks, the Crati valley belonged to the Oenotrians and then to the *Bruttians*, who from 356 BC made Cosenza the capital of their confederation. The museum named after them tells this distant story inside the fifteenth-century Sant'Agostino complex, where it opened on 17 October 2009.

The core of the collection goes back to excavations in 1888, carried out in search of ancient Sybaris, which uncovered the Oenotrian necropolis of Torre del Mordillo and the sacred area of Cozzo Michelicchio. Arranged chronologically, the galleries begin with Upper Palaeolithic remains from the caves of Cirella, move through rich Oenotrian grave goods – brooches, swords, bronze belts – and the age of Greek colonisation, and end with rooms devoted to the Bruttians and Roman Cosenza, with inscriptions and a substantial coin collection.

One of the most moving pieces is an imperial-age grave stele with a Greek inscription, *“Ia, daughter of Demetrios, farewell”*, which returned to the museum in 2011 after a century away. The building has its own story too: under the Bourbons Sant'Agostino was a prison, probably the last one to hold the Bandiera brothers before their execution in the nearby Vallone di Rovito.`,
    },
    curiosities: [
      {
        it: "Dal 1970 al 2003 il museo era allestito nel palazzo della Biblioteca Civica, in piazza XV Marzo.",
        en: "From 1970 to 2003 the museum was housed in the Civic Library building on Piazza XV Marzo.",
      },
      {
        it: "Una sezione è dedicata al Risorgimento cosentino, legata alla storia dello stesso complesso di Sant'Agostino come carcere borbonico.",
        en: "One section is devoted to Cosenza's Risorgimento, tied to the Sant'Agostino complex's own past as a Bourbon jail.",
      },
    ],
    lat: 39.289525,
    lng: 16.264164,
    coordsSource: "osm relation/19255873 (= wikidata Q3867894)",
    coordsVerified: true,
    geofenceRadiusM: 40,
    address: "Complesso monumentale di Sant'Agostino, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "L'ingresso della chiesa di Sant'Agostino è preceduto da una scalinata; l'accessibilità del percorso museale non è verificata: contattare il museo.",
        en: "The Sant'Agostino church front is approached by steps; accessibility of the museum route has not been verified, so contact the museum.",
      },
    },
    images: ["museo-brettii-enotri-1", "museo-brettii-enotri-2"],
  },

  // ─────────────────────────────────────────── San Francesco d'Assisi
  {
    slug: "san-francesco-assisi",
    name: { it: "Chiesa di San Francesco d'Assisi", en: "Church of San Francesco d'Assisi" },
    category: "chiesa",
    summary: {
      it: "Fondata nel 1217 nel quartiere della Giostra Vecchia, è con il suo convento il monumento religioso più importante della città dopo il Duomo.",
      en: "Founded in 1217 in the Giostra Vecchia quarter, with its convent it is the city's most important religious monument after the cathedral.",
    },
    body: {
      it: `Sali tra i vicoli della *Giostra Vecchia*, il quartiere che fu il cuore della Cosenza rinascimentale, e arrivi in piazza Marco Berardi, a 273 metri di quota: qui sorgono la chiesa e il convento di San Francesco d'Assisi. Le origini risalgono al 1217, appena pochi anni dopo la nascita dell'ordine francescano, e ne fanno uno dei luoghi di culto più antichi della città e, dopo il Duomo, il complesso religioso più importante.

La facciata è sobria, ma l'interno sorprende. La pianta è a croce latina con tre navate; al centro del presbiterio si alza l'imponente altare ligneo del Settecento, sormontato dal *Perdono d'Assisi* dipinto da Daniele Russo nel 1618. Nella navata sinistra trovi un crocifisso ligneo del Seicento e l'altare della Madonna della Febbre, con una statua marmorea cinquecentesca; a destra si apre la settecentesca cappella di Santa Caterina, dove si riuniva l'omonima confraternita.

Non perderti la sagrestia, con il soffitto in legno dipinto, un grande armadio intagliato con le storie della Passione e affreschi dell'inizio del Quattrocento. Il convento accanto ospita un laboratorio di restauro per i beni artistici e storici della Calabria e, nel chiostro, una raccolta di affreschi e sculture. Dall'alto, i suoi tetti di coppi si fondono con quelli della città vecchia.`,
      en: `Climb through the lanes of the *Giostra Vecchia*, the quarter that was the heart of Renaissance Cosenza, and you reach Piazza Marco Berardi, 273 metres up: here stand the church and convent of San Francesco d'Assisi. Its origins go back to 1217, only a few years after the Franciscan order was born, making it one of the city's oldest places of worship and, after the cathedral, its most important religious complex.

The façade is restrained, but the interior is full of surprises. The church has a Latin-cross plan with three aisles; at the centre of the sanctuary rises a towering eighteenth-century wooden altar, crowned by Daniele Russo's *Pardon of Assisi*, painted in 1618. In the left aisle there is a seventeenth-century wooden crucifix and the altar of the Madonna della Febbre with a sixteenth-century marble statue; on the right opens the eighteenth-century chapel of Saint Catherine, where her confraternity used to meet.

Don't miss the sacristy, with its painted wooden ceiling, a large cupboard carved with scenes of the Passion, and early fifteenth-century frescoes. The adjoining convent houses a conservation workshop for Calabria's artistic and historic heritage and, in the cloister, a collection of frescoes and sculpture. Seen from above, its tiled roofs melt into those of the old town.`,
    },
    curiosities: [
      {
        it: "La statua della Madonna della Febbre deriva da un modello conservato nella chiesa di San Domenico.",
        en: "The statue of the Madonna della Febbre is modelled on one kept in the church of San Domenico.",
      },
      {
        it: "Via Giostra Vecchia, poco distante, sorge nell'area della città romana e del più antico impianto bruzio, come hanno mostrato gli scavi dell'Ottocento.",
        en: "Nearby Via Giostra Vecchia lies within the area of the Roman town and the earliest Bruttian settlement, as nineteenth-century digs revealed.",
      },
    ],
    lat: 39.28993,
    lng: 16.258008,
    coordsSource: "osm relation/19271527 (= wikidata Q55138834)",
    coordsVerified: true,
    geofenceRadiusM: 35,
    address: "Piazza Marco Berardi, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "Si raggiunge con salite ripide e vicoli acciottolati del centro storico; l'accesso all'interno non è verificato.",
        en: "Reached via steep climbs and cobbled lanes in the old town; step-free access to the interior has not been verified.",
      },
    },
    images: ["san-francesco-assisi-1", "san-francesco-assisi-2"],
  },

  // ──────────────────────────────────────────────────────── San Domenico
  {
    slug: "san-domenico",
    name: { it: "Chiesa di San Domenico", en: "Church of San Domenico" },
    category: "chiesa",
    summary: {
      it: "La chiesa quattrocentesca dalla cupola barocca che fa da cerniera tra la città antica e la città nuova, sulla riva del Busento.",
      en: "The fifteenth-century church with a Baroque dome that hinges the old town to the new, on the bank of the Busento.",
    },
    body: {
      it: `Dove il centro storico finisce e comincia la città moderna, oltre il ponte sul Busento, la cupola di San Domenico si alza tra i cedri di piazza Tommaso Campanella. La chiesa fu edificata tra il 1441 e il 1468 per volontà della famiglia Sanseverino: nel 1448 Antonio Sanseverino cedette ai domenicani, presenti a Cosenza già dal Duecento, il proprio palazzo e i terreni accanto per costruire il nuovo complesso.

La facciata conserva il volto delle origini: il rosone formato da sedici colonnine disposte a raggiera e l'arco in tufo che incornicia il portale ligneo intagliato nel 1614 per la famiglia Cavalcanti. La cupola, con tamburo ottagonale e lanterna, fu eretta tra la fine del Seicento e l'inizio del Settecento; gli stucchi interni del napoletano Pascale Gesumaria furono completati nel 1758, e la copertura in rame è stata aggiunta dopo l'ultima guerra.

Dentro, la luce che scende dalla cupola fa vibrare gli stucchi tardobarocchi; il coro ligneo di 52 stalli, della prima metà del Seicento, è opera di Fabrizio Volpe. A destra si apre la *cappella del Rosario*, con il soffitto a lacunari e l'organo settecentesco. Nel convento, che nel 1588 ospitò il giovane Tommaso Campanella, attratto a Cosenza dal pensiero di Telesio, oggi trovano spazio il BoCs Art Museum e corsi universitari.`,
      en: `Where the old town ends and the modern city begins, just over the bridge on the Busento, the dome of San Domenico rises among the cedars of Piazza Tommaso Campanella. The church was built between 1441 and 1468 at the wish of the Sanseverino family: in 1448 Antonio Sanseverino handed his own palace and the adjoining land to the Dominicans, who had been in Cosenza since the thirteenth century, so they could build their new complex.

The façade keeps its original face: a rose window of sixteen slender columns arranged like spokes, and a tufa arch framing the wooden door carved in 1614 for the Cavalcanti family. The dome, with an octagonal drum and lantern, went up between the late seventeenth and early eighteenth centuries; the Neapolitan stuccoist Pascale Gesumaria finished the interior decoration in 1758, and the copper covering was added after the Second World War.

Inside, light falling from the dome makes the late-Baroque stucco shimmer; the 52-seat wooden choir from the early 1600s is the work of Fabrizio Volpe. To the right opens the *Rosary chapel*, with its coffered ceiling and eighteenth-century organ. The convent, which in 1588 hosted the young Tommaso Campanella, drawn to Cosenza by Telesio's ideas, now houses the BoCs Art Museum and university courses.`,
    },
    curiosities: [
      {
        it: "Il BoCs Art Museum raccoglie le opere di oltre 300 artisti italiani e internazionali ospitati nelle residenze artistiche «BoCs Art» tra il 2015 e il 2017.",
        en: "The BoCs Art Museum holds works by more than 300 Italian and international artists hosted in the “BoCs Art” residencies between 2015 and 2017.",
      },
      {
        it: "La cappella del Rosario risale al XIII–XIV secolo e fu concessa alla Congrega del Rosario solo nel 1630.",
        en: "The Rosary chapel dates from the thirteenth or fourteenth century and was granted to the Rosary confraternity only in 1630.",
      },
    ],
    lat: 39.292342,
    lng: 16.25806,
    coordsSource: "osm way/170658792 (= wikidata Q33100095)",
    coordsVerified: true,
    geofenceRadiusM: 40,
    address: "Piazza Tommaso Campanella, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "La chiesa è nella parte bassa e pianeggiante della città, raggiungibile da Corso Mazzini; una scalinata collega la piazza a via Sertorio Quattromani. Accessibilità interna non verificata.",
        en: "The church is in the flat, lower part of town, easily reached from Corso Mazzini; a stairway links the square to Via Sertorio Quattromani. Interior accessibility not verified.",
      },
    },
    images: ["san-domenico-1", "san-domenico-2", "san-domenico-3"],
    historic: {
      media: "san-domenico-storica",
      year: "1897",
      caption: {
        it: "La chiesa di San Domenico e il fiume Busento in una xilografia pubblicata da «Le cento città d'Italia».",
        en: "San Domenico and the Busento river in a woodcut published by “Le cento città d'Italia”.",
      },
    },
  },

  // ─────────────────────────────────────────────────────── Castello Svevo
  {
    slug: "castello-svevo",
    name: { it: "Castello Normanno-Svevo", en: "Norman-Swabian Castle" },
    category: "monumento",
    summary: {
      it: "Dalla vetta del colle Pancrazio, a 383 metri, la fortezza di Federico II domina la città, le valli e le montagne della Sila.",
      en: "From the top of Pancrazio hill, 383 metres up, Frederick II's fortress commands the city, the valleys and the Sila mountains.",
    },
    body: {
      it: `In cima al colle Pancrazio, alla fine dell'omonima via, il castello guarda Cosenza dall'alto come ha fatto per mille anni. Sorge su una motta artificiale di forma rettangolare, orientata secondo i punti cardinali come usavano i *Brettii*: non è certo che qui si trovasse la loro rocca, ma è documentato che nel 937 i cosentini costruirono il proprio forte proprio su questa cima.

Nel XII secolo Ruggero II lo ingrandì, e il castello ospitò anche la Curia; poi il terremoto del 1184 lo rese inagibile. Fu *Federico II di Svevia* a riportarlo al suo splendore, con la pianta rettangolare, le torri angolari, i camminamenti merlati e le sale voltate tipiche dei castelli federiciani. Con gli Angioini divenne residenza principesca di Luigi III e di Margherita di Savoia; durante le lotte con gli Aragonesi ospitò la zecca e una prigione per detenuti politici.

Il terremoto del 1638 ne avviò la decadenza: crollò una torre e quasi tutta la merlatura. Fu seminario nel Settecento e carcere sotto i Borbone; dopo il sisma del 1870 il Comune lo acquistò nel 1885. Lunghi restauri, iniziati nel 2008, lo hanno riaperto al pubblico. Sali fin quassù per il panorama: la città nuova, la valle del Crati e, all'orizzonte, la Sila.`,
      en: `At the top of Pancrazio hill, at the end of the street of the same name, the castle has been looking down on Cosenza for a thousand years. It stands on an artificial rectangular mound aligned with the cardinal points, as the *Bruttians* liked to build: no one can be sure their stronghold stood exactly here, but records show that in 937 the people of Cosenza built their fort on this very summit.

In the twelfth century Roger II enlarged it, and for a time it also housed the bishop's court; then the earthquake of 1184 left it unusable. It was *Frederick II of Swabia* who restored its splendour, giving it the rectangular plan, corner towers, crenellated wall-walks and vaulted halls typical of his castles. Under the Angevins it became the princely residence of Louis III and Margaret of Savoy; during their wars with the Aragonese it held the mint and a prison for political detainees.

The earthquake of 1638 began its decline, bringing down a tower and nearly all the battlements. It served as a seminary in the 1700s and a prison under the Bourbons; after the 1870 earthquake the city bought it in 1885. Long restoration work begun in 2008 has reopened it to the public. Come up for the view: the new town, the Crati valley and, on the horizon, the Sila.`,
    },
    curiosities: [
      {
        it: "Nel 1561 circa un centinaio di valdesi furono rinchiusi nei sotterranei del castello in attesa del processo.",
        en: "In 1561 around a hundred Waldensians were held in the castle's underground cells awaiting trial.",
      },
      {
        it: "Durante la seconda guerra mondiale il castello era sede della contraerea: una bomba destinata a colpirlo nel 1943 centrò invece il Teatro Rendano.",
        en: "During the Second World War the castle was an anti-aircraft post; a bomb aimed at it in 1943 hit the Teatro Rendano instead.",
      },
      {
        it: "Colle Pancrazio è uno dei sette colli su cui, secondo la tradizione, sorge Cosenza.",
        en: "Pancrazio is one of the seven hills on which, by tradition, Cosenza stands.",
      },
    ],
    lat: 39.286409,
    lng: 16.257758,
    coordsSource: "osm way/1271724657 (= wikidata Q3662341)",
    coordsVerified: true,
    geofenceRadiusM: 60,
    address: "Via Pancrazio, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: false,
      notes: {
        it: "Il castello è in cima al colle: la strada di accesso è lunga e in forte salita, gli spazi interni hanno pavimentazioni irregolari e dislivelli. Consigliate scarpe comode e acqua d'estate.",
        en: "The castle sits at the top of the hill: the approach road is long and steep, and inside there are uneven surfaces and changes of level. Wear comfortable shoes and bring water in summer.",
      },
    },
    images: ["castello-svevo-1", "castello-svevo-2", "castello-svevo-3"],
    historic: {
      media: "castello-svevo-storica",
      year: "1897",
      caption: {
        it: "Il castello visto da Porta Piana, ancora in stato di abbandono, in una xilografia pubblicata da «Le cento città d'Italia».",
        en: "The castle seen from Porta Piana, still neglected, in a woodcut published by “Le cento città d'Italia”.",
      },
    },
    streetview: {
      lat: 39.2868,
      lng: 16.2581,
      heading: 214,
      pitch: 12,
      hotspots: [
        {
          heading: 214,
          pitch: 18,
          label: { it: "Torri e mura federiciane", en: "Frederick II's towers and walls" },
          text: {
            it: "Pianta rettangolare, torri angolari e camminamenti merlati: l'impianto tipico dei castelli voluti da Federico II di Svevia.",
            en: "A rectangular plan, corner towers and crenellated wall-walks: the classic layout of Frederick II's castles.",
          },
        },
        {
          heading: 230,
          pitch: 8,
          label: { it: "La merlatura perduta", en: "The lost battlements" },
          text: {
            it: "Il terremoto del 1638 fece crollare una delle torri e quasi tutta la merlatura: da allora iniziò il lungo declino della fortezza.",
            en: "The 1638 earthquake toppled one of the towers and almost all the battlements, beginning the fortress's long decline.",
          },
        },
        {
          heading: 39,
          pitch: -5,
          label: { it: "Vista sul centro storico", en: "View over the old town" },
          text: {
            it: "Verso nord-est si scende con lo sguardo sui tetti della città vecchia fino al Duomo e, oltre, alla valle del Crati.",
            en: "To the north-east your gaze drops over the old-town rooftops to the cathedral and, beyond, the Crati valley.",
          },
        },
      ],
    },
    ar: {
      headline: {
        it: "Castello Normanno-Svevo · mille anni sul colle Pancrazio",
        en: "Norman-Swabian Castle · a thousand years on Pancrazio hill",
      },
      timeline: [
        {
          year: "356 a.C.",
          text: {
            it: "Cosenza diventa capitale della confederazione dei Brettii; la motta del castello è orientata come le loro costruzioni.",
            en: "Cosenza becomes capital of the Bruttian confederation; the castle mound is aligned like their buildings.",
          },
        },
        {
          year: "937",
          text: {
            it: "I cosentini costruiscono il loro forte in cima al colle Pancrazio.",
            en: "The people of Cosenza build their fort on the summit of Pancrazio hill.",
          },
        },
        {
          year: "XII sec.",
          text: {
            it: "Il normanno Ruggero II ingrandisce il castello; nel 1184 un terremoto lo rende inagibile.",
            en: "The Norman Roger II enlarges the castle; in 1184 an earthquake leaves it unusable.",
          },
        },
        {
          year: "XIII sec.",
          text: {
            it: "Federico II di Svevia lo ricostruisce con pianta rettangolare, torri angolari e sale voltate.",
            en: "Frederick II of Swabia rebuilds it with a rectangular plan, corner towers and vaulted halls.",
          },
        },
        {
          year: "XV sec.",
          text: {
            it: "Residenza di Luigi III d'Angiò e Margherita di Savoia; nelle lotte con gli Aragonesi ospita la zecca.",
            en: "Home to Louis III of Anjou and Margaret of Savoy; during the wars with the Aragonese it houses the mint.",
          },
        },
        {
          year: "1638",
          text: {
            it: "Un terremoto abbatte una torre e quasi tutta la merlatura: inizia il declino. Il Comune lo acquista nel 1885.",
            en: "An earthquake fells a tower and most of the battlements, starting its decline. The city buys it in 1885.",
          },
        },
        {
          year: "2008–2015",
          text: {
            it: "Lunghi lavori di restauro riportano il castello in funzione e lo riaprono ai visitatori.",
            en: "Lengthy restoration brings the castle back into use and reopens it to visitors.",
          },
        },
      ],
    },
  },

  // ─────────────────────────────────────────── Confluenza Crati–Busento
  {
    slug: "confluenza-crati-busento",
    name: { it: "Confluenza Crati–Busento", en: "Crati–Busento Confluence" },
    category: "paesaggio",
    summary: {
      it: "Dove il Busento si getta nel Crati, la leggenda vuole sepolto Alarico, re dei Visigoti, con il tesoro del sacco di Roma del 410.",
      en: "Where the Busento flows into the Crati, legend says Alaric, king of the Visigoths, was buried with the treasure of the sack of Rome in 410.",
    },
    body: {
      it: `Ai piedi del centro storico due fiumi si incontrano: il Busento, sceso dal monte Serratore, si getta nel Crati a 228 metri di quota. È da questo punto che Cosenza si è sempre raccontata, distinguendo la città antica, arroccata sul colle Pancrazio, dalla città moderna cresciuta oltre i ponti, sulla piana.

Ma la confluenza è soprattutto il luogo di una leggenda. Nel 410, dopo il sacco di Roma, *Alarico*, re dei Visigoti, scese verso il sud dell'Italia, forse diretto in Africa; giunto presso Cosenza si ammalò e morì. Lo storico Giordane tramanda che i suoi uomini deviarono temporaneamente il corso del Busento, seppellirono il re nel letto del fiume con il suo cavallo e i tesori, poi riportarono le acque al loro posto e uccisero i prigionieri che avevano lavorato allo scavo, perché nessuno ne svelasse il segreto.

Da allora la tomba di Alarico non è mai stata trovata, e ha continuato ad accendere fantasie e ricerche. Il poeta tedesco August von Platen le dedicò la ballata *Das Grab im Busento*, che Giosuè Carducci tradusse in italiano come *La tomba nel Busento*. Il 5 novembre 2016, alla confluenza, è stata inaugurata la statua equestre del re goto realizzata da Paolo Grassino. Fermati sul lungofiume al tramonto e ascolta le acque.`,
      en: `At the foot of the old town two rivers meet: the Busento, coming down from Monte Serratore, flows into the Crati at 228 metres above sea level. Cosenza has always defined itself from this spot, setting the old town perched on Pancrazio hill apart from the modern city that grew up across the bridges on the plain.

But above all, the confluence is the setting for a legend. In 410, after sacking Rome, *Alaric*, king of the Visigoths, marched south through Italy, perhaps heading for Africa; near Cosenza he fell ill and died. The historian Jordanes relates that his men temporarily diverted the Busento, buried the king in the riverbed with his horse and his treasure, then let the waters flow back and killed the captives who had dug the grave, so that no one could betray the secret.

Alaric's tomb has never been found, and it has fired imaginations and treasure hunts ever since. The German poet August von Platen devoted the ballad *Das Grab im Busento* to it, later translated into Italian by Giosuè Carducci as *La tomba nel Busento*. On 5 November 2016 a statue of the Gothic king on horseback by Paolo Grassino was unveiled at the confluence. Linger on the riverside at sunset and listen to the water.`,
    },
    curiosities: [
      {
        it: "La costruzione nel 1876 di un ponte alla confluenza dei due fiumi permise alla città di espandersi verso la pianura, dando avvio alla Cosenza moderna.",
        en: "A bridge built at the confluence in 1876 allowed the city to spread onto the plain, launching modern Cosenza.",
      },
      {
        it: "In piazza dei Bruzi un elmo di bronzo su una vasca d'acqua, opera di Mimmo Paladino, evoca anch'esso la leggenda di Alarico.",
        en: "In Piazza dei Bruzi, a bronze helmet in a pool of water by Mimmo Paladino also recalls the legend of Alaric.",
      },
    ],
    lat: 39.2926,
    lng: 16.25912,
    coordsSource: "osm way/51676759 (Busento) – nodo di confluenza con la way/457082375 (Crati)",
    coordsVerified: true,
    geofenceRadiusM: 60,
    address: "Confluenza dei fiumi Crati e Busento, presso Ponte Alarico, 87100 Cosenza",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: null,
      notes: {
        it: "I lungofiume e i ponti vicini sono in piano; l'accesso agli argini e alle sponde può richiedere scalini o percorsi sterrati.",
        en: "The riverside walks and nearby bridges are level; reaching the embankments and banks may involve steps or unpaved paths.",
      },
    },
    images: ["confluenza-crati-busento-1", "confluenza-crati-busento-2", "confluenza-crati-busento-3"],
    streetview: {
      lat: 39.29215,
      lng: 16.25905,
      heading: 7,
      pitch: -5,
      hotspots: [
        {
          heading: 7,
          pitch: -10,
          label: { it: "Dove i fiumi si incontrano", en: "Where the rivers meet" },
          text: {
            it: "Qui il Busento si getta nel Crati. Secondo Giordane, il letto del Busento fu deviato per seppellire Alarico nel 410.",
            en: "Here the Busento flows into the Crati. According to Jordanes, the Busento was diverted to bury Alaric in 410.",
          },
        },
        {
          heading: 284,
          pitch: 8,
          label: { it: "La cupola di San Domenico", en: "The dome of San Domenico" },
          text: {
            it: "Sulla riva sinistra del Busento, la chiesa quattrocentesca segna il passaggio tra città antica e città nuova.",
            en: "On the left bank of the Busento, the fifteenth-century church marks the threshold between old and new town.",
          },
        },
      ],
    },
    ar: {
      headline: {
        it: "Confluenza Crati–Busento · la leggenda di Alarico",
        en: "Crati–Busento Confluence · the legend of Alaric",
      },
      timeline: [
        {
          year: "410",
          text: {
            it: "Dopo il sacco di Roma, Alarico muore presso Cosenza e, secondo la leggenda, viene sepolto nel letto del Busento.",
            en: "After sacking Rome, Alaric dies near Cosenza and, legend says, is buried in the bed of the Busento.",
          },
        },
        {
          year: "551",
          text: {
            it: "Lo storico Giordane narra nei Getica la deviazione del fiume e la sepoltura segreta del re.",
            en: "The historian Jordanes recounts in his Getica the diverted river and the king's secret burial.",
          },
        },
        {
          year: "1820",
          text: {
            it: "August von Platen scrive la ballata «Das Grab im Busento», poi tradotta da Giosuè Carducci.",
            en: "August von Platen writes the ballad “Das Grab im Busento”, later translated by Giosuè Carducci.",
          },
        },
        {
          year: "1876",
          text: {
            it: "Un ponte alla confluenza apre la strada all'espansione della città verso la pianura.",
            en: "A bridge at the confluence opens the way for the city to expand onto the plain.",
          },
        },
        {
          year: "2016",
          text: {
            it: "Il 5 novembre viene inaugurata la statua di Alarico a cavallo di Paolo Grassino.",
            en: "On 5 November Paolo Grassino's statue of Alaric on horseback is unveiled.",
          },
        },
      ],
    },
  },

  // ─────────────────────────────────────────────────────── Ponte Alarico
  {
    slug: "ponte-alarico",
    name: { it: "Ponte Alarico", en: "Ponte Alarico" },
    category: "architettura",
    summary: {
      it: "Il ponte ad arcate alla confluenza tra Crati e Busento, da cui si apre una delle viste più belle sul centro storico.",
      en: "The arched bridge at the meeting of the Crati and Busento, offering one of the finest views of the old town.",
    },
    body: {
      it: `Fra i tanti ponti che cuciono le due anime di Cosenza, il Ponte Alarico è quello che porta il nome più evocativo. Scavalca il Crati subito a valle della confluenza con il Busento, proprio là dove, secondo la leggenda, riposa il re dei Visigoti morto nel 410 con il suo tesoro.

L'attraversamento ha una storia ottocentesca: qui sorgeva un ponte in ferro di fine Ottocento, e proprio un ponte costruito alla confluenza nel 1876 permise alla città, fino ad allora chiusa nei limiti del centro storico, di espandersi verso la spianata dove sarebbe nata la Cosenza moderna. Il ponte attuale, con le sue arcate in muratura, risale al 1948, negli anni della ricostruzione del dopoguerra.

Oggi è soprattutto un belvedere. Fermati a metà, guarda verso monte: davanti a te i due fiumi si incontrano, a destra la cupola di San Domenico emerge tra i cedri, e sopra, a gradoni, la città vecchia sale verso il castello sul colle Pancrazio. Nelle giornate limpide, oltre i tetti si distinguono le montagne. È uno dei punti migliori per capire, con un solo sguardo, la geografia di Cosenza: i fiumi, i sette colli e i ponti che li legano.`,
      en: `Of all the bridges that stitch together Cosenza's two halves, Ponte Alarico bears the most evocative name. It spans the Crati just below its meeting with the Busento – right where, legend has it, the king of the Visigoths who died in 410 lies with his treasure.

The crossing has a nineteenth-century story behind it: an iron bridge from the late 1800s once stood here, and it was a bridge built at the confluence in 1876 that allowed the city, until then confined to the old town, to spread onto the plain where modern Cosenza would grow. The present bridge, with its masonry arches, dates from 1948, in the years of post-war reconstruction.

Today it is above all a viewpoint. Stop halfway across and look upstream: in front of you the two rivers merge, to the right the dome of San Domenico rises among the cedars, and above it the old town climbs in tiers towards the castle on Pancrazio hill. On clear days you can make out the mountains beyond the rooftops. It is one of the best places to grasp Cosenza's geography in a single glance – the rivers, the seven hills and the bridges that bind them.`,
    },
    curiosities: [
      {
        it: "Una pianta di Cosenza di fine Cinquecento, conservata alla Biblioteca Angelica di Roma, è tra le fonti più importanti per ricostruire gli antichi ponti della città.",
        en: "A late-sixteenth-century drawing of Cosenza in Rome's Biblioteca Angelica is one of the key sources for reconstructing the city's old bridges.",
      },
      {
        it: "Poco più a nord, sul Crati, si alza dal 2018 il ponte strallato di Santiago Calatrava dedicato a San Francesco di Paola.",
        en: "A little further north on the Crati stands Santiago Calatrava's cable-stayed bridge dedicated to Saint Francis of Paola, opened in 2018.",
      },
    ],
    lat: 39.293331,
    lng: 16.259013,
    coordsSource: "osm way/36913600",
    coordsVerified: true,
    geofenceRadiusM: 50,
    address: "Ponte Alarico, 87100 Cosenza",
    openingHours: { it: "Sempre accessibile", en: "Always open" },
    accessibility: {
      stepFree: true,
      notes: {
        it: "Ponte stradale percorribile a piedi sui marciapiedi, senza gradini; attenzione al traffico veicolare.",
        en: "A road bridge with pavements, crossable on foot without steps; watch out for traffic.",
      },
    },
    images: ["ponte-alarico-1", "ponte-alarico-2"],
  },

  // ─────────────────────────────────────────── San Francesco di Paola
  {
    slug: "san-francesco-di-paola",
    name: {
      it: "Chiesa e convento di San Francesco di Paola",
      en: "Church and Convent of San Francesco di Paola",
    },
    category: "chiesa",
    summary: {
      it: "La chiesa sorta nel 1444, legata alla dimora cosentina del santo di Paola, con la «grotta del santo» e opere di Pietro Negroni.",
      en: "The church founded in 1444, tied to Saint Francis of Paola's home in Cosenza, with the “saint's grotto” and works by Pietro Negroni.",
    },
    body: {
      it: `Sulla riva del Crati opposta al centro storico, alla fine di corso Plebiscito, il campanile di San Francesco di Paola si specchia sul fiume. La chiesa, sorta nel 1444, è strettamente legata alla figura di *san Francesco di Paola*, il patrono della Calabria, che secondo la tradizione ne fece la propria dimora abituale; è considerata il secondo santuario a lui dedicato per importanza.

Dietro l'edificio si trova la cosiddetta *grotta del santo*, dove si dice vivesse in preghiera e dove si conserva una croce di legno da lui stesso deposta. Si entra attraverso un bel portale gotico in un'unica navata. Qui riposa Ottavio Cesare Gaeta, morto nel 1593; lungo le pareti si susseguono tele del Settecento, statue lignee di san Francesco e di san Michele Arcangelo, e la *Madonna con Bambino in gloria e i santi Paolo e Luca* dipinta da Pietro Negroni nel 1551. Nell'abside, un trittico cinquecentesco di Cristoforo Faffeo raffigura la Madonna di Loreto con i santi Caterina e Sebastiano; dietro l'altare, il coro ligneo intagliato nel 1679 da Domenico Costanzo da Rogliano.

L'annesso convento, fondato nel 1510 dai Minimi e poi trasformato in caserma, si organizza intorno a un chiostro quadrato e dal 2008 ospita l'Archivio di Stato di Cosenza.`,
      en: `On the bank of the Crati opposite the old town, at the end of Corso Plebiscito, the bell tower of San Francesco di Paola is mirrored in the river. Founded in 1444, the church is closely bound to *Saint Francis of Paola*, patron saint of Calabria, who by tradition made it his usual home; it is regarded as the second most important sanctuary dedicated to him.

Behind the building is the so-called *saint's grotto*, where he is said to have lived in prayer and where a wooden cross he left is still kept. A fine Gothic portal leads into a single nave. Here lies Ottavio Cesare Gaeta, who died in 1593; along the walls you'll find eighteenth-century paintings, wooden statues of Saint Francis and Saint Michael the Archangel, and Pietro Negroni's *Madonna and Child in Glory with Saints Paul and Luke*, painted in 1551. In the apse, a sixteenth-century triptych by Cristoforo Faffeo shows the Madonna of Loreto with Saints Catherine and Sebastian; behind the altar stands the wooden choir carved in 1679 by Domenico Costanzo of Rogliano.

The adjoining convent, founded in 1510 by the Minim friars and later turned into barracks, is built around a square cloister and has housed Cosenza's State Archives since 2008.`,
    },
    curiosities: [
      {
        it: "Sulla volta della chiesa alcuni dipinti raccontano scene della vita del santo di Paola.",
        en: "Paintings on the church vault tell scenes from the life of the saint from Paola.",
      },
      {
        it: "L'Archivio di Stato nel convento conserva, tra l'altro, carte geografiche cinquecentesche della Calabria Citeriore.",
        en: "Among other treasures, the State Archives in the convent hold sixteenth-century maps of Calabria Citeriore.",
      },
    ],
    lat: 39.292582,
    lng: 16.259913,
    coordsSource: "osm way/259751318 (= wikidata Q55138838)",
    coordsVerified: true,
    geofenceRadiusM: 40,
    address: "Largo Paolina Gervasi Mantovani 1, 87100 Cosenza",
    openingHours: {
      it: "Orari variabili: verificare prima della visita",
      en: "Hours vary: check before visiting",
    },
    accessibility: {
      stepFree: null,
      notes: {
        it: "La chiesa è sul versante dello Spirito Santo, con accessi in pendenza dalle strade circostanti; accessibilità interna non verificata.",
        en: "The church stands on the Spirito Santo side, reached by sloping streets; interior accessibility not verified.",
      },
    },
    images: ["san-francesco-di-paola-1", "san-francesco-di-paola-2", "san-francesco-di-paola-3"],
  },
];
