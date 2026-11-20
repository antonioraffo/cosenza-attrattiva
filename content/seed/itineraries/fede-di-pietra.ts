import type { SeedItinerary } from "../types";

export const itinerary: SeedItinerary = {
  slug: "fede-di-pietra",
  title: {
    it: "Fede di pietra",
    en: "Faith in Stone",
  },
  subtitle: {
    it: "Quattro chiese e otto secoli di devozione",
    en: "Four churches and eight centuries of devotion",
  },
  intro: {
    it: `Quattro chiese, otto secoli di fede. Questo breve cammino, quasi tutto in discesa, parte dalla cattedrale consacrata davanti a un imperatore e arriva, oltre il fiume, alla chiesa legata al santo più amato di Calabria. Lungo la strada incontri una regina di Francia, un'icona che secondo la tradizione salvò la città dalla peste, frati francescani e domenicani, chiostri silenziosi e portali scolpiti. È un percorso facile, da fare con calma, lasciando che sia la pietra a raccontare.`,
    en: `Four churches, eight centuries of faith. This short walk, mostly downhill, starts at the cathedral consecrated in front of an emperor and ends, across the river, at the church tied to Calabria's best-loved saint. Along the way you meet a queen of France, an icon that tradition says saved the city from the plague, Franciscan and Dominican friars, quiet cloisters and carved doorways. It is an easy route, best taken slowly, letting the stone tell the story.`,
  },
  theme: "fede",
  difficulty: "facile",
  color: "#8A6D3B",
  cover: "duomo-1",
  featured: false,
  chapters: [
    {
      place: "duomo",
      title: {
        it: "La cattedrale dell'imperatore",
        en: "The Emperor's Cathedral",
      },
      body: {
        it: `Sali la larga scalinata e fermati davanti alla facciata: tre portali, tre rosoni, una pietra che al tramonto prende il colore del miele. La cattedrale che vedi nasce dopo il terremoto del 1184, che aveva quasi raso al suolo la chiesa più antica. Il 30 gennaio 1222 viene consacrata solennemente, alla presenza dell'imperatore Federico Secondo di Svevia, che per l'occasione dona alla città una preziosa stauroteca, un reliquiario a forma di croce oggi custodito nel vicino Museo diocesano.

Entra. Dopo secoli di stucchi barocchi, i restauri hanno restituito le linee sobrie dell'origine. Nel transetto di sinistra trovi il sepolcro gotico di Isabella d'Aragona, regina di Francia. Nel gennaio del 1271, di ritorno dalla crociata di Tunisi, cade da cavallo guadando il fiume Savuto. È incinta; viene portata a Cosenza e qui muore. Il suo corpo sarà trasferito a Saint-Denis, ma la tomba resta, con la regina inginocchiata davanti alla Vergine.

Lungo la navata sinistra, una cappella custodisce il cuore della devozione cosentina: l'icona bizantina della Madonna del Pilerio, che allatta il Bambino. La tradizione racconta che nel 1576, durante la peste, sul volto della Vergine comparve un bubbone, come se avesse preso su di sé il male della città. Da allora è la patrona di Cosenza.

Esci nella luce della piazza: pochi passi in salita ti portano dai frati di Francesco.`,
        en: `Climb the broad flight of steps and stop in front of the facade: three doorways, three rose windows, stone that turns the colour of honey at sunset. The cathedral you see rose after the earthquake of 1184, which had almost levelled the older church. On the thirtieth of January 1222 it was solemnly consecrated in the presence of the Emperor Frederick the Second of Swabia, who marked the occasion by giving the city a precious staurotheca, a cross-shaped reliquary now kept in the nearby Diocesan Museum.

Go inside. After centuries of Baroque stucco, restoration has brought back the original, sober lines. In the left transept you will find the Gothic tomb of Isabella of Aragon, queen of France. In January 1271, returning from the crusade at Tunis, she fell from her horse while fording the river Savuto. She was pregnant; she was carried to Cosenza, and here she died. Her body was later moved to Saint-Denis, but the tomb remains, showing the queen kneeling before the Virgin.

Along the left aisle, a chapel holds the heart of Cosenza's devotion: the Byzantine icon of the Madonna del Pilerio, nursing the Child. Tradition says that in 1576, during the plague, a sore appeared on the Virgin's face, as if she had taken the city's sickness upon herself. Ever since, she has been the patron of Cosenza.

Step back out into the light of the square: a short climb brings you to the friars of Saint Francis.`,
      },
      camera: { zoom: 18, bearing: -25, pitch: 50 },
    },
    {
      place: "san-francesco-assisi",
      title: {
        it: "Il convento sopra i tetti",
        en: "The Friary Above the Rooftops",
      },
      body: {
        it: `Piazza Marco Berardi è un piccolo slargo nel quartiere della Giostra Vecchia, poco più in alto del Duomo. Qui sorgono la chiesa e il convento di San Francesco d'Assisi, il complesso religioso più importante della città dopo la cattedrale. La tradizione ne fa risalire le origini al 1217, quando Francesco era ancora vivo e i suoi frati percorrevano l'Italia a piedi.

Dentro, la chiesa a croce latina, con tre navate, ti accoglie in una penombra calda. Al centro del presbiterio si alza un grande altare di legno del Settecento, e sopra di esso il Perdono d'Assisi dipinto da Daniele Russo nel 1618. Nella navata sinistra trovi un crocifisso di legno del Seicento e una Madonna con il Bambino in marmo, chiamata Madonna della Febbre.

Se la sagrestia è aperta, alza gli occhi: il soffitto di legno dipinto e un grande armadio intagliato raccontano la Passione di Cristo e le storie dei frati. Sulle pareti affiorano affreschi dei primi del Quattrocento, e un dipinto di San Francesco di Paola anticipa l'ultima tappa del cammino.

Nel convento oggi lavorano i restauratori: qui ha sede un laboratorio per la conservazione dei beni artistici e storici della Calabria. La fede, in questo luogo, si prende cura della bellezza.

Ora scendi verso il fiume. Sull'altra riva del Busento ti aspettano i frati predicatori di San Domenico.`,
        en: `Piazza Marco Berardi is a small open space in the Giostra Vecchia quarter, a little higher up than the cathedral. Here stand the church and friary of San Francesco d'Assisi, the most important religious complex in the city after the cathedral. Tradition dates its origins to 1217, when Francis himself was still alive and his friars were crossing Italy on foot.

Inside, the Latin-cross church with its three aisles greets you with a warm half-light. In the middle of the sanctuary rises a great eighteenth-century wooden altar, and above it the Pardon of Assisi, painted by Daniele Russo in 1618. In the left aisle you will find a seventeenth-century wooden crucifix and a marble Madonna and Child known as the Madonna della Febbre, Our Lady of the Fever.

If the sacristy is open, look up: the painted wooden ceiling and a large carved cupboard tell the story of the Passion of Christ and the lives of the friars. Frescoes from the early fifteenth century surface on the walls, and a painting of Saint Francis of Paola gives you a preview of the last stop on this walk.

Today the friary is home to restorers: it houses a laboratory for the conservation of Calabria's artistic and historic heritage. Here, faith takes care of beauty.

Now head down towards the river. On the far bank of the Busento, the preaching friars of San Domenico are waiting.`,
      },
      camera: { zoom: 18, bearing: 45, pitch: 45 },
    },
    {
      place: "san-domenico",
      title: {
        it: "La rosa di pietra",
        en: "The Stone Rose",
      },
      body: {
        it: `Attraversi il Busento e arrivi in piazza Tommaso Campanella, dove la città antica incontra quella moderna. Davanti a te si alza la facciata di San Domenico. Guarda il rosone: sedici colonnine disposte a raggiera, come i petali di una rosa di pietra. Sotto, l'arco gotico incornicia una porta di legno intagliata nel 1614 per la famiglia Cavalcanti, con stemmi, fiori e figure di santi.

La chiesa nasce nel Quattrocento per volontà dei Sanseverino: nel 1448 Antonio Sanseverino cede ai domenicani il suo palazzo e i terreni vicini perché vi costruiscano il nuovo convento. Dentro, la luce scende dalla cupola e accende gli stucchi barocchi e l'altare di marmi colorati. Cerca la Madonna della Febbre scolpita da Giovanni da Nola nel 1540: è il modello della statua che hai appena visto in San Francesco.

Nel 1588 questo convento ospita un giovane frate calabrese, Tommaso Campanella, arrivato a Cosenza attratto dal pensiero di Bernardino Telesio. Anni dopo scriverà La città del Sole.

Oggi i chiostri, sospesi tra gotico e Rinascimento, accolgono il BoCs Art Museum e le opere di centinaia di artisti contemporanei: un altro modo di cercare la luce.

Ora attraversa il Crati sul ponte Alarico. Sull'altra sponda c'è la chiesa del santo che i calabresi sentono più vicino.`,
        en: `You cross the Busento and arrive in Piazza Tommaso Campanella, where the old city meets the new. In front of you rises the facade of San Domenico. Look at the rose window: sixteen slender columns arranged like spokes, like the petals of a stone rose. Below it, the Gothic arch frames a wooden door carved in 1614 for the Cavalcanti family, with coats of arms, flowers and figures of saints.

The church was born in the fifteenth century thanks to the Sanseverino family: in 1448 Antonio Sanseverino gave the Dominicans his palace and the surrounding land so they could build a new friary. Inside, light falls from the dome onto the Baroque stucco and the altar of coloured marble. Look for the Madonna della Febbre carved by Giovanni da Nola in 1540: it is the model for the statue you have just seen in San Francesco.

In 1588 this friary welcomed a young Calabrian friar, Tommaso Campanella, drawn to Cosenza by the ideas of Bernardino Telesio. Years later he would write The City of the Sun.

Today the cloisters, poised between Gothic and Renaissance, host the BoCs Art Museum and the work of hundreds of contemporary artists: another way of seeking the light.

Now cross the Crati on the Alarico bridge. On the other bank stands the church of the saint Calabrians feel closest to.`,
      },
      camera: { zoom: 17.5, bearing: -55, pitch: 40 },
    },
    {
      place: "san-francesco-di-paola",
      title: {
        it: "La grotta del santo",
        en: "The Saint's Grotto",
      },
      body: {
        it: `Oltre il Crati, ai piedi della collina, una chiesa semplice ti accoglie con un bel portale gotico. È dedicata a San Francesco di Paola, l'eremita calabrese che fondò l'ordine dei Minimi, patrono della Calabria e della gente di mare. La tradizione lega questo luogo direttamente a lui: il santo vi avrebbe fondato un convento nel Quattrocento e ne avrebbe fatto una delle sue dimore.

Dietro l'edificio si trova quella che tutti chiamano la grotta del santo. Secondo la tradizione Francesco vi si ritirava in preghiera, e vi si conserva una croce di legno che lui stesso avrebbe lasciato. Entra in silenzio: senti il fresco della roccia, l'odore di cera e di pietra umida.

Nella navata unica cerca la Madonna con il Bambino in gloria tra i santi Paolo e Luca, dipinta da Pietro Negroni nel 1551, e nell'abside il trittico cinquecentesco di Cristoforo Faffeo con la Madonna di Loreto. Dietro l'altare c'è un coro di legno intagliato nel 1679 da Domenico Costanzo da Rogliano.

Il tuo cammino finisce qui, dove la città incontra il fiume. Voltati indietro: dal Duomo a questa grotta hai attraversato otto secoli e due fiumi. La fede di Cosenza è fatta di pietra, ma anche di gesti semplici: una candela accesa, una preghiera sussurrata, un passo dopo l'altro.`,
        en: `Across the Crati, at the foot of the hill, a simple church greets you with a handsome Gothic doorway. It is dedicated to Saint Francis of Paola, the Calabrian hermit who founded the Order of Minims, patron saint of Calabria and of seafarers. Tradition ties this place directly to him: the saint is said to have founded a friary here in the fifteenth century and to have made it one of his homes.

Behind the building lies what everyone calls the saint's grotto. According to tradition, Francis withdrew here to pray, and a wooden cross he is said to have left behind is still kept inside. Enter quietly: feel the coolness of the rock, the smell of candle wax and damp stone.

In the single nave, look for the Madonna and Child in Glory with Saints Paul and Luke, painted by Pietro Negroni in 1551, and in the apse the sixteenth-century triptych by Cristoforo Faffeo showing the Madonna of Loreto. Behind the altar is a wooden choir carved in 1679 by Domenico Costanzo of Rogliano.

Your walk ends here, where the city meets the river. Look back: from the cathedral to this grotto you have crossed eight centuries and two rivers. The faith of Cosenza is made of stone, but also of simple gestures: a lit candle, a whispered prayer, one step after another.`,
      },
      camera: { zoom: 17.5, bearing: 25, pitch: 35 },
    },
  ],
};
