import type { SeedItinerary } from "../types";

export const itinerary: SeedItinerary = {
  slug: "arte-a-cielo-aperto",
  title: { it: "Arte a cielo aperto", en: "Art under the open sky" },
  subtitle: {
    it: "Dalí, de Chirico, Manzù e Modigliani lungo Corso Mazzini: il MAB, un museo senza pareti",
    en: "Dalí, de Chirico, Manzù and Modigliani along Corso Mazzini: the MAB, a museum without walls",
  },
  intro: {
    it: "Niente biglietti, niente sale, niente custodi: solo una strada e i suoi incroci. Lungo Corso Mazzini, il salotto della Cosenza moderna, il Museo all'Aperto Bilotti ha disposto sculture dei grandi maestri del Novecento tra vetrine, panchine e caffè. In questa passeggiata in piano, da sud verso nord, incontri il surrealismo di Dalí, la Metafisica di de Chirico, i cardinali di Manzù e il volto antico di Modigliani, fino alla piazza che porta il nome del collezionista che ha voluto tutto questo.",
    en: "No tickets, no galleries, no attendants: just a street and its corners. Along Corso Mazzini, the living room of modern Cosenza, the Bilotti Open-Air Museum has placed sculptures by the great masters of the twentieth century among shop windows, benches and cafés. On this flat walk from south to north you meet Dalí's surrealism, de Chirico's Metaphysical art, Manzù's cardinals and Modigliani's ancient face, ending in the square named after the collector who made it all happen.",
  },
  theme: "arte",
  difficulty: "facile",
  color: "#B5532C",
  cover: "mab-san-giorgio-e-il-drago-1",
  featured: true,
  chapters: [
    {
      place: "corso-mazzini",
      title: { it: "Un museo senza porte", en: "A museum without doors" },
      body: {
        it: `Sei all'inizio del tratto pedonale di Corso Mazzini, a due passi da Piazza dei Bruzi e dal Municipio. Davanti a te la strada corre dritta verso nord, quasi in piano, tra palazzi del Novecento, insegne e tavolini all'aperto.

Qui ogni pomeriggio Cosenza fa la sua passeggiata. Ma guarda meglio gli incroci: su basamenti bianchi e grigi si alzano bronzi e marmi firmati da alcuni dei nomi più importanti dell'arte del secolo scorso. È il MAB, il Museo all'Aperto Bilotti, nato nel 2005 dalla donazione di una famiglia di origine cosentina che ha deciso di regalare alla città un museo senza pareti.

Non c'è un ingresso e non c'è un'uscita. Le opere stanno dove passano le persone, accanto alle biciclette e ai bambini che corrono. Nel 2019 il Ministero ne ha riconosciuto il valore storico e artistico.

Comincia a camminare verso nord. Al primo grande incrocio, quello con via Piave, ti aspetta un volto di bronzo alto più di due metri che sembra uscito da un tempio arcaico.`,
        en: `You are at the start of the pedestrian stretch of Corso Mazzini, a stone's throw from Piazza dei Bruzi and the Town Hall. Ahead of you the street runs straight north, almost flat, between twentieth-century buildings, shop signs and café tables.

Every afternoon this is where Cosenza takes its stroll. But look more closely at the corners: on white and grey plinths stand bronzes and marbles signed by some of the most important names in last century's art. This is the MAB, the Bilotti Open-Air Museum, created in 2005 from the gift of a family of Cosenza origin who chose to give the city a museum without walls.

There is no entrance and no exit. The works stand where people pass, next to bicycles and running children. In 2019 the Ministry of Culture recognised their historic and artistic value.

Start walking north. At the first major corner, Via Piave, a bronze face more than two metres tall is waiting for you, as if it had stepped out of an archaic temple.`,
      },
      camera: { zoom: 16, bearing: -20, pitch: 45 },
    },
    {
      place: "mab-testa-di-cariatide",
      title: { it: "Il volto di Modigliani", en: "Modigliani's face" },
      body: {
        it: `Eccola, la Testa di Cariatide. Il naso lungo e sottile, gli occhi a mandorla senza pupille, il collo che sale come una colonna: riconosci subito lo stile di Amedeo Modigliani, anche se forse lo conosci soprattutto come pittore.

Prima dei ritratti, però, Modigliani sognava la scultura. Nella Parigi dei primi del Novecento scolpiva teste in pietra e in legno, guardando insieme alla Grecia arcaica e alle maschere africane che entusiasmavano le avanguardie. La salute fragile lo costrinse ad abbandonare lo scalpello.

Questo bronzo, alto 226 centimetri, è un ingrandimento realizzato nel 2006 a partire da un modello in legno del 1910 oggi conservato in Australia. È arrivato a Cosenza nel 2015, dono di Roberto Bilotti e della Fondazione Modigliani.

Una cariatide è una figura che regge un tempio. Prova a guardarla dal basso, con il corso alle spalle: sembra davvero sostenere il cielo.

Riprendi il cammino. Poco più avanti, all'angolo con via Isonzo, una figura chiusa in un mantello ti aspetta immobile, come un prelato in processione.`,
        en: `Here she is, the Head of a Caryatid. The long, thin nose, the almond eyes without pupils, the neck rising like a column: you recognise Amedeo Modigliani's style at once, even if you probably know him mainly as a painter.

Before the portraits, though, Modigliani dreamed of sculpture. In early twentieth-century Paris he carved heads in stone and wood, looking both at archaic Greece and at the African masks that thrilled the avant-garde. Poor health forced him to put down the chisel.

This bronze, 226 centimetres tall, is an enlargement made in 2006 from a wooden model of 1910 now kept in Australia. It arrived in Cosenza in 2015, a gift from Roberto Bilotti and the Modigliani Foundation.

A caryatid is a figure that holds up a temple. Try looking at her from below, with the street behind you: she really does seem to support the sky.

Walk on. A little further, at the corner of Via Isonzo, a figure wrapped in a cloak stands waiting, motionless, like a prelate in a procession.`,
      },
      camera: { zoom: 17.5, bearing: 10, pitch: 55 },
    },
    {
      place: "mab-cardinale",
      title: { it: "Il cardinale di Manzù", en: "Manzù's cardinal" },
      body: {
        it: `Davanti a te si alza un cono di bronzo alto più di due metri, coronato dalla mitria. Il volto è appena accennato, il corpo scompare sotto il mantello. È il Grande Cardinale in piedi di Giacomo Manzù.

Manzù, bergamasco, figlio di un calzolaio, imparò a scolpire intagliando il legno nelle botteghe. Diventò uno dei maggiori scultori italiani del Novecento: è sua la Porta della Morte della basilica di San Pietro. Per tutta la vita tornò sullo stesso soggetto, il cardinale, modellandone centinaia di versioni.

Non lo affascinava il potere, ma la forma: un corpo nascosto che diventa architettura, una superficie liscia su cui la luce scorre senza ostacoli. L'esemplare di Cosenza, fuso nel 2004, è il quinto di otto tratti dall'originale del 1965.

Fai un giro completo intorno alla statua e osserva come il profilo cambia a ogni passo. Accanto, le Tre colonne doriche in marmo bianco del francese Sacha Sosno sembrano le rovine di un tempio ritagliato nella carta.

Prosegui ancora verso nord: al prossimo incrocio ti aspetta un cavaliere in battaglia, uscito dai sogni di un pittore catalano.`,
        en: `In front of you rises a bronze cone more than two metres tall, crowned by a mitre. The face is barely hinted at, the body vanishes beneath the cloak. This is the Great Standing Cardinal by Giacomo Manzù.

Manzù, from Bergamo, the son of a shoemaker, learned to sculpt by carving wood in workshops. He became one of the great Italian sculptors of the twentieth century: the Door of Death of St Peter's Basilica is his work. All his life he returned to the same subject, the cardinal, modelling hundreds of versions.

Power did not interest him; form did: a hidden body that becomes architecture, a smooth surface over which light flows without obstacles. The Cosenza cast, made in 2004, is the fifth of eight taken from the 1965 original.

Walk all the way round the statue and watch its outline change with every step. Next to it, the white marble Three Doric Columns by the French artist Sacha Sosno look like the ruins of a temple cut out of paper.

Keep heading north: at the next corner a knight in battle is waiting for you, straight out of the dreams of a Catalan painter.`,
      },
      camera: { zoom: 17.5, bearing: -35, pitch: 50 },
    },
    {
      place: "mab-san-giorgio-e-il-drago",
      title: { it: "Il sogno di Dalí", en: "Dalí's dream" },
      body: {
        it: `Eccolo, il pezzo più famoso del MAB: San Giorgio e il drago di Salvador Dalí. Un cavallo s'impenna, in groppa un cavaliere senza volto in cotta di maglia, sotto di loro un drago avvolge le sue spire squamose intorno alle zampe.

San Giorgio, Sant Jordi in catalano, è il patrono della Catalogna, la terra di Dalí. Il maestro del surrealismo, nato e morto a Figueres, ha trasformato la leggenda in una scena da sogno: il drago sembra più un serpente marino che una belva alata, e il combattimento è congelato in un istante che non finisce mai.

Il modello risale agli anni tra il 1977 e il 1984; questo bronzo è uno dei sette esemplari dell'edizione museale. Pensa a quanto sia insolito: un Dalí autentico, all'aperto, tra un negozio e un bar, che puoi guardare da ogni lato a qualunque ora del giorno e della notte.

Gira intorno al basamento e segui le spire del drago: a ogni passo la scena cambia.

Ora continua verso Piazza XI Settembre e oltre. All'angolo con via Arabia ti aspetta una donna di bronzo, appena uscita dall'acqua.`,
        en: `Here it is, the most famous piece in the MAB: Saint George and the Dragon by Salvador Dalí. A horse rears, on its back a faceless rider in chain mail, and beneath them a dragon wraps its scaly coils around the horse's legs.

Saint George, Sant Jordi in Catalan, is the patron saint of Catalonia, Dalí's homeland. The master of surrealism, born and died in Figueres, turned the legend into a dream scene: the dragon looks more like a sea serpent than a winged beast, and the fight is frozen in a moment that never ends.

The model dates from between 1977 and 1984; this bronze is one of seven casts of the museum edition. Think how unusual that is: a genuine Dalí, out in the open, between a shop and a bar, which you can view from every side at any hour of the day or night.

Walk round the base and follow the dragon's coils: with every step the scene changes.

Now carry on towards Piazza XI Settembre and beyond. At the corner of Via Arabia a bronze woman is waiting for you, just stepped out of the water.`,
      },
      camera: { zoom: 18, bearing: 160, pitch: 55 },
    },
    {
      place: "mab-grande-bagnante",
      title: { it: "La bagnante di Greco", en: "Greco's bather" },
      body: {
        it: `Alta, sottile, una mano sul fianco e l'altra portata alla testa: la Grande Bagnante n. 2 di Emilio Greco si stira al sole come se fosse appena uscita dal mare. L'ha modellata nel 1957 uno dei più amati scultori figurativi del dopoguerra, siciliano di Catania, autore anche delle porte bronzee del Duomo di Orvieto.

Negli anni in cui molti artisti sceglievano l'astrazione, Greco rimase fedele al corpo umano. Le sue figure femminili hanno una grazia classica, ma anche qualcosa di nervoso e moderno: gambe lunghissime, spigoli improvvisi, una base così stretta che la statua sembra in punta di piedi.

Prima di arrivare qui sei passato per Piazza XI Settembre, dove si trovano altre due opere di Giorgio de Chirico e la Rinascita della cultura di Mimmo Rotella: se hai tempo, torna a dare un'occhiata. Poco oltre la bagnante c'è anche la Grande figura accoccolata, sempre di Greco, raccolta su sé stessa.

Lascia che lo sguardo segua la luce lungo i fianchi della statua, poi riprendi a camminare. Più avanti il corso si allarga in Piazza Kennedy, dove un lupo verde alza il muso verso il cielo.`,
        en: `Tall, slender, one hand on her hip and the other raised to her head: Emilio Greco's Large Bather No. 2 stretches in the sun as if she had just come out of the sea. She was modelled in 1957 by one of the best-loved figurative sculptors of the post-war years, a Sicilian from Catania who also made the bronze doors of Orvieto Cathedral.

At a time when many artists were choosing abstraction, Greco stayed faithful to the human body. His female figures have a classical grace, but also something nervous and modern: very long legs, sudden angles, a base so narrow that the statue seems to stand on tiptoe.

On your way here you passed through Piazza XI Settembre, home to two more works by Giorgio de Chirico and Mimmo Rotella's Rebirth of Culture: if you have time, go back for a look. Just beyond the bather is Greco's Large Crouching Figure, folded in on herself.

Let your eyes follow the light along the statue's hips, then walk on. Further ahead the street widens into Piazza Kennedy, where a green wolf raises its muzzle to the sky.`,
      },
      camera: { zoom: 17.5, bearing: 20, pitch: 45 },
    },
    {
      place: "mab-lupo-della-sila",
      title: { it: "Il lupo di Rotella", en: "Rotella's wolf" },
      body: {
        it: `In Piazza Kennedy, il cuore del corso, un lupo di marmo verde alza il muso come se ululasse alla luna. Da lontano sembra pieno e possente; avvicinati di lato e scoprirai che è una lastra spessa appena diciotto centimetri.

L'ha ideato Mimmo Rotella, nato a Catanzaro nel 1918, l'artista calabrese più celebre del Novecento insieme a Umberto Boccioni. Rotella diventò famoso strappando i manifesti pubblicitari dai muri di Roma e trasformandoli in opere: il décollage. Per questa scultura il prototipo era in legno, e gli scalpellini di Carrara l'hanno tradotto in marmo nel 2005.

Il lupo è l'animale della Sila, l'altopiano boscoso che domina Cosenza da est, e un simbolo che i calabresi legano agli antichi Bruzi, il popolo fiero che abitava queste terre prima di Roma. Non a caso tornerai a incontrarlo, in forma diversa, alla fine del percorso.

Guarda il lupo prima di profilo e poi di fronte: da un lato è una presenza netta, dall'altro quasi sparisce, come un'immagine su un foglio.

Pochi passi più in là, all'angolo con via Molinella, un eroe sta per lasciare la donna che ama.`,
        en: `In Piazza Kennedy, the heart of the street, a green marble wolf lifts its muzzle as if howling at the moon. From a distance it looks full and powerful; step round to the side and you will find it is a slab barely eighteen centimetres thick.

It was conceived by Mimmo Rotella, born in Catanzaro in 1918, the most celebrated Calabrian artist of the twentieth century along with Umberto Boccioni. Rotella made his name tearing advertising posters off the walls of Rome and turning them into art: décollage. For this sculpture the prototype was in wood, and Carrara stonecutters translated it into marble in 2005.

The wolf is the animal of the Sila, the wooded plateau that looms over Cosenza to the east, and a symbol Calabrians link to the ancient Bruttians, the proud people who lived here before Rome. Not by chance, you will meet it again, in a different form, at the end of the walk.

Look at the wolf first in profile and then head-on: from one side it is a sharp presence, from the other it almost disappears, like an image on a sheet of paper.

A few steps further on, at the corner of Via Molinella, a hero is about to leave the woman he loves.`,
      },
      camera: { zoom: 18, bearing: -60, pitch: 40 },
    },
    {
      place: "mab-ettore-e-andromaca",
      title: { it: "L'ultimo abbraccio", en: "The last embrace" },
      body: {
        it: `Due figure si stringono l'una all'altra. Lui porta l'elmo e impugna una lunga lancia, lei è avvolta in una veste che scende fino a terra. Le loro teste sono ovali lisci, senza volto, come quelle dei manichini. Sono Ettore e Andromaca di Giorgio de Chirico.

La scena viene dall'Iliade: Ettore saluta la moglie prima di uscire dalle mura di Troia per affrontare Achille. Entrambi sanno che non si rivedranno. De Chirico, nato in Grecia nel 1888, dipinse questo addio per la prima volta nel 1917 e ne fece uno dei simboli della pittura metafisica, l'arte degli enigmi e delle piazze silenziose.

Il bronzo di Cosenza, alto 230 centimetri, è stato fuso nel 2005 in due soli esemplari autorizzati dalla fondazione dell'artista. Carlo Bilotti amava profondamente de Chirico: ha donato sue opere anche al museo che porta il suo nome nella Villa Borghese di Roma.

Guarda la lancia di Ettore, dritta e rigida, e poi i due corpi che si piegano l'uno verso l'altra: la guerra aspetta, ma l'abbraccio resiste.

Ora percorri l'ultimo tratto del corso. In fondo si apre la piazza dedicata proprio a Carlo Bilotti, dove ti aspettano dodici filosofi guerrieri.`,
        en: `Two figures hold each other close. He wears a helmet and grips a long spear, she is wrapped in a gown that reaches the ground. Their heads are smooth, faceless ovals, like those of mannequins. They are Giorgio de Chirico's Hector and Andromache.

The scene comes from the Iliad: Hector says goodbye to his wife before leaving the walls of Troy to face Achilles. Both know they will not meet again. De Chirico, born in Greece in 1888, first painted this farewell in 1917 and made it one of the emblems of Metaphysical painting, the art of enigmas and silent squares.

The Cosenza bronze, 230 centimetres tall, was cast in 2005 in just two copies authorised by the artist's foundation. Carlo Bilotti deeply loved de Chirico: he also donated works by him to the museum that bears his name in Rome's Villa Borghese.

Look at Hector's spear, straight and rigid, and then at the two bodies leaning into each other: war is waiting, but the embrace holds.

Now walk the last stretch of the street. At the end opens the square named after Carlo Bilotti himself, where twelve warrior philosophers are waiting for you.`,
      },
      camera: { zoom: 18, bearing: 120, pitch: 50 },
    },
    {
      place: "piazza-bilotti",
      title: { it: "Il traguardo dei filosofi", en: "The philosophers' finish line" },
      body: {
        it: `Sei arrivato in Piazza Carlo Bilotti, che i cosentini hanno chiamato per decenni Piazza Fera. Qui il museo all'aperto raggiunge il suo traguardo, e la piazza, ridisegnata sopra un parcheggio interrato, si apre ampia verso i palazzi della città nuova.

Al centro ti accolgono I Filosofi guerrieri di Giuseppe Gallo, artista nato a Rogliano, a pochi chilometri da qui. Sono dodici sagome in acciaio corten color ruggine, inaugurate nel 2017. Osserva i loro piedi, ruotati come un attimo prima di una danza, e le loro teste, chine sul petto come chi riflette: azione e pensiero nello stesso corpo.

Un gruppo di figure regge un grande cerchio su cui sono incisi i nomi dei popoli della Calabria: Bruzi, Arbëreshë, Occitani, Valdesi, Grecanici. Cerca tra le sagome il lupo della Sila, che hai già incontrato in Piazza Kennedy, e il toro che si volta indietro, simbolo dell'antica Sibari.

Accanto si alza la grande Bifrontale in marmo rosato di Pietro Consagra. Siediti, guarda indietro verso il corso che hai percorso: un chilometro di strada, un secolo d'arte. Da qui puoi proseguire verso la Cosenza più contemporanea, quella del ponte di Calatrava e del planetario.`,
        en: `You have reached Piazza Carlo Bilotti, which locals called Piazza Fera for decades. Here the open-air museum reaches its finish line, and the square, redesigned above an underground car park, opens wide towards the buildings of the new town.

In the middle you are welcomed by The Warrior Philosophers by Giuseppe Gallo, an artist born in Rogliano, a few kilometres away. They are twelve rust-coloured Corten steel silhouettes, unveiled in 2017. Look at their feet, twisted as in the moment before a dance, and at their heads, bowed towards their chests like someone deep in thought: action and reflection in the same body.

One group of figures holds up a large ring engraved with the names of the peoples of Calabria: Bruttians, Arbëreshë, Occitans, Waldensians, Grecanici. Look among the silhouettes for the Sila wolf, which you already met in Piazza Kennedy, and for the bull looking back over its shoulder, symbol of ancient Sybaris.

Beside them rises Pietro Consagra's large Bifrontale in pink marble. Sit down and look back at the street you have walked: one kilometre of road, a century of art. From here you can carry on towards the most contemporary side of Cosenza, with Calatrava's bridge and the planetarium.`,
      },
      camera: { zoom: 17, bearing: -150, pitch: 40 },
    },
  ],
};
