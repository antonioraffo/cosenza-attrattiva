import type { SeedItinerary } from "../types";

export const itinerary: SeedItinerary = {
  slug: "la-via-del-magliocco",
  title: { it: "La via del Magliocco", en: "The Magliocco Trail" },
  subtitle: {
    it: "Tra i casali e i vigneti di Donnici, dove Cosenza diventa vino",
    en: "Through the hamlets and vineyards of Donnici, where Cosenza turns into wine",
  },
  intro: {
    it: "A pochi chilometri dal centro, sulle colline a sud della città, Cosenza cambia volto. Le strade si stringono, le case lasciano spazio agli ulivi e ai filari, e l'aria profuma di mosto. Questo itinerario ti porta a Donnici, frazione dalla lunga storia e terra di una delle denominazioni storiche della Calabria, tra chiese di paese, cantine di famiglia, vigne di Magliocco e un belvedere sulla valle del Crati. Il percorso è collinare: conviene muoversi in auto o in bici, e camminare nei tratti di borgo.",
    en: "Just a few kilometres from the centre, on the hills south of the city, Cosenza changes its face. Roads narrow, houses give way to olive trees and vine rows, and the air smells of fermenting must. This route takes you to Donnici, a district with a long history and home to one of Calabria's historic wine appellations, through village churches, family cellars, Magliocco vineyards and a viewpoint over the Crati valley. The route is hilly: travel by car or bike, and walk the village stretches.",
  },
  theme: "enogastronomia",
  difficulty: "media",
  color: "#5E1B2E",
  cover: "vigneti-magliocco-1",
  featured: true,
  chapters: [
    {
      place: "chiesa-san-michele-donnici",
      title: { it: "Il casale di San Michele", en: "St Michael's hamlet" },
      body: {
        it: `Hai lasciato alle spalle il traffico di Cosenza e la vecchia statale che corre verso sud. Una curva, poi un'altra, e la strada comincia a salire tra ulivi e muretti a secco. Benvenuto a Donnici Inferiore, il casale basso, quello che i vecchi chiamavano Donnici Sottano.

Davanti a te c'è la chiesa di San Michele Arcangelo, il patrono. Ogni 8 maggio la piazza si riempie di famiglie, di banda e di bancarelle; ma anche oggi, in un giorno qualunque, il sagrato è il luogo dove ci si saluta, ci si ferma, si chiede notizia della vendemmia.

Prova a immaginare la nascita di questo paese: secondo la tradizione, alla fine del IX secolo, gente in fuga dalla città esposta alle incursioni saracene cercò rifugio su queste alture. Da allora Donnici ha vissuto di terra, di acqua buona e di vino. Fu comune autonomo fino al 1857, quando divenne frazione di Cosenza.

Respira. L'aria è più fresca che in città, e porta un odore di erba e di legna. Da qui, scendendo appena verso la campagna, ti aspettano le porte socchiuse delle cantine.`,
        en: `You have left behind the traffic of Cosenza and the old state road running south. One bend, then another, and the road begins to climb between olive trees and dry-stone walls. Welcome to Donnici Inferiore, the lower hamlet, the one older people still call Donnici Sottano.

In front of you stands the church of St Michael the Archangel, the patron saint. Every 8 May the square fills with families, a brass band and market stalls; but even today, on an ordinary day, the church steps are where people greet each other, stop for a chat, and ask how the harvest is going.

Try to picture the birth of this village: according to tradition, at the end of the ninth century, people fleeing a city exposed to Saracen raids sought refuge on these heights. Ever since, Donnici has lived on its land, its good water and its wine. It was an independent municipality until 1857, when it became part of Cosenza.

Breathe in. The air is cooler than in town, and carries a scent of grass and woodsmoke. From here, heading just a little way into the countryside, the half-open doors of the wine cellars await you.`,
      },
      camera: { zoom: 15.5, bearing: -20, pitch: 45 },
    },
    {
      place: "cantine-donnici",
      title: { it: "Il profumo delle cantine", en: "The scent of the cellars" },
      body: {
        it: `Lo senti prima ancora di vederlo: un odore dolce e pungente insieme, di mosto, di legno bagnato, di terra fresca. A Donnici il vino non sta solo nelle aziende con l'insegna: sta nei magazzini sotto casa, nelle damigiane allineate, nei torchi che le famiglie tirano fuori ogni autunno.

Questo territorio ha dato il nome a una delle denominazioni storiche della Calabria, la DOC Donnici. Dal 2011 è diventato una sottozona della DOC Terre di Cosenza, che abbraccia i vigneti dell'intera provincia. Qui il rosso nasce da uve come Gaglioppo e Greco nero, e soprattutto dal Magliocco, il vitigno bandiera delle colline cosentine, che i contadini chiamano anche Arvino o Mantonico nero.

Se hai prenotato una visita, lasciati guidare: ti mostreranno le botti, ti racconteranno di nonni e vendemmie, ti verseranno un bicchiere scuro, quasi violaceo, dal tannino deciso. Assaggia lentamente, e lascia che il vino ti racconti la collina da cui viene.

Poi esci di nuovo all'aperto. Quel vino ha un luogo preciso di nascita, ed è proprio lì, lungo la strada che sale tra i filari.`,
        en: `You smell it before you see it: a scent that is sweet and sharp at once, of must, damp wood and fresh earth. In Donnici, wine does not live only in estates with a sign outside: it lives in storerooms beneath houses, in rows of demijohns, in the presses that families bring out every autumn.

This land gave its name to one of Calabria's historic appellations, the Donnici DOC. Since 2011 it has become a subzone of the Terre di Cosenza DOC, which covers vineyards across the whole province. Here red wine is born from grapes such as Gaglioppo and Greco Nero, and above all from Magliocco, the flagship variety of the hills around Cosenza, which farmers also call Arvino or Mantonico Nero.

If you have booked a visit, let yourself be guided: they will show you the barrels, tell you about grandparents and harvests, and pour you a dark, almost violet glass with firm tannins. Taste it slowly, and let the wine tell you about the hillside it comes from.

Then step back outside. That wine has a precise birthplace, and it lies right there, along the road climbing between the vine rows.`,
      },
      camera: { zoom: 15, bearing: 35, pitch: 50 },
    },
    {
      place: "vigneti-magliocco",
      title: { it: "Tra i filari del Magliocco", en: "Among the Magliocco vines" },
      body: {
        it: `Ora sei in mezzo alla campagna. A destra e a sinistra la collina si apre in piccoli appezzamenti: filari di vite, ulivi contorti, fichi, orti chiusi da reti e canne. È una viticoltura fatta a mano, su parcelle minuscole passate di padre in figlio.

Fermati sul bordo della strada e osserva un grappolo di Magliocco, se è stagione: acini scuri, buccia spessa, un velo di pruina che sembra polvere d'argento. È un'uva che matura tardi, e chiede pazienza. Qui, tra i 450 e i 550 metri, il sole d'estate scalda le foglie, ma la sera scende dalla Sila un'aria fresca che preserva i profumi.

Ascolta: il ronzio delle api, un trattore lontano, il vento che fa frusciare i pampini. In settembre e ottobre questa strada si riempie di cassette, forbici e voci, e ogni famiglia ha la sua vendemmia da portare a termine.

Mentre la città si espandeva nel Novecento, proprio in queste frazioni collinari la vite ha resistito. Ricordatelo mentre riprendi la salita: in cima ti aspetta il borgo più alto di Donnici, con i suoi vicoli quieti.`,
        en: `Now you are deep in the countryside. On either side the hill opens into small plots: vine rows, twisted olive trees, fig trees, vegetable gardens fenced with netting and cane. This is hand-made winegrowing, on tiny parcels handed down from parent to child.

Stop at the roadside and look at a bunch of Magliocco, if it is the season: dark berries, thick skin, a bloom that looks like silver dust. It is a late-ripening grape that asks for patience. Here, between 450 and 550 metres, the summer sun warms the leaves, but in the evening cool air drifts down from the Sila and preserves the aromas.

Listen: the hum of bees, a distant tractor, the wind rustling through the vine leaves. In September and October this road fills with crates, shears and voices, and every family has its own harvest to bring in.

While the city expanded in the twentieth century, it was in these hill districts that the vine held on. Keep that in mind as you resume the climb: at the top, the highest village of Donnici awaits, with its quiet lanes.`,
      },
      camera: { zoom: 14.5, bearing: 120, pitch: 55 },
    },
    {
      place: "donnici-borgo",
      title: { it: "Il borgo alto", en: "The upper village" },
      body: {
        it: `Donnici Superiore ti accoglie con le sue case strette, le scale esterne, i gerani sui davanzali. È il vecchio Donnici Soprani, a circa 540 metri, più piccolo e raccolto del casale basso. Il paese è famoso per il clima e per l'acqua, quella dell'acquedotto dello Zumpo, che i più anziani considerano la migliore della zona.

Cammina senza fretta. Senti i passi rimbalzare sui muri, una radio accesa dietro una finestra, il rintocco di una campana. Il 13 giugno qui si festeggia Sant'Antonio, il patrono, e le vie si riempiono di luminarie; in autunno, insieme al casale basso, si celebra la festa del vino.

Questo borgo custodisce anche una pagina del Novecento: nell'estate del 1943 ospitò un reggimento contraereo tedesco, con il comando nella scuola elementare e le truppe accampate sulla collina di fronte. Il 9 settembre, il giorno dopo l'armistizio, i soldati partirono in tutta fretta verso Salerno, e il paese tirò un sospiro di sollievo.

Segui ora la strada fino alle ultime case. Lì il terreno si apre all'improvviso, e la valle intera ti si spalanca davanti.`,
        en: `Donnici Superiore welcomes you with its narrow houses, outdoor staircases and geraniums on the windowsills. This is old Donnici Soprani, at about 540 metres, smaller and more compact than the lower hamlet. The village is famous for its climate and its water, from the Zumpo aqueduct, which older residents consider the best in the area.

Walk without hurrying. Hear your footsteps echo off the walls, a radio playing behind a window, the toll of a bell. On 13 June the village celebrates St Anthony, its patron saint, and the streets fill with festive lights; in autumn, together with the lower hamlet, it holds the wine festival.

This village also keeps a page from the twentieth century: in the summer of 1943 it hosted a German anti-aircraft regiment, headquartered in the primary school, with troops camped on the hill opposite. On 9 September, the day after the armistice, the soldiers left in great haste for Salerno, and the village breathed a sigh of relief.

Now follow the road to the last houses. There the ground suddenly opens up, and the whole valley spreads out before you.`,
      },
      camera: { zoom: 16, bearing: -75, pitch: 40 },
    },
    {
      place: "belvedere-valle-crati",
      title: { it: "Un brindisi alla valle", en: "A toast to the valley" },
      body: {
        it: `Eccoti sul ciglio. Sotto di te la valle del Crati si stende verso nord, dove il fiume raggiunge Cosenza e incontra il Busento. Di fronte, sul versante opposto, i paesi della Presila; più in alto, scuri e compatti, i boschi della Sila.

Questa posizione ha sempre fatto gola. Nell'agosto del 1860, raccontano le cronache locali, Donnici fu un avamposto dei garibaldini, che il 30 dello stesso mese scesero verso il Savuto fino a Soveria Mannelli, dove migliaia di soldati borbonici si arresero. Su una collina vicina, Cozzo Piricheco, una stele ricorda quei giorni, ormai quasi nascosta dalla vegetazione.

Ma adesso lascia andare la storia e guarda la luce. Se sei arrivato al tramonto, i filari che hai attraversato si accendono di rame, e sull'altro versante i paesi cominciano a punteggiarsi di luci, uno dopo l'altro.

Se hai con te una bottiglia presa in cantina, questo è il momento di aprirla. Alza il bicchiere verso la valle: stai brindando a secoli di lavoro, di vendemmie e di famiglie che hanno disegnato questo paesaggio. La via del Magliocco finisce qui, ma il sapore resta.`,
        en: `Here you are at the edge. Below you the Crati valley stretches north, to where the river reaches Cosenza and meets the Busento. Opposite, on the far slope, lie the Presila villages; higher up, dark and dense, the forests of the Sila.

This position has always been coveted. In August 1860, local chronicles tell, Donnici was an outpost for Garibaldi's volunteers, who on the 30th of that month went down towards the Savuto as far as Soveria Mannelli, where thousands of Bourbon soldiers surrendered. On a nearby hill, Cozzo Piricheco, a memorial stone recalls those days, now almost hidden by vegetation.

But now let history go and look at the light. If you have arrived at sunset, the vine rows you walked through glow copper, and across the valley the villages begin to light up, one after another.

If you have a bottle from the cellar with you, this is the moment to open it. Raise your glass to the valley: you are toasting centuries of work, of harvests and of families who shaped this landscape. The Magliocco Trail ends here, but the taste lingers on.`,
      },
      camera: { zoom: 14, bearing: 90, pitch: 60 },
    },
  ],
};
