import type { SeedItinerary } from "../types";

export const itinerary: SeedItinerary = {
  slug: "cosenza-contemporanea",
  title: { it: "Cosenza contemporanea", en: "Contemporary Cosenza" },
  subtitle: {
    it: "Dalla piazza dei Filosofi guerrieri al ponte di Calatrava e al planetario: la città che cambia",
    en: "From the Warrior Philosophers' square to Calatrava's bridge and the planetarium: a city in transformation",
  },
  intro: {
    it: "Cosenza non è solo vicoli medievali e chiese antiche. Negli ultimi vent'anni la città ha cambiato volto: una lunga isola pedonale trasformata in museo, nuove piazze, un ponte firmato da una star dell'architettura e un planetario tra i più grandi d'Italia. Questo itinerario attraversa la città nuova da nord a sud e scende verso il Crati, nel quartiere di Gergeri, per raccontare come una città del Sud abbia scelto l'arte, l'architettura e la scienza per ripensare se stessa.",
    en: "Cosenza is not only medieval alleys and ancient churches. Over the last twenty years the city has changed its face: a long pedestrian street turned into a museum, new squares, a bridge signed by a star architect and one of the largest planetariums in Italy. This itinerary crosses the new town from north to south and goes down to the Crati river, in the Gergeri district, to tell how a southern city chose art, architecture and science to reinvent itself.",
  },
  theme: "contemporaneo",
  difficulty: "media",
  color: "#2F5A3F",
  cover: "ponte-calatrava-1",
  featured: false,
  chapters: [
    {
      place: "piazza-bilotti",
      title: { it: "Una piazza rinata", en: "A square reborn" },
      body: {
        it: `Comincia da qui, da Piazza Carlo Bilotti, all'estremità nord di Corso Mazzini. Fino a pochi anni fa era Piazza Fera, uno spazio dominato dalle auto. Oggi le macchine sono scese sottoterra, in un parcheggio interrato, e in superficie è rimasta una grande piazza pedonale, aperta e luminosa.

Al centro, dodici sagome di acciaio corten color ruggine: I Filosofi guerrieri di Giuseppe Gallo, inaugurati nel 2017. Sono la firma di un artista calabrese contemporaneo sul punto d'arrivo del museo all'aperto della città. Le figure sembrano sul punto di danzare, ma tengono il capo chino come chi pensa; un gruppo regge un cerchio con i nomi dei popoli che hanno fatto la Calabria, dai Bruzi agli Arbëreshë.

È un buon simbolo di questo itinerario: una città che recupera i propri spazi e li riempie di significato, mescolando radici antiche e linguaggi nuovi.

Ora imbocca Corso Mazzini verso sud. Davanti a te si stende più di un chilometro di strada senza auto, che vent'anni fa era un'arteria trafficata.`,
        en: `Start here, in Piazza Carlo Bilotti, at the northern end of Corso Mazzini. Until a few years ago this was Piazza Fera, a space ruled by cars. Today the cars have gone underground into a car park, and what remains on the surface is a large, open, bright pedestrian square.

In the middle stand twelve rust-coloured Corten steel silhouettes: The Warrior Philosophers by Giuseppe Gallo, unveiled in 2017. They are a contemporary Calabrian artist's signature on the finish line of the city's open-air museum. The figures seem about to dance, yet they keep their heads bowed like people in thought; one group holds up a ring bearing the names of the peoples who made Calabria, from the Bruttians to the Arbëreshë.

It is a fitting symbol for this itinerary: a city reclaiming its spaces and filling them with meaning, mixing ancient roots and new languages.

Now set off south along Corso Mazzini. Ahead of you stretches more than a kilometre of car-free street that twenty years ago was a busy thoroughfare.`,
      },
      camera: { zoom: 17, bearing: 160, pitch: 45 },
    },
    {
      place: "corso-mazzini",
      title: { it: "La strada che è diventata museo", en: "The street that became a museum" },
      body: {
        it: `Hai percorso Corso Mazzini da un capo all'altro, e ora ne raggiungi l'ingresso sud. Lungo la strada hai incrociato un Dalí, tre de Chirico, due Manzù, un Modigliani: sculture del Novecento appoggiate agli incroci come se fosse la cosa più naturale del mondo.

Tutto è cominciato nel 2002, quando il corso è diventato isola pedonale, oggi la più vasta della Calabria. Senza traffico, la strada si è trasformata nel salotto della città, e nel 2005 la famiglia Bilotti l'ha scelta come sede del suo museo all'aperto. Il rifacimento dell'ultimo tratto, completato nel 2021, ha portato altre opere e nuove pavimentazioni.

Guardati intorno: i tavolini dei bar, le panchine, i bambini che giocano accanto ai bronzi. È questa la vera opera contemporanea, una strada restituita alle persone. Le statue non sono chiuse in una teca: invecchiano con la città, ne diventano punti di riferimento, luoghi d'appuntamento.

Da qui lasci la città nuova e scendi verso Piazza dei Bruzi, dove ha sede il Municipio. Oltre si intravede, alta sopra i tetti, un'antenna bianca e obliqua.`,
        en: `You have walked Corso Mazzini from one end to the other, and now you reach its southern entrance. Along the way you passed a Dalí, three de Chiricos, two Manzùs and a Modigliani: twentieth-century sculptures set at street corners as if it were the most natural thing in the world.

It all began in 2002, when the street became a pedestrian zone, today the largest in Calabria. Free of traffic, it turned into the city's living room, and in 2005 the Bilotti family chose it as the home of their open-air museum. The rebuilding of the last stretch, completed in 2021, brought more works and new paving.

Look around: café tables, benches, children playing next to the bronzes. This is the real contemporary work, a street given back to people. The statues are not shut away in display cases: they age with the city and become landmarks and meeting points.

From here you leave the new town and head down towards Piazza dei Bruzi, home of the Town Hall. Beyond it, high above the rooftops, you can glimpse a slanting white mast.`,
      },
      camera: { zoom: 16, bearing: 170, pitch: 40 },
    },
    {
      place: null,
      at: [16.25623, 39.29345],
      title: { it: "Verso il fiume", en: "Towards the river" },
      body: {
        it: `Sei in Piazza dei Bruzi, davanti al Palazzo dei Bruzi, il Municipio di Cosenza. La piazza porta il nome del popolo italico che fece di questa città la propria capitale, molto prima dei Romani: è qui che comincia ufficialmente il percorso del Museo all'Aperto Bilotti.

Da questo punto la città nuova cede il passo alla Cosenza più antica. A sud scorrono il Busento e il Crati, i due fiumi che si incontrano ai piedi del centro storico; sopra di te, sulle colline, si arrampicano i tetti dei quartieri medievali.

Il tuo cammino ora scende verso est, verso la valle del Crati. Qui la città ha vissuto per decenni un rapporto difficile con i suoi margini: zone di passaggio, ferrovie, quartieri rimasti indietro. Proprio su uno di questi margini, il quartiere di Gergeri, Cosenza ha scommesso con due opere che parlano il linguaggio del presente.

Tieni lo sguardo verso l'alto mentre cammini: l'antenna bianca che hai intravisto dal corso si fa sempre più grande. È inclinata come una vela gonfiata dal vento, e regge un ponte che attraversa il fiume.`,
        en: `You are in Piazza dei Bruzi, in front of Palazzo dei Bruzi, Cosenza's Town Hall. The square is named after the Italic people who made this city their capital long before the Romans: this is where the Bilotti Open-Air Museum route officially begins.

From this point the new town gives way to older Cosenza. To the south flow the Busento and the Crati, the two rivers that meet at the foot of the old town; above you, on the hills, the roofs of the medieval districts climb upwards.

Your route now heads east, down towards the Crati valley. For decades the city had a difficult relationship with its edges here: transit zones, railways, neighbourhoods left behind. On one of these edges, the Gergeri district, Cosenza has placed its bet on two works that speak the language of the present.

Keep looking up as you walk: the white mast you glimpsed from the Corso grows larger and larger. It leans like a sail filled by the wind, and it holds up a bridge across the river.`,
      },
      camera: { zoom: 16, bearing: 110, pitch: 50 },
    },
    {
      place: "ponte-calatrava",
      title: { it: "L'arpa sul Crati", en: "The harp over the Crati" },
      body: {
        it: `Eccolo, il Ponte San Francesco di Paola, che tutti chiamano Ponte di Calatrava. L'antenna bianca sale obliqua, inclinata di 52 gradi, fino a oltre cento metri d'altezza. Da lì partono i cavi che reggono l'impalcato, aperti a ventaglio come le corde di un'arpa gigante.

L'ha progettato l'architetto e ingegnere spagnolo Santiago Calatrava, autore di ponti in tutto il mondo. Il ponte, lungo 103 metri, collega le due sponde del Crati e scavalca la ferrovia. Ma la sua storia è stata tutt'altro che veloce: il progetto fu presentato nel 2000, i lavori cominciarono nel 2008, l'antenna fu sollevata solo nell'estate del 2017. L'inaugurazione arrivò il 26 gennaio 2018, diciotto anni dopo la prima idea.

Il ponte non è solo un passaggio: fa parte di un progetto di rigenerazione urbana pensato per ricucire questa zona marginale con il cuore della città.

Attraversalo a piedi e fermati a metà. Guarda come i cavi tagliano il cielo in strisce sottili; di sera, illuminati, cambiano colore. Poi scendi sulla sponda opposta: a pochi passi, in via Sant'Antonio dell'Orto, c'è un edificio che custodisce un cielo intero.`,
        en: `Here it is, the San Francesco di Paola Bridge, which everyone calls the Calatrava Bridge. The white mast rises obliquely, tilted at 52 degrees, to more than a hundred metres. From it run the cables that hold up the deck, fanned out like the strings of a giant harp.

It was designed by the Spanish architect and engineer Santiago Calatrava, creator of bridges all over the world. The bridge, 103 metres long, links the two banks of the Crati and crosses the railway. But its story was anything but quick: the project was presented in 2000, works began in 2008, and the mast was raised only in the summer of 2017. The opening came on 26 January 2018, eighteen years after the first idea.

The bridge is not just a crossing: it is part of an urban regeneration project designed to stitch this marginal area back to the heart of the city.

Walk across it and stop halfway. See how the cables slice the sky into thin strips; in the evening, lit up, they change colour. Then go down on the far side: a few steps away, in Via Sant'Antonio dell'Orto, a building holds an entire sky.`,
      },
      camera: { zoom: 17, bearing: 70, pitch: 60 },
    },
    {
      place: "planetario",
      title: { it: "Un cielo in città", en: "A sky in the city" },
      body: {
        it: `L'ultima tappa è il Planetario "Giovan Battista Amico", inaugurato nell'aprile 2019. Da fuori vedi un edificio di vetro e acciaio; dentro, una cupola di 15 metri di diametro, tra le più grandi d'Italia, e 113 poltrone reclinabili e girevoli.

Quando le luci si spengono, un proiettore ottico Zeiss Starmaster accende migliaia di stelle sopra la tua testa, mentre sei proiettori digitali possono avvolgere tutta la cupola di immagini. È uno strumento per le scuole, per gli appassionati, per chiunque voglia ritrovare il cielo che le luci della città ci hanno nascosto.

Il nome è un omaggio a un cosentino del Rinascimento. Giovan Battista Amico, nato a Cosenza nel 1512, studiò a Padova e nel 1536 pubblicò a Venezia un trattato sui moti dei corpi celesti, proponendo un sistema di sfere omocentriche alternativo a quello di Tolomeo. Morì assassinato a Padova nel 1538, a ventisei anni.

Hai attraversato la città nuova, hai visto le sculture del Novecento, un ponte del ventunesimo secolo e ora un cielo artificiale. Se il calendario lo consente, prenota uno spettacolo e chiudi la giornata guardando in alto.`,
        en: `The last stop is the "Giovan Battista Amico" Planetarium, opened in April 2019. From outside you see a building of glass and steel; inside, a dome 15 metres across, among the largest in Italy, and 113 reclining, swivelling seats.

When the lights go down, a Zeiss Starmaster optical projector switches on thousands of stars above your head, while six digital projectors can wrap the whole dome in images. It is a tool for schools, for enthusiasts, for anyone who wants to rediscover the sky that city lights have hidden from us.

The name honours a Renaissance son of Cosenza. Giovan Battista Amico, born in Cosenza in 1512, studied in Padua and in 1536 published in Venice a treatise on the motions of the heavenly bodies, proposing a system of homocentric spheres as an alternative to Ptolemy's. He was murdered in Padua in 1538, aged twenty-six.

You have crossed the new town, seen twentieth-century sculptures, a twenty-first-century bridge and now an artificial sky. If the programme allows, book a show and end your day looking up.`,
      },
      camera: { zoom: 17.5, bearing: -30, pitch: 45 },
    },
  ],
};
