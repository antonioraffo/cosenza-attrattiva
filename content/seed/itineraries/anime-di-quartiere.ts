import type { SeedItinerary } from "../types";

export const itinerary: SeedItinerary = {
  slug: "anime-di-quartiere",
  title: { it: "Anime di quartiere", en: "Souls of the Quarters" },
  subtitle: {
    it: "Mestieri, mercati e memorie dai rioni della città vecchia a Via Popilia",
    en: "Crafts, markets and memories from the old-town quarters to Via Popilia",
  },
  intro: {
    it: "Cosenza non è fatta solo di monumenti: è fatta di rioni, ognuno con la sua voce. Questo itinerario ti accompagna dalla piazza di mercato dei Rivocati ai vicoli di Santa Lucia, dalla piazza del Duomo al rione dei vasai, dalle antiche concerie dello Spirito Santo ai panorami di Portapiana, fino al quartiere popolare di Via Popilia. Ascolterai storie di artigiani, fiere, partenze e ritorni: la vita quotidiana che, secolo dopo secolo, ha dato un'anima alla città.",
    en: "Cosenza is not made only of monuments: it is made of quarters, each with its own voice. This route takes you from the market square of Rivocati to the alleys of Santa Lucia, from the cathedral square to the potters' quarter, from the old tanneries of Spirito Santo to the views of Portapiana, and finally to the working-class district of Via Popilia. You will hear stories of craftspeople, fairs, departures and homecomings: the everyday life that, century after century, gave the city its soul.",
  },
  theme: "quartieri",
  difficulty: "media",
  color: "#3D4A7A",
  cover: "quartiere-portapiana-1",
  featured: false,
  chapters: [
    {
      place: "quartiere-rivocati",
      title: { it: "La piazza degli arrivi", en: "The square of arrivals" },
      body: {
        it: `Comincia da qui, da Piazza della Riforma, dove per secoli Cosenza ha incontrato la sua campagna. Immagina l'alba di un giorno di mercato di cent'anni fa: muli carichi di ceste, contadine con i fazzoletti in testa, odore di formaggio, di castagne, di legna appena tagliata. Chi scendeva dai paesi dell'entroterra si fermava proprio in questa piazza.

Il quartiere si chiama Rivocati, e la tradizione racconta che il nome venga dagli esuli che in età sveva si rifugiavano qui e venivano poi «revocati», richiamati in città. Un luogo di confine, dunque, fin dall'inizio: tra dentro e fuori, tra partenza e ritorno.

Oggi la piazza è pedonale, con alberi e panchine, e il via vai non si è mai fermato: autobus per i paesi, studenti, pensionati che discutono di calcio. Lungo Via Rivocati noterai il palazzo delle Regie Poste, del 1927, segno di una città che cominciava a crescere fuori dalle sue mura.

Ora segui la strada verso il fiume. Il ponte Mario Martire ti porta dall'altra parte del Busento, dove la città vecchia ti aspetta con il suo primo rione.`,
        en: `Start here, in Piazza della Riforma, where for centuries Cosenza met its countryside. Picture the dawn of a market day a hundred years ago: mules laden with baskets, women from the villages with scarves on their heads, the smell of cheese, chestnuts and freshly cut firewood. Anyone coming down from the inland villages stopped right in this square.

The quarter is called Rivocati, and tradition says the name comes from the exiles who in Swabian times took refuge here and were later 'revoked', called back into the city. A border place, then, from the very start: between inside and outside, between leaving and returning.

Today the square is pedestrianised, with trees and benches, and the coming and going has never stopped: buses to the villages, students, pensioners arguing about football. Along Via Rivocati you will notice the Royal Post Office building from 1927, a sign of a city that was beginning to grow beyond its walls.

Now follow the street towards the river. The Mario Martire bridge carries you across the Busento, where the old town awaits you with its first quarter.`,
      },
      camera: { zoom: 17, bearing: 70, pitch: 45 },
    },
    {
      place: "quartiere-santa-lucia",
      title: { it: "Voci dai balconi di Santa Lucia", en: "Voices from Santa Lucia's balconies" },
      body: {
        it: `Hai attraversato il fiume, e tutto cambia. Le strade si stringono, le case salgono alte e strette, i balconi in ferro battuto quasi si toccano sopra la tua testa. Sei nel rione di Santa Lucia, uno dei rioni bassi della Cosenza vecchia, raccolto attorno a una piccola piazza e alla chiesetta della santa.

Alle tue spalle c'è Piazza dei Valdesi, che porta una memoria dolorosa: nel giugno del 1561 qui furono messi al rogo alcuni valdesi di Calabria, colpevoli solo della loro fede. Fermati un istante in silenzio.

Poi lasciati raccontare il rione dai suoi rumori. Immagina una sarta che cuce accanto alla finestra per rubare la luce, un calzolaio che batte una suola sull'uscio, il grido di un venditore ambulante, una madre che chiama i figli dal terzo piano. Qui la vita si è sempre svolta un po' in casa e un po' in strada, e le scale erano il salotto di tutti.

Sopra di te, la chiesa delle Cappuccinelle guarda la valle del Crati. Ma la tua strada ora sale verso il cuore della città: segui le gradinate e il corso, fino alla piazza della cattedrale.`,
        en: `You have crossed the river, and everything changes. The streets narrow, the houses rise tall and thin, and the wrought-iron balconies almost touch above your head. You are in the Santa Lucia quarter, one of the lower quarters of old Cosenza, gathered around a small square and the saint's little church.

Behind you lies Piazza dei Valdesi, which carries a painful memory: in June 1561, several Waldensians of Calabria were burned at the stake here, guilty only of their faith. Pause for a moment in silence.

Then let the quarter tell its story through its sounds. Imagine a seamstress sewing by the window to steal the light, a shoemaker hammering a sole on the doorstep, the cry of a street vendor, a mother calling her children from the third floor. Here life has always been lived half indoors and half in the street, and the stairways were everyone's living room.

Above you, the church of the Cappuccinelle looks out over the Crati valley. But your path now climbs towards the heart of the city: follow the stairways and the main street up to the cathedral square.`,
      },
      camera: { zoom: 17.5, bearing: -30, pitch: 50 },
    },
    {
      place: "duomo",
      title: { it: "La piazza degli speziali", en: "The apothecaries' square" },
      body: {
        it: `Eccoti nella piazza del Duomo, il salotto della città vecchia. Ma prima di alzare lo sguardo verso la facciata, guarda la piazza stessa: per secoli non è stata solo il sagrato della cattedrale, ma un luogo di lavoro e di commercio.

L'hanno chiamata piazza Grande, piazza del Seggio, perché vicina al Sedile dove si riunivano i rappresentanti della città, e dal Cinquecento piazza degli aromatici e degli speziali, perché qui si vendevano erbe, spezie e medicamenti. Prova a sentirne gli odori: cannella, chiodi di garofano, erbe officinali in grandi vasi, il vociare di chi contrattava il prezzo di un rimedio.

Tutto intorno, le strade portavano i nomi dei mestieri: poco lontano, la via che sfocia in Piazza Parrasio era nota come la strada degli orefici. La città vecchia era organizzata così, per botteghe e corporazioni, e ogni rione aveva il suo lavoro.

Oggi su questa piazza si affacciano palazzi signorili, il Museo Diocesano, le botteghe degli artisti. Ora scendi verso il Crati: oltre il ponte dei Pignatari ti aspetta il rione dei vasai.`,
        en: `Here you are in the cathedral square, the drawing room of the old town. But before looking up at the façade, look at the square itself: for centuries it was not just the cathedral forecourt, but a place of work and trade.

It was called Piazza Grande, Piazza del Seggio, because it stood near the Sedile where the city's representatives met, and from the sixteenth century the square of the aromatics and apothecaries, because herbs, spices and remedies were sold here. Try to catch the scents: cinnamon, cloves, medicinal herbs in large jars, the chatter of people haggling over the price of a cure.

All around, the streets bore the names of trades: not far away, the street leading into Piazza Parrasio was known as the goldsmiths' street. The old town was organised like this, by workshops and guilds, and each quarter had its own work.

Today noble palaces, the Diocesan Museum and artists' studios look onto this square. Now head down towards the Crati: beyond the Pignatari bridge, the potters' quarter awaits you.`,
      },
      camera: { zoom: 17.5, bearing: 150, pitch: 40 },
    },
    {
      place: "quartiere-massa",
      title: { it: "Il rione dei vasai", en: "The potters' quarter" },
      body: {
        it: `Il ponte che hai appena attraversato si chiama dei Pignatari, e il nome è un ritratto: i pignatari erano gli artigiani della terracotta, quelli che modellavano le pignatte, le pentole panciute che bollivano su ogni focolare. Sei nella Massa, il rione sulla sponda destra del Crati.

Immagina il lavoro lungo il fiume: l'argilla impastata con l'acqua, il tornio che gira, i vasi messi ad asciugare al sole prima della cottura. E poco più in là, Piazza Arenella, un tempo spazio di mercato, dove ancora oggi, ogni marzo, arriva la Fiera di San Giuseppe, una tradizione che le fonti fanno risalire al Duecento. In quei giorni la città intera scende qui tra bancarelle di attrezzi, dolci e utensili.

Davanti a te c'è il complesso di Sant'Agostino, nato all'inizio del Cinquecento. È stato convento, poi caserma dopo le soppressioni del 1810, poi carcere sotto i Borbone. Dal 2009 è il Museo dei Brettii e degli Enotri, e custodisce la memoria dei popoli più antichi della Calabria.

Ora riattraversa il fiume e cerca, a pochi passi, una piazza con una fontana rotonda: è il rione dei conciatori.`,
        en: `The bridge you have just crossed is called the Pignatari bridge, and the name is a portrait: the pignatari were terracotta craftsmen, the ones who shaped pignatte, the round-bellied pots that bubbled on every hearth. You are in the Massa, the quarter on the right bank of the Crati.

Imagine the work along the river: clay kneaded with water, the turning wheel, pots set out to dry in the sun before firing. And a little further on, Piazza Arenella, once a market space, where every March the Fair of St Joseph still arrives, a tradition the sources trace back to the thirteenth century. In those days the whole city comes down here among stalls of tools, sweets and household goods.

In front of you stands the Sant'Agostino complex, founded at the beginning of the sixteenth century. It has been a convent, then a barracks after the suppressions of 1810, then a prison under the Bourbons. Since 2009 it has been the Museum of the Brettii and Enotri, keeping the memory of Calabria's most ancient peoples.

Now cross the river again and look, just a few steps away, for a square with a round fountain: it is the tanners' quarter.`,
      },
      camera: { zoom: 17, bearing: -110, pitch: 45 },
    },
    {
      place: "quartiere-spirito-santo",
      title: { it: "Le concerie dello Spirito Santo", en: "The tanneries of Spirito Santo" },
      body: {
        it: `Piazza Spirito Santo si apre davanti a te, con la sua fontana circolare e la chiesa che dal 1513 appartenne alle suore domenicane. Oggi è un luogo tranquillo, ma nel Cinquecento questo era il rione più popoloso di tutta Cosenza.

Lo chiamavano il quartiere delle Concerie. Qui lavoravano numerosi artigiani e conciatori: le pelli venivano immerse in grandi vasche, raschiate, battute, stese ad asciugare. Prova a immaginare l'odore acre che saliva dalle botteghe, il rumore dei mazzuoli, i garzoni che correvano verso i sellai e i calzolai della città con fasci di cuoio sulle spalle. Era un lavoro duro, ma dava pane a centinaia di famiglie.

Guardati intorno: Palazzo Monaco, del Seicento, ricorda che accanto alle botteghe vivevano anche famiglie nobili. Su un lato della piazza c'è la scuola costruita in epoca fascista e intitolata a Carmela Borrelli, dove generazioni di bambini del rione hanno imparato a leggere.

Da qui partono le scale mobili che salgono verso Piazza XV Marzo. Ma tu prendi la strada più antica e continua a salire: sotto il Castello, ti aspetta il rione con la vista più bella.`,
        en: `Piazza Spirito Santo opens before you, with its round fountain and the church that from 1513 belonged to the Dominican nuns. Today it is a quiet place, but in the sixteenth century this was the most populous quarter in all of Cosenza.

People called it the Tanneries quarter. Many craftsmen and tanners worked here: hides were soaked in large vats, scraped, beaten and stretched out to dry. Try to imagine the sharp smell rising from the workshops, the thud of mallets, apprentices running to the city's saddlers and shoemakers with bundles of leather on their shoulders. It was hard work, but it put bread on the table for hundreds of families.

Look around you: the seventeenth-century Palazzo Monaco is a reminder that noble families lived alongside the workshops. On one side of the square stands the school built in the Fascist era and named after Carmela Borrelli, where generations of local children learned to read.

From here the escalators climb towards Piazza XV Marzo. But take the older route and keep climbing: below the Castle, the quarter with the finest view awaits you.`,
      },
      camera: { zoom: 17.5, bearing: 20, pitch: 50 },
    },
    {
      place: "quartiere-portapiana",
      title: { it: "Lo sguardo di Portapiana", en: "The view from Portapiana" },
      body: {
        it: `Il fiato si fa corto: Via Portapiana sale ripida tra case basse, muri di pietra e piccoli orti a terrazza. Sei in uno dei rioni alti della città vecchia, sulle pendici del colle dove sorge il Castello normanno-svevo. Il nome ricorda un'antica porta: da qui si usciva verso le campagne e i casali del sud.

Per secoli questo rione è stato un po' appartato, abitato da famiglie che vivevano della terra e dei mestieri. Poi, negli anni Sessanta, il ponte Pietro Mancini lo ha collegato alla città moderna. Negli stessi decenni, come da tanti rioni del centro storico, molti partirono: per il Nord, per la Germania, per le Americhe. Immagina una valigia di cartone legata con lo spago, una madre affacciata alla finestra, le lettere che arrivavano da lontano con dentro qualche fotografia.

Ora voltati. Da quassù vedi tutta Cosenza: i tetti del centro storico, la confluenza dei fiumi, la città nuova che si allunga verso nord. Laggiù, lungo il Crati, si distende un quartiere nato proprio quando questi vicoli si svuotavano.

È lì che finisce il tuo viaggio: scendi in città e raggiungi Via Popilia, in autobus o in auto.`,
        en: `You are short of breath: Via Portapiana climbs steeply between low houses, stone walls and small terraced gardens. You are in one of the upper quarters of the old town, on the slopes of the hill crowned by the Norman-Swabian Castle. The name recalls an ancient gate: from here people left for the countryside and the villages to the south.

For centuries this quarter stayed somewhat apart, home to families who lived from the land and from crafts. Then, in the 1960s, the Pietro Mancini bridge linked it to the modern city. In those same decades, as from many old-town quarters, many people left: for the north, for Germany, for the Americas. Picture a cardboard suitcase tied with string, a mother leaning out of the window, letters arriving from far away with a few photographs inside.

Now turn around. From up here you can see all of Cosenza: the rooftops of the old town, the meeting of the rivers, the new city stretching north. Down there, along the Crati, lies a district born just as these alleys were emptying.

That is where your journey ends: head down into town and reach Via Popilia by bus or by car.`,
      },
      camera: { zoom: 16.5, bearing: 10, pitch: 55 },
    },
    {
      place: "quartiere-via-popilia",
      title: { it: "La città nuova sulla strada antica", en: "The new city on the ancient road" },
      body: {
        it: `Via Popilia è lunga, dritta, piena di traffico e di vita. Il suo nome viene da molto lontano: è quello dell'antica strada romana che, dal 132 a.C., collegava Capua a Reggio passando per Cosentia. Nel 2022, durante alcuni scavi, lungo questa via sono state trovate sei tombe romane «alla cappuccina», coperte da tegole a spiovente. La storia, qui, è letteralmente sotto i tuoi piedi.

Ma il quartiere che vedi è giovane. Fino agli anni Sessanta Cosenza era una città raccolta tra i fiumi; poi arrivarono i grandi programmi di edilizia popolare, e su questa piana sorsero palazzi a più piani, cortili, scuole, parrocchie. Ci vennero ad abitare famiglie dal centro storico e dai paesi della provincia, in cerca di case più asciutte e di lavoro.

Guardati intorno: i panni stesi tra i balconi, il mercato del mattino, i ragazzi in bicicletta, gli anziani seduti davanti al bar. Non sono poi così diversi dalle voci che hai ascoltato a Santa Lucia o allo Spirito Santo.

Le anime dei quartieri cambiano casa, ma non smettono di parlarsi. Il tuo viaggio finisce qui, tra la città antica e quella che continua a crescere.`,
        en: `Via Popilia is long, straight, full of traffic and full of life. Its name comes from far away: it belonged to the ancient Roman road that, from 132 BC, linked Capua to Reggio, passing through Cosentia. In 2022, during excavation work, six Roman 'cappuccina' tombs covered with pitched tiles were found along this street. Here, history is literally beneath your feet.

But the district you see is young. Until the 1960s Cosenza was a compact city gathered between its rivers; then came large public housing programmes, and on this plain rose multi-storey blocks, courtyards, schools and parishes. Families moved here from the old town and from the province's villages, in search of drier homes and work.

Look around you: washing strung between balconies, the morning market, kids on bicycles, older people sitting outside the café. They are not so different from the voices you heard in Santa Lucia or Spirito Santo.

The souls of the quarters may change homes, but they never stop talking to each other. Your journey ends here, between the ancient city and the one that keeps on growing.`,
      },
      camera: { zoom: 16, bearing: -160, pitch: 40 },
    },
  ],
};
